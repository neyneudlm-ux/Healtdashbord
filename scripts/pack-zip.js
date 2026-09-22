import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

const exclude = [
  'node_modules',
  '.git',
  'dist',
  '.aistudio',
  'public/health-screening-dashboard.zip'
];

function addDirToZip(dirPath, zipFolder) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relPath = path.relative(process.cwd(), fullPath);

    if (exclude.some(ex => relPath.startsWith(ex) || relPath === ex || item.startsWith('.'))) {
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(item);
      addDirToZip(fullPath, subFolder);
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item, content);
    }
  }
}

console.log('Packaging project files into zip...');
addDirToZip(process.cwd(), zip);

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }).then((buffer) => {
  fs.writeFileSync('public/health-screening-dashboard.zip', buffer);
  console.log('Successfully created public/health-screening-dashboard.zip (' + (buffer.length / 1024).toFixed(1) + ' KB)');
});
