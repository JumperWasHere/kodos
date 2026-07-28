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

// The Web Speech API has no real "gender" field, and no browser can clone a
// specific real person's voice — so instead we recognize known warm, female
// narrator voices by name (the same category of voice used by popular
// children's-content narrators) and rank them highest. Covers Edge's
// natural online voices, Windows/macOS desktop voices, and Android/Chrome.
// Earlier names in each list are preferred.
const FEMALE_VOICE_HINTS: Record<LessonLanguage, string[]> = {
  en: [
    'aria', 'jenny', 'ana',            // Edge "Online (Natural)" voices
    'samantha',                        // macOS / iOS default
    'zira', 'susan', 'hazel', 'eva',   // Windows desktop voices
    'google us english female', 'google uk english female',
  ],
  ms: [
    'yasmin',              // Edge "Online (Natural)" Malay
    'gadis', 'damayanti',  // Windows / Android Malay & Indonesian
  ],
  zh: [
    'xiaoxiao', 'xiaoyi', 'yaoyao',  // Edge "Online (Natural)" Chinese
    'ting-ting',                     // macOS / iOS
    'huihui',                        // Windows desktop
  ],
  ar: [
    'salma', 'zariyah', 'amina', // Edge "Online (Natural)" Arabic
  ],
}

/** Higher score = warmer / more likely a female narrator voice. */
function voiceScore(voice: SpeechSynthesisVoice, language: LessonLanguage): number {
  const name = voice.name.toLowerCase()
  let score = 0

  const hintIndex = FEMALE_VOICE_HINTS[language].findIndex((hint) => name.includes(hint))
  if (hintIndex !== -1) score += 100 - hintIndex

  if (name.includes('female')) score += 20
  if (name.includes('male') && !name.includes('female')) score -= 50
  if (name.includes('online (natural)') || name.includes('neural')) score += 10

  return score
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
    const candidates = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(prefix))
    if (candidates.length === 0) continue
    // Prefer the warmest-sounding female voice among this language's candidates
    return [...candidates].sort((a, b) => voiceScore(b, language) - voiceScore(a, language))[0]
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

let currentAudio: HTMLAudioElement | null = null

/**
 * Play a real recorded audio file (narration, song, sound effect) — this is
 * a genuine human voice/recording, unlike `speak()` which is synthesized.
 * Stops any previously playing file first.
 */
export function playAudioFile(url: string) {
  if (typeof window === 'undefined') return
  stopAudioFile()
  currentAudio = new Audio(url)
  currentAudio.play().catch(() => {
    // Autoplay can be blocked by the browser until the user interacts with
    // the page; the visible 🔊/▶ button remains a manual fallback.
  })
}

export function stopAudioFile() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
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
