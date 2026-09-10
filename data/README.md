# Gallery image database

Edit `gallery-images.json` to control the homepage motion gallery.

Each record contains:

- `id` — a permanent unique identifier.
- `image` — either a local image path beginning with `/` or a complete `https://` image link.
- `order` — a unique non-negative whole number. Lower numbers appear first, beginning with `0`.
- `alt` — a short accessible description of the image.

For a local image, add the file beneath `public/` and write its path without the word `public`. For example, `public/home/gallery/new-image.jpg` becomes `/home/gallery/new-image.jpg`.

The site sorts records by `order`. Its validation rejects missing values, duplicate IDs, duplicate order numbers, negative orders, and unsupported image sources.
