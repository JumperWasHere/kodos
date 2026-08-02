import type { MatchingAgeGroup, MatchingCategory } from '../models/MatchingItem'

interface MatchingItemSeed {
  category: MatchingCategory
  slug: string
  label: string
  labelMs: string
  emoji: string
  imageUrl?: string
  colorHex?: string
  colorClass?: string
  audioText: string
  audioTextMs: string
  ageGroups: MatchingAgeGroup[]
  difficulty: 1 | 2 | 3 | 4
  sortOrder: number
  isActive: boolean
}

// ── ANIMALS (20 items) ────────────────────────────────────────────────────────
const ANIMALS: MatchingItemSeed[] = [
  // difficulty 1: universal household animals toddlers know
  { category: 'animals', slug: 'animals-dog', label: 'Dog', labelMs: 'Anjing', emoji: '🐶', audioText: 'Dog', audioTextMs: 'Anjing', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 1, isActive: true },
  { category: 'animals', slug: 'animals-cat', label: 'Cat', labelMs: 'Kucing', emoji: '🐱', audioText: 'Cat', audioTextMs: 'Kucing', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 2, isActive: true },
  { category: 'animals', slug: 'animals-duck', label: 'Duck', labelMs: 'Itik', emoji: '🦆', audioText: 'Duck', audioTextMs: 'Itik', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 3, isActive: true },
  { category: 'animals', slug: 'animals-fish', label: 'Fish', labelMs: 'Ikan', emoji: '🐟', audioText: 'Fish', audioTextMs: 'Ikan', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 4, isActive: true },
  { category: 'animals', slug: 'animals-bear', label: 'Bear', labelMs: 'Beruang', emoji: '🐻', audioText: 'Bear', audioTextMs: 'Beruang', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 5, isActive: true },
  // difficulty 2: common zoo/story animals, preschool+
  { category: 'animals', slug: 'animals-rabbit', label: 'Rabbit', labelMs: 'Arnab', emoji: '🐰', audioText: 'Rabbit', audioTextMs: 'Arnab', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 6, isActive: true },
  { category: 'animals', slug: 'animals-monkey', label: 'Monkey', labelMs: 'Monyet', emoji: '🐒', audioText: 'Monkey', audioTextMs: 'Monyet', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 7, isActive: true },
  { category: 'animals', slug: 'animals-elephant', label: 'Elephant', labelMs: 'Gajah', emoji: '🐘', audioText: 'Elephant', audioTextMs: 'Gajah', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 8, isActive: true },
  { category: 'animals', slug: 'animals-penguin', label: 'Penguin', labelMs: 'Penguin', emoji: '🐧', audioText: 'Penguin', audioTextMs: 'Penguin', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 9, isActive: true },
  { category: 'animals', slug: 'animals-owl', label: 'Owl', labelMs: 'Burung Hantu', emoji: '🦉', audioText: 'Owl', audioTextMs: 'Burung Hantu', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 10, isActive: true },
  { category: 'animals', slug: 'animals-frog', label: 'Frog', labelMs: 'Katak', emoji: '🐸', audioText: 'Frog', audioTextMs: 'Katak', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 11, isActive: true },
  { category: 'animals', slug: 'animals-horse', label: 'Horse', labelMs: 'Kuda', emoji: '🐴', audioText: 'Horse', audioTextMs: 'Kuda', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 12, isActive: true },
  // difficulty 3: wild/exotic animals, lower primary+
  { category: 'animals', slug: 'animals-lion', label: 'Lion', labelMs: 'Singa', emoji: '🦁', audioText: 'Lion', audioTextMs: 'Singa', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 13, isActive: true },
  { category: 'animals', slug: 'animals-tiger', label: 'Tiger', labelMs: 'Harimau', emoji: '🐯', audioText: 'Tiger', audioTextMs: 'Harimau', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 14, isActive: true },
  { category: 'animals', slug: 'animals-giraffe', label: 'Giraffe', labelMs: 'Zirafah', emoji: '🦒', audioText: 'Giraffe', audioTextMs: 'Zirafah', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 15, isActive: true },
  { category: 'animals', slug: 'animals-zebra', label: 'Zebra', labelMs: 'Zebra', emoji: '🦓', audioText: 'Zebra', audioTextMs: 'Zebra', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 16, isActive: true },
  { category: 'animals', slug: 'animals-butterfly', label: 'Butterfly', labelMs: 'Rama-rama', emoji: '🦋', audioText: 'Butterfly', audioTextMs: 'Rama-rama', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 17, isActive: true },
  // difficulty 4: specialist animals, upper primary+
  { category: 'animals', slug: 'animals-panda', label: 'Panda', labelMs: 'Panda', emoji: '🐼', audioText: 'Panda', audioTextMs: 'Panda', ageGroups: ['upper_primary'], difficulty: 4, sortOrder: 18, isActive: true },
  { category: 'animals', slug: 'animals-whale', label: 'Whale', labelMs: 'Ikan Paus', emoji: '🐳', audioText: 'Whale', audioTextMs: 'Ikan Paus', ageGroups: ['upper_primary'], difficulty: 4, sortOrder: 19, isActive: true },
  { category: 'animals', slug: 'animals-crocodile', label: 'Crocodile', labelMs: 'Buaya', emoji: '🐊', audioText: 'Crocodile', audioTextMs: 'Buaya', ageGroups: ['upper_primary'], difficulty: 4, sortOrder: 20, isActive: true },
]

