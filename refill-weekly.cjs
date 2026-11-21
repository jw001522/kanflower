const fs = require('node:fs');
const vm = require('node:vm');
const { createArtwork, silhouette } = require('./weekly-art.cjs');

const catalogPath = 'dist/weekly-puzzles.js';
const initialArtwork = ['puzzles', 'extra-puzzles', 'more-puzzles', 'bloom-puzzles', 'refined-puzzles'];
const sizes = [5, 10, 15, 20];
const weekMs = 7 * 24 * 60 * 60 * 1000;
const weeksAhead = 4;

function loadCatalog() {
  const scripts = initialArtwork.map(name => fs.readFileSync('dist/' + name + '.js', 'utf8'));
  scripts.push(fs.readFileSync(catalogPath, 'utf8'));
  return vm.runInNewContext(scripts.join('\n') + '\n({ existing: PUZZLES, batches: WEEKLY_RELEASES });');
}

function refill({ existing, batches }, now) {
  if (!batches.length) throw new Error('첫 공개 묶음이 필요합니다.');
  const firstRelease = Date.parse(batches[0].publishAt);
  const latestRelease = Date.parse(batches.at(-1).publishAt);
  if (!Number.isFinite(firstRelease) || !Number.isFinite(latestRelease)) throw new Error('공개 날짜를 확인하세요.');
  const currentWeek = Math.floor((now - firstRelease) / weekMs);
  const lastRequired = firstRelease + (currentWeek + weeksAhead) * weekMs;
  if (latestRelease >= lastRequired) return [];

  const all = [...existing, ...batches.flatMap(batch => batch.puzzles)];
  const uniqueness = sizes.map(size => {
    const works = all.filter(puzzle => puzzle.size === size);
    return {
      size,
      takenShapes: new Set(works.map(puzzle => silhouette(puzzle.rows))),
      takenNames: new Set(works.map(puzzle => puzzle.name)),
      recentMotifs: batches.slice(-3).map(batch =>
        batch.puzzles.find(puzzle => puzzle.size === size).id.replace(/\d+-\d{8}$/, '')),
    };
  });
  const additions = [];
  for (let date = latestRelease + weekMs; date <= lastRequired; date += weekMs) {
    const day = new Date(date).toISOString().slice(0, 10);
    const week = Math.round((date - firstRelease) / weekMs);
    const takenMotifs = new Set();
    const puzzles = uniqueness.map((requirements, slot) =>
      createArtwork({ ...requirements, slot, week, day, takenMotifs }));
    additions.push({ publishAt: day + 'T10:00:00+09:00', puzzles });
  }
  return additions;
}

if (require.main === module) {
  const catalog = loadCatalog();
  const additions = refill(catalog, Date.now());
  if (additions.length) {
    const data = [...catalog.batches, ...additions];
    fs.writeFileSync(catalogPath,
      '// Every release adds one original puzzle in each of the four sizes.\nconst WEEKLY_RELEASES = ' +
      JSON.stringify(data, null, 2) + ';\n');
  }
  console.log('추가된 공개 묶음 ' + additions.length + '개 (' + (additions.length * sizes.length) + '작품)');
}

module.exports = { loadCatalog, refill };
