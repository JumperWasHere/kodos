# TODO_ASSETS — Matching Puzzle Illustrations

This file tracks every image asset the matching puzzle game can use once artwork is ready.
Until then the game falls back to emoji, which works out-of-the-box.

Place finished assets under `public/illustrations/matching/<category>/`.
Then set the `imageUrl` field on the corresponding `MatchingItem` document (via `seed:matching`
or a one-off DB update) and the component will prefer the image over the emoji.

---

## Conventions

| Spec          | Value                                              |
|---------------|----------------------------------------------------|
| Format        | WebP (primary) + PNG fallback                      |
| Canvas size   | 256 × 256 px minimum; 512 × 512 px recommended    |
| Background    | Transparent                                        |
| Style         | Flat / semi-flat cartoon, child-friendly           |
| Naming        | `<slug-without-category-prefix>.webp` e.g. `lion.webp` |

---

## Animals (`public/illustrations/matching/animals/`)

| File             | Slug               | English label | Malay label    |
|------------------|--------------------|---------------|----------------|
| `dog.webp`       | animals-dog        | Dog           | Anjing         |
| `cat.webp`       | animals-cat        | Cat           | Kucing         |
| `duck.webp`      | animals-duck       | Duck          | Itik           |
| `fish.webp`      | animals-fish       | Fish          | Ikan           |
| `bear.webp`      | animals-bear       | Bear          | Beruang        |
| `rabbit.webp`    | animals-rabbit     | Rabbit        | Arnab          |
| `monkey.webp`    | animals-monkey     | Monkey        | Monyet         |
| `elephant.webp`  | animals-elephant   | Elephant      | Gajah          |
| `penguin.webp`   | animals-penguin    | Penguin       | Penguin        |
| `owl.webp`       | animals-owl        | Owl           | Burung Hantu   |
| `frog.webp`      | animals-frog       | Frog          | Katak          |
| `horse.webp`     | animals-horse      | Horse         | Kuda           |
| `lion.webp`      | animals-lion       | Lion          | Singa          |
| `tiger.webp`     | animals-tiger      | Tiger         | Harimau        |
| `giraffe.webp`   | animals-giraffe    | Giraffe       | Zirafah        |
| `zebra.webp`     | animals-zebra      | Zebra         | Zebra          |
| `butterfly.webp` | animals-butterfly  | Butterfly     | Rama-rama      |
| `panda.webp`     | animals-panda      | Panda         | Panda          |
| `whale.webp`     | animals-whale      | Whale         | Ikan Paus      |
| `crocodile.webp` | animals-crocodile  | Crocodile     | Buaya          |

---

## Plants (`public/illustrations/matching/plants/`)

| File             | Slug                | English label | Malay label       |
|------------------|---------------------|---------------|-------------------|
| `flower.webp`    | plants-flower       | Flower        | Bunga             |
| `tree.webp`      | plants-tree         | Tree          | Pokok             |
| `grass.webp`     | plants-grass        | Grass         | Rumput            |
| `sunflower.webp` | plants-sunflower    | Sunflower     | Bunga Matahari    |
| `rose.webp`      | plants-rose         | Rose          | Mawar             |
| `daisy.webp`     | plants-daisy        | Daisy         | Daisy             |
| `tulip.webp`     | plants-tulip        | Tulip         | Tulip             |
| `seedling.webp`  | plants-seedling     | Seedling      | Anak Pokok        |
| `mushroom.webp`  | plants-mushroom     | Mushroom      | Cendawan          |
| `cactus.webp`    | plants-cactus       | Cactus        | Kaktus            |
| `bamboo.webp`    | plants-bamboo       | Bamboo        | Buluh             |
| `palm.webp`      | plants-palm         | Palm Tree     | Pokok Palma       |
| `maple-leaf.webp`| plants-maple-leaf   | Maple Leaf    | Daun Maple        |
| `hibiscus.webp`  | plants-hibiscus     | Hibiscus      | Bunga Raya        |
| `clover.webp`    | plants-clover       | Clover        | Semanggi          |

---

## Colors (`public/illustrations/matching/colors/`)

Colors render as a CSS swatch in the game (no illustration needed for the swatch itself),
but you may want card art showing an object of that color (e.g. a red apple) for toddlers.

| File                | Slug               | Color      | Hex       |
|---------------------|--------------------|------------|-----------|
| `red.webp`          | colors-red         | Red        | #EF4444   |
| `yellow.webp`       | colors-yellow      | Yellow     | #EAB308   |
| `blue.webp`         | colors-blue        | Blue       | #3B82F6   |
| `green.webp`        | colors-green       | Green      | #22C55E   |
| `orange.webp`       | colors-orange      | Orange     | #F97316   |
| `purple.webp`       | colors-purple      | Purple     | #A855F7   |
| `pink.webp`         | colors-pink        | Pink       | #EC4899   |
| `brown.webp`        | colors-brown       | Brown      | #92400E   |
| `black.webp`        | colors-black       | Black      | #1F2937   |
| `white.webp`        | colors-white       | White      | #F9FAFB   |
| `light-blue.webp`   | colors-light-blue  | Light Blue | #38BDF8   |
| `light-green.webp`  | colors-light-green | Light Green| #4ADE80   |

---

## Shapes (`public/illustrations/matching/shapes/`)

Shapes render as vector SVG in the game. The illustrations below would be rich cartoon
versions (e.g. a smiling circle character) for maximum engagement.

| File              | Slug              | English label     | Malay label           |
|-------------------|-------------------|-------------------|-----------------------|
| `circle.webp`     | shapes-circle     | Circle            | Bulatan               |
| `square.webp`     | shapes-square     | Square            | Segi Empat Sama       |
| `triangle.webp`   | shapes-triangle   | Triangle          | Segi Tiga             |
| `star.webp`       | shapes-star       | Star              | Bintang               |
| `heart.webp`      | shapes-heart      | Heart             | Hati                  |
| `rectangle.webp`  | shapes-rectangle  | Rectangle         | Segi Empat Tepat      |
| `diamond.webp`    | shapes-diamond    | Diamond           | Berlian               |
| `oval.webp`       | shapes-oval       | Oval              | Bujur                 |
| `hexagon.webp`    | shapes-hexagon    | Hexagon           | Heksagon              |
| `crescent.webp`   | shapes-crescent   | Crescent          | Bulan Sabit           |

---

## Future categories (no code changes needed — just seed new rows)

| Category  | Suggested count | Notes                                      |
|-----------|-----------------|--------------------------------------------|
| numbers   | 10 (0–9)        | Numeral + word label                       |
| letters   | 26 (A–Z)        | Capital + lowercase matching               |
| vehicles  | 15              | Car, bus, train, airplane, boat, …         |
| food      | 20              | Malaysian foods encouraged (nasi, roti, …) |
| body-parts| 10              | Head, eyes, ears, nose, mouth, hands, feet |

---

_Last updated: 2026-08-02_
