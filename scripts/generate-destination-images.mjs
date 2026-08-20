// AUTO-GENERATOR: discovers every valid destination image actually present in
// public/images/destinations/ and writes them to a generated TS module.
//
// Why this exists: the project's supplied destination images are added/edited
// over time (and arrive with generic or city-named filenames). Hard-coding the
// list would silently ignore new images. Generating it at build time guarantees
// the webapp always discovers and accounts for 100% of the real supplied assets,
// satisfying the "detect every valid image file" requirement without manual edits.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'public', 'images', 'destinations');

// Photographic formats only. Route SVG illustrations are handled separately by
// DESTINATION_SVG_MAP in lib/data/images.ts and must NOT enter the photo pool,
// otherwise city-name token matching (e.g. "jaipur") could resolve a route SVG
// instead of the real supplied photograph.
const VALID_EXT = /\.(jpe?g|jpeg|png|webp|jfif)$/i;

function discover() {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => {
      const full = path.join(dir, f);
      return fs.statSync(full).isFile() && VALID_EXT.test(f);
    })
    .map((f) => `/images/destinations/${f.replace(/'/g, "\\'")}`)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

const paths = discover();

const header = `// AUTO-GENERATED FILE — do not edit by hand.
// Regenerated at build time by scripts/generate-destination-images.mjs from the
// actual contents of public/images/destinations/. It is the single source of
// truth for every discovered destination image so none are silently ignored.
`;

const body = `export const LOCAL_DESTINATION_IMAGES: string[] = [\n${paths
  .map((p) => `  '${p}',`)
  .join('\n')}\n];\n`;

const outPath = path.join(root, 'lib', 'data', 'destination-images.generated.ts');
fs.writeFileSync(outPath, header + body, 'utf8');
console.log(`[generate-destination-images] wrote ${paths.length} image paths to ${path.relative(root, outPath)}`);
