const fs = require('node:fs');
const vm = require('node:vm');

const context = {};
const catalog = fs.readFileSync('dist/weekly-puzzles.js', 'utf8');
const batches = vm.runInNewContext(catalog + '\nWEEKLY_RELEASES;', context);
const now = Date.now();
const nextBatches = batches.filter(batch => Date.parse(batch.publishAt) > now);
const publishedCount = batches.length - nextBatches.length;

const summary = [
  '## 칸꽃 작품 대기열',
  '',
  '- 공개된 주간 묶음: ' + publishedCount + '개',
  '- 공개 예정 묶음: ' + nextBatches.length + '개',
  ...nextBatches.map(batch => '  - ' + batch.publishAt.slice(0, 10) + ' 10:00 KST · ' + batch.puzzles.length + '작품'),
  '',
];

if (nextBatches.length < 2) {
  const message = '공개 예정 묶음이 두 주 미만입니다. 작품 생성 단계의 결과를 확인하세요.';
  console.log('::warning::' + message);
  summary.push(message, '');
}

const result = summary.join('\n');
console.log(result);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, result + '\n');
