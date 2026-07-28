/**
 * Client-side audio helpers for the quiz player.
 *
 * - Text-to-speech via the browser's Web Speech API (no assets or API keys needed)
 * - Correct/wrong sound effects synthesized with WebAudio (no audio files needed)
 *
 * All functions are safe to call on any browser: they no-op when the APIs
 * are unavailable (e.g. during SSR or on very old browsers).
 */

import type { LessonLanguage } from '@/types'

// BCP-47 locale for each lesson language
const LOCALE: Record<LessonLanguage, string> = {
  en: 'en-US',
  ms: 'ms-MY',
  zh: 'zh-CN',
  ar: 'ar-SA',
}

// Preferred voice language prefixes, in order. Many devices ship no Malay
// voice, so Indonesian (mutually intelligible pronunciation) is the fallback.
const VOICE_FALLBACKS: Record<LessonLanguage, string[]> = {
  en: ['en'],
  ms: ['ms', 'id'],
  zh: ['zh', 'cmn'],
  ar: ['ar'],
}

// Strip emoji and pictographs so the voice doesn't read "red circle red circle"
function cleanForSpeech(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}️‍]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Voices load asynchronously in some browsers — warm the list up early
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}

function pickVoice(language: LessonLanguage): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  for (const prefix of VOICE_FALLBACKS[language]) {
    const match = voices.find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(prefix))
    if (match) return match
  }
  return null
}

/**
 * Read text aloud with a slow, kid-friendly voice in the given lesson language
 * ('en' | 'ms' | 'zh' | 'ar'). Cancels any ongoing speech.
 */
export function speak(text: string, language: LessonLanguage = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const cleaned = cleanForSpeech(text)
  if (!cleaned) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(cleaned)
  utterance.lang = LOCALE[language] ?? LOCALE.en
  const voice = pickVoice(language)
  if (voice) utterance.voice = voice
  utterance.rate = 0.85 // slightly slower for young listeners
  utterance.pitch = 1.15 // slightly higher, friendlier tone
  window.speechSynthesis.speak(utterance)
}

/** Stop any ongoing speech (call when leaving a question or unmounting). */
export function stopSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  if (!audioCtx) audioCtx = new Ctx()
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {})
  return audioCtx
}

function playTone(frequency: number, startAt: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(volume, ctx.currentTime + startAt)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime + startAt)
  osc.stop(ctx.currentTime + startAt + duration)
}

/** Happy rising "ding-ding!" for correct answers. */
export function playCorrectSound() {
  playTone(523.25, 0, 0.15)      // C5
  playTone(659.25, 0.12, 0.15)   // E5
  playTone(783.99, 0.24, 0.3)    // G5
}

/** Gentle low "boop" for wrong answers — encouraging, not scary. */
export function playWrongSound() {
  playTone(220, 0, 0.25, 'triangle', 0.12)   // A3
  playTone(174.61, 0.18, 0.35, 'triangle', 0.1) // F3
}

/** Sparkly fanfare for finishing a quiz with a great score. */
export function playCelebrationSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
  notes.forEach((freq, i) => playTone(freq, i * 0.12, 0.35))
}
