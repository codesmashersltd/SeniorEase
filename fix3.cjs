const fs = require('fs');

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
  replaceRegexInFile(file, /To learning us/g, 'To allow us');
  replaceRegexInFile(file, /To learning avoid/g, 'To avoid');
  replaceRegexInFile(file, /learning you find and enjoy/g, 'educate you to find and enjoy');
  replaceRegexInFile(file, /learning you navigate/g, 'educate you to navigate');
  replaceRegexInFile(file, /learning you identify/g, 'educate you to identify');
  replaceRegexInFile(file, /happy to learning/g, 'happy to educate');
  replaceRegexInFile(file, /can we learning/g, 'can we educate');
  replaceRegexInFile(file, /learning when it’s needed/g, 'learning when it’s needed'); // ok
  replaceRegexInFile(file, /learning setting up/g, 'educate on setting up');
  replaceRegexInFile(file, /learning identify suspicious/g, 'educate on identifying suspicious');
  replaceRegexInFile(file, /learning you build confidence/g, 'educate you to build confidence');
  replaceRegexInFile(file, /learning using WhatsApp/g, 'education using WhatsApp');
  replaceRegexInFile(file, /here to learning/g, 'here to educate');
  replaceRegexInFile(file, /learning us support/g, 'educate us to support');
  replaceRegexInFile(file, /Where we learning explain/g, 'Where we educate by explaining');
  replaceRegexInFile(file, /to learning customers recognise/g, 'to educate customers to recognise');
  replaceRegexInFile(file, /to learning make everyday/g, 'to help make everyday');
  replaceRegexInFile(file, /We learning in a way/g, 'We educate in a way');
  replaceRegexInFile(file, /more learning than my plan/g, 'more education than my plan');
  replaceRegexInFile(file, /learning reduce that risk/g, 'help reduce that risk');
  replaceRegexInFile(file, /learning keep service expectations/g, 'help keep service expectations');
  replaceRegexInFile(file, /learning avoid misunderstandings/g, 'help avoid misunderstandings');
  replaceRegexInFile(file, /learning the website function/g, 'help the website function');
  replaceRegexInFile(file, /to learning us assist/g, 'to allow us to assist');
  replaceRegexInFile(file, /to learning customers with/g, 'to educate customers on');
});

console.log('Final fixes applied.');