// ── PLANTS (15 items) ─────────────────────────────────────────────────────────
const PLANTS: MatchingItemSeed[] = [
  // difficulty 1: basic plants all kids know
  { category: 'plants', slug: 'plants-flower', label: 'Flower', labelMs: 'Bunga', emoji: '🌸', audioText: 'Flower', audioTextMs: 'Bunga', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 1, isActive: true },
  { category: 'plants', slug: 'plants-tree', label: 'Tree', labelMs: 'Pokok', emoji: '🌳', audioText: 'Tree', audioTextMs: 'Pokok', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 2, isActive: true },
  { category: 'plants', slug: 'plants-grass', label: 'Grass', labelMs: 'Rumput', emoji: '🌿', audioText: 'Grass', audioTextMs: 'Rumput', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 3, isActive: true },
  // difficulty 2: named flowers and plants
  { category: 'plants', slug: 'plants-sunflower', label: 'Sunflower', labelMs: 'Bunga Matahari', emoji: '🌻', audioText: 'Sunflower', audioTextMs: 'Bunga Matahari', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 4, isActive: true },
  { category: 'plants', slug: 'plants-rose', label: 'Rose', labelMs: 'Mawar', emoji: '🌹', audioText: 'Rose', audioTextMs: 'Mawar', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 5, isActive: true },
  { category: 'plants', slug: 'plants-daisy', label: 'Daisy', labelMs: 'Daisy', emoji: '🌼', audioText: 'Daisy', audioTextMs: 'Bunga Daisy', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 6, isActive: true },
  { category: 'plants', slug: 'plants-tulip', label: 'Tulip', labelMs: 'Tulip', emoji: '🌷', audioText: 'Tulip', audioTextMs: 'Bunga Tulip', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 7, isActive: true },
  { category: 'plants', slug: 'plants-seedling', label: 'Seedling', labelMs: 'Anak Pokok', emoji: '🌱', audioText: 'Seedling', audioTextMs: 'Anak Pokok', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 8, isActive: true },
  { category: 'plants', slug: 'plants-mushroom', label: 'Mushroom', labelMs: 'Cendawan', emoji: '🍄', audioText: 'Mushroom', audioTextMs: 'Cendawan', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 9, isActive: true },
  // difficulty 3: less common plants
  { category: 'plants', slug: 'plants-cactus', label: 'Cactus', labelMs: 'Kaktus', emoji: '🌵', audioText: 'Cactus', audioTextMs: 'Kaktus', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 10, isActive: true },
  { category: 'plants', slug: 'plants-bamboo', label: 'Bamboo', labelMs: 'Buluh', emoji: '🎋', audioText: 'Bamboo', audioTextMs: 'Buluh', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 11, isActive: true },
  { category: 'plants', slug: 'plants-palm', label: 'Palm Tree', labelMs: 'Pokok Palma', emoji: '🌴', audioText: 'Palm Tree', audioTextMs: 'Pokok Palma', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 12, isActive: true },
  { category: 'plants', slug: 'plants-maple-leaf', label: 'Maple Leaf', labelMs: 'Daun Maple', emoji: '🍁', audioText: 'Maple Leaf', audioTextMs: 'Daun Maple', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 13, isActive: true },
  // difficulty 4: specialty plants
  { category: 'plants', slug: 'plants-hibiscus', label: 'Hibiscus', labelMs: 'Bunga Raya', emoji: '🌺', audioText: 'Hibiscus', audioTextMs: 'Bunga Raya', ageGroups: ['upper_primary'], difficulty: 4, sortOrder: 14, isActive: true },
  { category: 'plants', slug: 'plants-clover', label: 'Clover', labelMs: 'Semanggi', emoji: '🍀', audioText: 'Clover', audioTextMs: 'Semanggi', ageGroups: ['upper_primary'], difficulty: 4, sortOrder: 15, isActive: true },
]

