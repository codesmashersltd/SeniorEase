const fs = require('fs');

const replaceInFile = (file, search, replace) => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(search)) {
    fs.writeFileSync(file, content.replace(search, replace), 'utf8');
  }
};

const replaceRegexInFile = (file, searchRegex, replace) => {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(searchRegex, replace);
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
  }
};

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = dir + '/' + file;
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
  replaceRegexInFile(file, /\bhelp with\b/g, 'educate on');
  replaceRegexInFile(file, /\bHelp with\b/g, 'Educate on');
  replaceRegexInFile(file, /\bhelping\b/g, 'educating');
  replaceRegexInFile(file, /\bHelping\b/g, 'Educating');
  replaceRegexInFile(file, /\bhelps\b/g, 'educates');
  replaceRegexInFile(file, /\bHelps\b/g, 'Educates');
  // Then the remaining "help" / "Help"
  replaceRegexInFile(file, /\bhelp\b/g, 'learning');
  replaceRegexInFile(file, /\bHelp\b/g, 'Learning');
});

console.log('Global Replacement complete.');
