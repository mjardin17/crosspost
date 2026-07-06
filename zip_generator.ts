import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const zip = new AdmZip();
const rootDir = process.cwd();
const outputZipName = 'handoff_package.zip';
const outputZipPath = path.join(rootDir, outputZipName);

// Excluded directories and files
const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.cache'
]);

const EXCLUDE_FILES = new Set([
  outputZipName,
  'package-lock.json' // exclude to keep package lightweight, or we can include it. Let's include it for exact matching
]);

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.has(file)) {
        walkDir(filePath, callback);
      }
    } else {
      if (!EXCLUDE_FILES.has(file) && !file.endsWith('.zip')) {
        callback(filePath);
      }
    }
  }
}

console.log('Starting programmatic packaging...');

let fileCount = 0;
walkDir(rootDir, (filePath) => {
  const relativePath = path.relative(rootDir, filePath);
  console.log(`Adding: ${relativePath}`);
  zip.addLocalFile(filePath, path.dirname(relativePath));
  fileCount++;
});

console.log(`\nTotal files to write: ${fileCount}`);
console.log('Writing zip archive to disk...');
zip.writeZip(outputZipPath);
console.log(`ZIP handoff package successfully written to: ${outputZipPath}`);
