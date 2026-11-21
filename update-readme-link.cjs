const fs = require('node:fs');

const address = new URL(process.env.PAGES_URL);
if (!['https:', 'http:'].includes(address.protocol) || address.username || address.password) {
  throw new Error('GitHub Pages did not return a valid site address.');
}

const path = 'README.md';
const readme = fs.readFileSync(path, 'utf8');
const linkSection = /(<!-- pages-link:start -->\r?\n)[\s\S]*?(\r?\n<!-- pages-link:end -->)/;
if (!linkSection.test(readme)) throw new Error('The README is missing its Pages link section.');

const updated = readme.replace(linkSection, (_, start, end) =>
  start + '[칸꽃 바로 플레이하기](<' + address.href + '>)' + end);

if (updated !== readme) fs.writeFileSync(path, updated);
