// AUTO-GENERATOR: discovers every valid destination image actually present
// under public/images/destinations/ and writes them to a generated TS module.
//
// Why this exists: the project's supplied destination images are added/edited
// over time and arrive with varied filenames (city-named, "download (n)-images-*",
// emojis, spaces, parentheses, etc.). Hard-coding the list would silently ignore
// new images. Generating it at build time guarantees the webapp always discovers
// and accounts for 100% of the real supplied assets, satisfying the
// "detect every valid image file" requirement without manual edits.
//
// Two sources of truth are emitted:
//   1. LOCAL_DESTINATION_IMAGES  — flat photo files directly under the folder
//      (route SVGs are excluded so city-token matching never picks an illustration).
//   2. DESTINATION_FOLDER_IMAGES — per-subfolder photo lists, keyed by folder name
//      (e.g. 'jammu and kashmir'). These are the real, city-confirmed photographs
//      used as the PRIMARY gallery/hero source for each destination.
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

function isImage(file) {
  return VALID_EXT.test(file);
}

/** Sorted public paths for the image files directly inside `folderPath`. */
function readFolderImages(folderPath) {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && isImage(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((f) =>
      // Public path is kept raw to match the codebase convention (spaces/special
      // characters are handled safely by <img> consumers via encodeURI when needed).
      `/images/destinations/${encodeURIComponent(path.basename(folderPath))}/${encodeURIComponent(f)}`
    );
}

function discover() {
  if (!fs.existsSync(dir)) return { flat: [], folders: {} };

  const flat = [];
  const folders = {};

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const images = readFolderImages(full);
      if (images.length > 0) {
        folders[entry.name] = images;
      }
    } else if (entry.isFile() && isImage(entry.name)) {
      flat.push(`/images/destinations/${encodeURIComponent(entry.name)}`);
    }
  }

  flat.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return { flat, folders };
}

const { flat, folders } = discover();

const header = `// AUTO-GENERATED FILE — do not edit by hand.
// Regenerated at build time by scripts/generate-destination-images.mjs from the
// actual contents of public/images/destinations/. It is the single source of
// truth for every discovered destination image so none are silently ignored.
`;

const flatBody = `export const LOCAL_DESTINATION_IMAGES: string[] = [\n${flat
  .map((p) => `  '${p.replace(/'/g, "\\'")}',`)
  .join('\n')}\n];\n`;

const folderBody = `export const DESTINATION_FOLDER_IMAGES: Record<string, string[]> = ${JSON.stringify(folders, null, 2)}\n;\n`;

const outPath = path.join(root, 'lib', 'data', 'destination-images.generated.ts');
fs.writeFileSync(outPath, header + flatBody + '\n' + folderBody, 'utf8');
console.log(`[generate-destination-images] wrote ${flat.length} flat + ${Object.keys(folders).length} folders to ${path.relative(root, outPath)}`);
