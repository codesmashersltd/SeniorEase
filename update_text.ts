import fs from 'fs';
import path from 'path';

const walkSync = (dir: string, filelist: string[] = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replacements context-aware
  content = content.replace(/\bhelp with\b/g, 'educate on');
  content = content.replace(/\bHelp with\b/g, 'Educate on');
  content = content.replace(/\bhelps\b/g, 'educates');
  content = content.replace(/\bHelps\b/g, 'Educates');
  content = content.replace(/\bhelping\b/g, 'educating');
  content = content.replace(/\bHelping\b/g, 'Educating');
  
  // Nouns/general
  content = content.replace(/\bhelp\b/g, 'learning');
  content = content.replace(/\bHelp\b/g, 'Learning');

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Modified: ${file}`);
  }
});