// ── COLORS (12 items) ─────────────────────────────────────────────────────────
const COLORS: MatchingItemSeed[] = [
  // Primary colors first (difficulty 1 — all ages)
  { category: 'colors', slug: 'colors-red', label: 'Red', labelMs: 'Merah', emoji: '🔴', colorHex: '#EF4444', colorClass: 'bg-red-500', audioText: 'Red', audioTextMs: 'Merah', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 1, isActive: true },
  { category: 'colors', slug: 'colors-yellow', label: 'Yellow', labelMs: 'Kuning', emoji: '🟡', colorHex: '#EAB308', colorClass: 'bg-yellow-500', audioText: 'Yellow', audioTextMs: 'Kuning', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 2, isActive: true },
  { category: 'colors', slug: 'colors-blue', label: 'Blue', labelMs: 'Biru', emoji: '🔵', colorHex: '#3B82F6', colorClass: 'bg-blue-500', audioText: 'Blue', audioTextMs: 'Biru', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 3, isActive: true },
  { category: 'colors', slug: 'colors-green', label: 'Green', labelMs: 'Hijau', emoji: '🟢', colorHex: '#22C55E', colorClass: 'bg-green-500', audioText: 'Green', audioTextMs: 'Hijau', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 4, isActive: true },
  // Secondary colors (difficulty 2)
  { category: 'colors', slug: 'colors-orange', label: 'Orange', labelMs: 'Oren', emoji: '🟠', colorHex: '#F97316', colorClass: 'bg-orange-500', audioText: 'Orange', audioTextMs: 'Oren', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 5, isActive: true },
  { category: 'colors', slug: 'colors-purple', label: 'Purple', labelMs: 'Ungu', emoji: '🟣', colorHex: '#A855F7', colorClass: 'bg-purple-500', audioText: 'Purple', audioTextMs: 'Ungu', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 6, isActive: true },
  { category: 'colors', slug: 'colors-pink', label: 'Pink', labelMs: 'Merah Jambu', emoji: '🩷', colorHex: '#EC4899', colorClass: 'bg-pink-500', audioText: 'Pink', audioTextMs: 'Merah Jambu', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 7, isActive: true },
  { category: 'colors', slug: 'colors-brown', label: 'Brown', labelMs: 'Coklat', emoji: '🟤', colorHex: '#92400E', colorClass: 'bg-amber-800', audioText: 'Brown', audioTextMs: 'Coklat', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 8, isActive: true },
  // Achromatic + advanced colors (difficulty 3+)
  { category: 'colors', slug: 'colors-black', label: 'Black', labelMs: 'Hitam', emoji: '⚫', colorHex: '#1F2937', colorClass: 'bg-gray-800', audioText: 'Black', audioTextMs: 'Hitam', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 9, isActive: true },
  { category: 'colors', slug: 'colors-white', label: 'White', labelMs: 'Putih', emoji: '⚪', colorHex: '#F9FAFB', colorClass: 'bg-gray-100 border-2 border-gray-300', audioText: 'White', audioTextMs: 'Putih', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 10, isActive: true },
  { category: 'colors', slug: 'colors-light-blue', label: 'Light Blue', labelMs: 'Biru Muda', emoji: '🩵', colorHex: '#38BDF8', colorClass: 'bg-sky-400', audioText: 'Light Blue', audioTextMs: 'Biru Muda', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 11, isActive: true },
  { category: 'colors', slug: 'colors-light-green', label: 'Light Green', labelMs: 'Hijau Muda', emoji: '💚', colorHex: '#4ADE80', colorClass: 'bg-green-400', audioText: 'Light Green', audioTextMs: 'Hijau Muda', ageGroups: ['upper_primary'], difficulty: 4, sortOrder: 12, isActive: true },
]

