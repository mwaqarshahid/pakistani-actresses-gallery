# pakistani-actresses-gallery

A lightweight, static gallery of Pakistani actresses and style icons (portrait, side pose, full standing) with quick links to Instagram profiles.

## Live / Run locally

- **Simplest**: open `index.html` in your browser.
- **Recommended**: run a local static server (avoids any browser restrictions around local file loading).
  - VS Code/Cursor: use a “Live Server” extension and open `index.html`

## What’s inside

- **Entry point**: `index.html`
- **Styles**: `assets/css/styles.css`
- **Data (actresses + pose definitions)**: `assets/js/data.js`
- **Rendering logic**: `assets/js/app.js`
- **SVG icons**: `assets/js/icons.js`
- **Images**: `assets/images/`

## Add / edit actresses

Edit `assets/js/data.js`:

- **`rank`**: display rank (e.g. `"01"`)
- **`name`**: display name
- **`slug`**: folder name used for images
- **`ig`**: Instagram username (used to build `https://www.instagram.com/<ig>/`)

Example shape:

```js
{ rank: "01", name: "Mahira Khan", slug: "mahira-khan", ig: "mahirahkhan" }
```

## Add / edit poses

Poses are defined in `assets/js/data.js` under `poses` and currently include:

- `portrait`
- `side-pose`
- `full-standing`

Each pose includes a `placeholder` used when an image for that pose isn’t available.

## Image naming conventions (important)

For each actress, `assets/js/app.js` tries these image extensions in order:

1. `.webp`
2. `.jpg`
3. `.jpeg`
4. `.png`

Expected file paths:

- `assets/images/actresses/<slug>/portrait.<ext>`
- `assets/images/actresses/<slug>/side-pose.<ext>`
- `assets/images/actresses/<slug>/full-standing.<ext>`

If none exist, the app falls back to the pose placeholder from:

- `assets/images/default-images/`

## Notes / disclaimer

This is a fan-made, curated gallery for learning/showcase purposes. Images and names belong to their respective owners. If you own any content here and want it removed or credited differently, please open an issue.

