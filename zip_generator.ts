import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// Parse command line arguments
const args = process.argv.slice(2);
let type = 'all'; // default

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--type' && args[i + 1]) {
    type = args[i + 1];
    break;
  }
}

const rootDir = process.cwd();
let outputZipName = 'handoff_package.zip';
let targetDir = rootDir;
let onlyPrompts = false;

if (type === 'gods_glory') {
  outputZipName = 'gods_glory_package.zip';
  targetDir = path.join(rootDir, 'prompts', 'gods_glory');
  onlyPrompts = true;
} else if (type === 'little_olympus') {
  outputZipName = 'little_olympus_package.zip';
  targetDir = path.join(rootDir, 'prompts', 'little_olympus');
  onlyPrompts = true;
} else if (type === 'ww_channel') {
  outputZipName = 'ww_channel_package.zip';
  targetDir = path.join(rootDir, 'prompts', 'ww_channel');
  onlyPrompts = true;
  // Pre-scaffold if needed
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    const samplePath = path.join(targetDir, 'scene_prompts.WW_EP001.final.json');
    if (!fs.existsSync(samplePath)) {
      fs.writeFileSync(samplePath, JSON.stringify({
        episode: 'WW_EP001',
        title: 'The Outbreak of the Great War',
        scenes: [
          {
            scene_number: 1,
            narration: 'July 1914. Europe stands on the precipice of an unimaginable conflict.',
            visual_prompt: 'World War channel historical style. Dynamic battlefield graphic map, 1914, high contrast, documentary look, 16:9.',
            duration_sec: 45
          }
        ],
        generated_at: new Date().toISOString(),
        total_scenes: 1
      }, null, 2));
    }
  }
}

const outputZipPath = path.join(rootDir, outputZipName);

// Excluded directories and files for full codebase zip
const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.cache'
]);

const EXCLUDE_FILES = new Set([
  'handoff_package.zip',
  'gods_glory_package.zip',
  'little_olympus_package.zip',
  'ww_channel_package.zip',
  'package-lock.json'
]);

const zip = new AdmZip();

function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: Target directory does not exist: ${dir}`);
    return;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (onlyPrompts) {
        walkDir(filePath, callback);
      } else if (!EXCLUDE_DIRS.has(file)) {
        walkDir(filePath, callback);
      }
    } else {
      if (onlyPrompts) {
        if (file.endsWith('.json')) {
          callback(filePath);
        }
      } else {
        if (!EXCLUDE_FILES.has(file) && !file.endsWith('.zip')) {
          callback(filePath);
        }
      }
    }
  }
}

console.log(`Starting programmatic packaging for type: "${type}"...`);

let fileCount = 0;
if (onlyPrompts) {
  walkDir(targetDir, (filePath) => {
    const relativePath = path.relative(targetDir, filePath);
    console.log(`Adding: ${relativePath}`);
    zip.addLocalFile(filePath, '');
    fileCount++;
  });
} else {
  walkDir(rootDir, (filePath) => {
    const relativePath = path.relative(rootDir, filePath);
    console.log(`Adding: ${relativePath}`);
    zip.addLocalFile(filePath, path.dirname(relativePath));
    fileCount++;
  });
}

if (fileCount === 0) {
  console.log('No files found to package. Creating empty or placeholder package.');
  // Add a placeholder file so the zip is valid
  zip.addFile('README.md', Buffer.from(`# ${type.toUpperCase()} Package\nGenerated at ${new Date().toISOString()}\nNo files found.`, 'utf-8'));
  fileCount = 1;
}

console.log(`\nTotal files to write: ${fileCount}`);
console.log(`Writing zip archive to: ${outputZipPath}`);
zip.writeZip(outputZipPath);
console.log(`ZIP package successfully written to: ${outputZipPath}`);
