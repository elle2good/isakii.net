# isakii.net

Generalist portfolio and Next.js translation of the Framer project **Personal Website**.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — Home header instance
- `/about` — About page
- `/work` — interactive work timeline
- `/resume` — interactive book placeholder

The original Framer component/code mapping is documented in [`framer-source/README.md`](framer-source/README.md).

## Gallery data

Homepage gallery images and their display order are managed in [`data/gallery-images.json`](data/gallery-images.json). See [`data/README.md`](data/README.md) for the field definitions and instructions for local uploads or external image links.

## Algorand Korea game

- `/catalogue/Algorand-staking-korea-campaign` — playable full-screen introduction, linked from the homepage Algorand preview.
- `/work/algorand-korea` — alias redirect.
- `/games/algorand-korea-reference/index.html` — preserved original campaign game.

The active game's editable HTML, CSS, JavaScript, artwork and fonts live in `public/games/algorand-korea/`. `components/AlgorandGame.tsx` embeds it to isolate the game's styles from the portfolio. Edit this project copy for future website work. The standalone draft remains backed up in the game task's outputs.

The final signup submits to the existing `/api/newsletter` endpoint and uses the site's Flodesk configuration. No local SQLite server or test subscriber data was migrated. The return link exits the game and opens the site homepage.

The game return link opens `/?preview=Algorand-staking-korea-campaign#projects`, restoring the Algorand catalogue preview. Closing the preview clears the query parameter.
