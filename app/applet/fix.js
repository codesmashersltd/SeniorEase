const fs = require('fs');

const replaceInFile = (file, search, replace) => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(search)) {
    fs.writeFileSync(file, content.replace(new RegExp(search, 'g'), replace), 'utf8');
  }
};

replaceInFile('src/pages/Contact.tsx', 'We’re here to learning you get started', 'We’re here to provide learning to get you started');
replaceInFile('src/pages/Contact.tsx', 'we’d be happy to learning.', 'we’d be happy to educate.');
replaceInFile('src/pages/Contact.tsx', 'How can we learning?', 'What would you like to learn?');
replaceInFile('src/pages/Home.tsx', 'How We Learning', 'How We Educate');
replaceInFile('src/pages/Pricing.tsx', 'Learning with common digital', 'Education on common digital');
replaceInFile('src/pages/Services.tsx', 'We learning with common device issues', 'We educate on common device issues');
replaceInFile('src/pages/Services.tsx', 'We can learning you navigate messaging', 'We can educate you to navigate messaging');
replaceInFile('src/pages/Services.tsx', 'We provide patient learning to keep your accounts accessible', 'We provide patient education to keep your accounts accessible');
replaceInFile('src/pages/Services.tsx', 'We provide general support to learning you identify', 'We provide general support to educate you to identify');
replaceInFile('src/pages/Services.tsx', 'Let us learning you find and enjoy', 'Let us educate you to find and enjoy');
replaceInFile('src/pages/Services.tsx', 'We can learning you navigate:', 'We can educate you to navigate:');
replaceInFile('src/pages/Services.tsx', 'Reassurance that learning is always a call away', 'Reassurance that education is always a call away');
replaceInFile('src/pages/MyAccount.tsx', 'Request Learning', 'Request Education');
replaceInFile('src/pages/Terms.tsx', 'Where we learning explain online messages', 'Where we educate by explaining online messages');
replaceInFile('src/pages/Terms.tsx', 'seek specialist or emergency learning', 'seek specialist or emergency education');
replaceInFile('src/pages/Terms.tsx', 'urgent learning, medical support', 'urgent education, medical support');
replaceInFile('src/pages/FAQ.tsx', 'urgent learning is needed', 'urgent education is needed');

// Print completion
console.log('Done fixing');