// ── SHAPES (10 items) ─────────────────────────────────────────────────────────
const SHAPES: MatchingItemSeed[] = [
  // difficulty 1: basic shapes all children learn first
  { category: 'shapes', slug: 'shapes-circle', label: 'Circle', labelMs: 'Bulatan', emoji: '⭕', audioText: 'Circle', audioTextMs: 'Bulatan', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 1, isActive: true },
  { category: 'shapes', slug: 'shapes-square', label: 'Square', labelMs: 'Segi Empat Sama', emoji: '🟥', audioText: 'Square', audioTextMs: 'Segi Empat Sama', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 2, isActive: true },
  { category: 'shapes', slug: 'shapes-triangle', label: 'Triangle', labelMs: 'Segi Tiga', emoji: '🔺', audioText: 'Triangle', audioTextMs: 'Segi Tiga', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 3, isActive: true },
  { category: 'shapes', slug: 'shapes-star', label: 'Star', labelMs: 'Bintang', emoji: '⭐', audioText: 'Star', audioTextMs: 'Bintang', ageGroups: ['toddler', 'preschool', 'lower_primary', 'upper_primary'], difficulty: 1, sortOrder: 4, isActive: true },
  // difficulty 2: slightly more complex shapes
  { category: 'shapes', slug: 'shapes-heart', label: 'Heart', labelMs: 'Hati', emoji: '❤️', audioText: 'Heart', audioTextMs: 'Hati', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 5, isActive: true },
  { category: 'shapes', slug: 'shapes-rectangle', label: 'Rectangle', labelMs: 'Segi Empat Tepat', emoji: '▬', audioText: 'Rectangle', audioTextMs: 'Segi Empat Tepat', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 6, isActive: true },
  { category: 'shapes', slug: 'shapes-diamond', label: 'Diamond', labelMs: 'Berlian', emoji: '🔷', audioText: 'Diamond', audioTextMs: 'Berlian', ageGroups: ['preschool', 'lower_primary', 'upper_primary'], difficulty: 2, sortOrder: 7, isActive: true },
  // difficulty 3: geometric shapes
  { category: 'shapes', slug: 'shapes-oval', label: 'Oval', labelMs: 'Bujur', emoji: '🥚', audioText: 'Oval', audioTextMs: 'Bujur', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 8, isActive: true },
  { category: 'shapes', slug: 'shapes-hexagon', label: 'Hexagon', labelMs: 'Heksagon', emoji: '⬡', audioText: 'Hexagon', audioTextMs: 'Heksagon', ageGroups: ['lower_primary', 'upper_primary'], difficulty: 3, sortOrder: 9, isActive: true },
  { category: 'shapes', slug: 'shapes-crescent', label: 'Crescent', labelMs: 'Bulan Sabit', emoji: '🌙', audioText: 'Crescent', audioTextMs: 'Bulan Sabit', ageGroups: ['upper_primary'], difficulty: 4, sortOrder: 10, isActive: true },
]

export const MATCHING_ITEMS: MatchingItemSeed[] = [
  ...ANIMALS,
  ...PLANTS,
  ...COLORS,
  ...SHAPES,
]
