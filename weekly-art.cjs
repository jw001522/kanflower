const { solvePuzzle } = require('./solver.cjs');

// x: body, o: contrasting detail, ?: optional hand-placed pixel, .: empty.
const motifs = [
  { id: 'bell', name: '종', category: '소품', rows: ['..o..', '.xxx.', '.xxx.', 'xxxxx', '.?o?.'] },
  { id: 'pear', name: '서양배', category: '자연', rows: ['..o?.', '..x..', '.xxx.', 'xxoxx', '?xxx?'] },
  { id: 'lantern', name: '등불', category: '소품', rows: ['..o..', '?xxx?', '.xox.', '.xox.', '?xxx?'] },
  { id: 'tent', name: '텐트', category: '풍경', rows: ['..x..', '.xxx.', '.xox.', '?x.x?', 'xx.xx'] },
  { id: 'cup', name: '찻잔', category: '소품', rows: ['.....', 'xxxx.', 'xoxoo', 'xxx.o', '?xooo'] },
  { id: 'fir', name: '전나무', category: '자연', rows: ['..x..', '.xxx.', '?xxx?', 'xxoxx', '..o..'] },
  { id: 'boat', name: '돛단배', category: '풍경', rows: ['..o..', '.xox.', 'xxox?', '.....', '?ooo?'] },
  { id: 'umbrella', name: '우산', category: '소품', rows: ['.?x?.', 'xxoxx', '?xox?', '..o..', '.oo..'] },
  { id: 'balloon', name: '풍선', category: '소품', rows: ['.?x?.', 'xxoxx', '.xxx.', '..o..', '.o?..'] },
  { id: 'rocket', name: '로켓', category: '소품', rows: ['..x..', '.xxx.', '.xox.', 'oxxxo', '.?o?.'] },
  { id: 'envelope', name: '편지 봉투', category: '소품', rows: ['.....', '?xxx?', 'xooox', 'xxoxx', '?xxx?'] },
  { id: 'mushroom', name: '버섯', category: '자연', rows: ['.xxx.', '?xox?', 'xxxxx', '.?o?.', '..o..'] },
  { id: 'leaf', name: '나뭇잎', category: '자연', rows: ['...xx', '..xox', '.xox?', '.xx?.', 'o....'] },
  { id: 'blossom', name: '꽃', category: '자연', rows: ['.?x?.', '?xox?', '.xxx.', '..o..', '.oo..'] },
  { id: 'gift', name: '선물 상자', category: '소품', rows: ['.o.o.', '.?o?.', 'xxoxx', 'x?o?x', 'xxoxx'] },
  { id: 'candle', name: '양초', category: '소품', rows: ['..?..', '..o..', '.xxx.', '.xox.', '?xxx?'] },
  { id: 'house', name: '집', category: '풍경', rows: ['..x?.', '.xxx.', 'xxxxx', '.xox.', '?xox?'] },
  { id: 'camera', name: '카메라', category: '소품', rows: ['..?o.', '?xxx?', 'xxoxx', 'xxoxx', '?xxx?'] },
  { id: 'shirt', name: '티셔츠', category: '소품', rows: ['.x.x.', 'xxoxx', '?xxx?', '.xox.', '.xxx.'] },
  { id: 'cupcake', name: '컵케이크', category: '소품', rows: ['..o?.', '.xxx.', 'xxxxx', '?ooo?', '.ooo.'] },
  { id: 'cherries', name: '체리', category: '자연', rows: ['..o?.', '.o.o.', '.o.o.', 'xx.xx', 'x?.?x'] },
  { id: 'spade', name: '모종삽', category: '소품', rows: ['..o?.', '..o..', '.xxx.', '?xxx?', '.?x?.'] },
  { id: 'jellyfish', name: '해파리', category: '동물', rows: ['.?x?.', '.xxx.', 'xxoxx', '.o.o.', '.?.?.'] },
  { id: 'butterfly', name: '나비', category: '동물', rows: ['x?.?x', 'xxoxx', '.xox.', '?xox?', '.?.?.'] },
];

// Larger grids have their own drawings with room for recognizable details.
const detailedMotifs = {
  bell: [
    '....o....', '...oxo...', '..xxxxx..', '..xxxxx..', '..xxxxx..',
    '.?xxxxx?.', '.xxxxxxx.', 'xxxxxxxxx', '...?o?..',
  ],
  pear: [
    '....o??..', '...oxx...', '...xxx...', '..xxxxx..', '..xxxxx..',
    '.xxxxxxx.', '.xoxxxxx.', '.?xxxxx?.', '..xxxxx..',
  ],
  lantern: [
    '...ooo...', '..o...o..', '..xxxxx..', '.xxxxxxx.', '..xyyyx..',
    '..xyoyx..', '..xyyyx..', '.?xxxxx?.', 'xxxxxxxxx',
  ],
  tent: [
    '.........', '....x....', '...xxx...', '...xxx...', '..xxxxx..',
    '..xxoxx..', '.xxoooxx.', '.xx...xx.', '?xx...xx?',
  ],
  cup: [
    '.........', '.........', '.xxxxx?..', '.xoooxoo.', '.xxxxx.oo',
    '.xxxxx.oo', '..xxxxoo.', '..xxxxo..', '.?xxxx?..',
  ],
  fir: [
    '....x....', '...xxx...', '..xxxxx..', '...xxx...', '..xxxxx..',
    '.xxxxxxx.', '..xxxxx..', '?xxxxxxx?', '...ooo...',
  ],
  boat: [
    '....o....', '...xo....', '...xox...', '..xxoxx..', '.xxxoxx?.',
    '....o....', 'xxxxxxxxx', '.xxxxxxx.', '..?xxx?..',
  ],
  umbrella: [
    '....o....', '..xxxxx..', '.xxxxxxx.', '.xoxxxox.', '?xxoxoxx?',
    '....o....', '....o....', '....o.o..', '....ooo..',
  ],
  balloon: [
    '..xxxxx..', '.xxxxxxx.', 'xxoxxxxxx', 'xxxxxxxxx', '.xxxxxxx.',
    '..xxxxx..', '....x....', '....o.?..', '...oo.o..',
  ],
  rocket: [
    '....x....', '...xxx...', '...xxx...', '..xxxxx..', '..xooox..',
    '..xxxxx..', '.xxxxxxx.', '.oo...oo.', '.?o.y.o?.',
  ],
  envelope: [
    '.........', '?xxxxxxx?', 'oxxxxxxxo', 'xoxxxxxox', 'xxoxxxoxx',
    'xxxoooxxx', 'xxxxxxxxx', '?xxxxxxx?', '.........',
  ],
  mushroom: [
    '...xxx...', '..xxxxx..', '.xxoxxxx.', '.xxxxoxx.', '?xxxxxxx?',
    'xxxxxxxxx', '...ooo...', '...ooo...', '..?ooo?..',
  ],
  leaf: [
    '.......xx', '.....xxxx', '...xxxxxx', '..xxxxoxx', '..xxoxxxx',
    '.xxoxxxx.', '.xoxxxx..', '.oxxx....', 'o?.......',
  ],
  blossom: [
    '..?xxx?..', '..xxxxx..', '.xxoyoxx.', '?xxoyoxx?', '.xxxxxxx.',
    '..xxxxx..', '....g....', '..gggg...', '....g....',
  ],
  gift: [
    '.oo...oo.', '.o.o.o.o.', '..o.o.o..', 'xxxxoxxxx', 'xxxxoxxxx',
    '.xxxoxxx.', '.xxxoxxx.', '.xxxoxxx.', '?xxxoxxx?',
  ],
  candle: [
    '....y....', '....yy...', '...yoy...', '....o....', '..xxxxx..',
    '..xxoxx..', '..xxoxx..', '..xxxxx..', '..?xxx?..',
  ],
  house: [
    '....x.?..', '...xxx?..', '..xxxxx..', '.xxxxxxx.', 'xxxxxxxxx',
    '.xoxxxox.', '.xxxxxxx.', '.xxxoxxx.', '.?xxoxx?.',
  ],
  camera: [
    '.........', '..?xx?o..', '.xxxxxxx.', 'xxxoooxxx', 'xxoxkxoxx',
    'xxoxkxoxx', 'xxxoooxxx', '?xxxxxxx?', '.........',
  ],
  shirt: [
    '..x...x..', '.xxxoxxx.', 'xxxxoxxxx', 'xxxxxxxxx', '?xxxxxxxx',
    '..xxxxx..', '..xxxxx..', '..xxxxx..', '..?xxx?..',
  ],
  cupcake: [
    '....o....', '...xxx...', '..xxoxx..', '.xxxxxxx.', '?xxxxxxx?',
    '.ooooooo.', '..obobo..', '..obobo..', '..?ooo?..',
  ],
  cherries: [
    '....o??..', '...ooo...', '...o.o...', '..o..o...', '.xx..xxx.',
    'xxxx.xxxx', 'xoxx.xxox', '?xx..xxx?', '.........',
  ],
  spade: [
    '...ooo...', '...o.o...', '...ooo...', '....o....', '...xxx...',
    '..xxxxx..', '..xxxxx..', '..?xxx?..', '...xxx...',
  ],
  jellyfish: [
    '...xxx...', '..xxxxx..', '.xxxxxxx.', '?xxoxxxx?', 'xxxxxxxxx',
    '..o.o.o..', '..o.o.o..', '.oo.o.oo.', '.?..o..?.',
  ],
  butterfly: [
    '.xx...xx.', 'xxxx.xxxx', 'xxoxoxoxx', 'xxxoooxxx', '.xxoooxx.',
    '..xooox..', '.xxxoxxx.', '.?xxoxx?.', '..x...x..',
  ],
};

const colors = [
  { name: '붉은', body: 'd', detail: 'w' },
  { name: '주황빛', body: 'r', detail: 'k' },
  { name: '금빛', body: 'y', detail: 'b' },
  { name: '초록', body: 'g', detail: 'w' },
  { name: '청록색', body: 't', detail: 'k' },
  { name: '보랏빛', body: 'v', detail: 'w' },
  { name: '갈색', body: 'b', detail: 'w' },
  { name: '분홍빛', body: 'p', detail: 'k' },
  { name: '연둣빛', body: 's', detail: 'k' },
];

const backgrounds = { 소품: '#f4e7e0', 자연: '#e6ecd9', 풍경: '#e5eceb', 동물: '#e9e9de' };

function silhouette(rows) {
  const bitmap = rows.map(row => row.replace(/[^.]/g, '#'));
  const occupied = bitmap.filter(row => row.includes('#'));
  if (!occupied.length) return '';
  const first = Math.min(...occupied.map(row => row.indexOf('#')));
  const last = Math.max(...occupied.map(row => row.lastIndexOf('#')));
  // Trim the outside margin but preserve interior gaps such as the space above a boat's hull.
  const filledRows = bitmap.slice(bitmap.indexOf(occupied[0]), bitmap.lastIndexOf(occupied.at(-1)) + 1);
  return filledRows.map(row => row.slice(first, last + 1)).join('/');
}

function pattern(rows, optionalMask, flipped) {
  let nextBit = 0;
  return rows.map(row => {
    const filled = row.replace(/\?/g, () => (optionalMask & (1 << nextBit++)) ? 'x' : '.');
    return flipped ? [...filled].reverse().join('') : filled;
  });
}

function rasterize(rows, size, layout, palette) {
  const bounds = size === 10 ? [9, 10] : [size - 2, size - 1];
  const width = size === 5 ? size : bounds[layout % 2];
  const height = size === 5 ? size : bounds[Math.floor(layout / 2)];
  const left = Math.floor((size - width) / 2);
  const top = Math.floor((size - height) / 2);

  return Array.from({ length: size }, (_, y) => {
    let row = '';
    for (let x = 0; x < size; x++) {
      const u = (x - left + 0.5) * rows[0].length / width;
      const v = (y - top + 0.5) * rows.length / height;
      const sourceX = Math.floor(u);
      const sourceY = Math.floor(v);
      const ink = rows[sourceY]?.[sourceX];
      if (!ink || ink === '.') {
        row += '.';
        continue;
      }

      const fractionX = u - sourceX;
      const fractionY = v - sourceY;
      const edgeX = fractionX < 0.5 ? -1 : 1;
      const edgeY = fractionY < 0.5 ? -1 : 1;
      const distanceToCorner = Math.min(fractionX, 1 - fractionX) + Math.min(fractionY, 1 - fractionY);
      const horizontal = rows[sourceY][sourceX + edgeX];
      const vertical = rows[sourceY + edgeY]?.[sourceX];
      const outerCorner = (!horizontal || horizontal === '.') && (!vertical || vertical === '.');
      if (size >= 15 && outerCorner && distanceToCorner < 0.28) row += '.';
      else row += ink === 'x' ? palette.body : ink === 'o' ? palette.detail : ink;
    }
    return row;
  });
}

function createArtwork({ size, slot, week, day, takenMotifs, recentMotifs, takenShapes, takenNames }) {
  for (let offset = 0; offset < motifs.length; offset++) {
    const motif = motifs[(week + slot * 7 + offset) % motifs.length];
    if (takenMotifs.has(motif.id) || recentMotifs.includes(motif.id)) continue;

    const nextColor = (week + slot * 3 + offset) % colors.length;
    const palette = colors.map((_, index) => colors[(nextColor + index) % colors.length])
      .find(color => !takenNames.has(color.name + ' ' + motif.name));
    if (!palette) continue;

    const candidate = {
      id: motif.id + size + '-' + day.replaceAll('-', ''),
      name: palette.name + ' ' + motif.name,
      size,
      category: motif.category,
      bg: backgrounds[motif.category],
      givens: [],
    };
    const design = size === 5 ? motif.rows : detailedMotifs[motif.id];
    const optionCount = 2 ** (design.join('').split('?').length - 1);
    const layouts = size === 5 ? 1 : 4;
    const tried = new Set();
    for (let trial = 0; trial < optionCount * layouts * 2; trial++) {
      const choice = (trial + week * 13 + slot * 5) % (optionCount * layouts * 2);
      const rows = rasterize(pattern(design, choice % optionCount, choice >= optionCount * layouts),
        size, Math.floor(choice / optionCount) % layouts, palette);
      const shape = silhouette(rows);
      if (!shape || takenShapes.has(shape) || tried.has(shape)) continue;
      tried.add(shape);
      const puzzle = { ...candidate, rows };
      if (solvePuzzle(puzzle).unknown !== 0) continue;

      takenMotifs.add(motif.id);
      takenShapes.add(shape);
      takenNames.add(puzzle.name);
      recentMotifs.push(motif.id);
      if (recentMotifs.length > 3) recentMotifs.shift();
      return puzzle;
    }
  }
  throw new Error(day + ' · ' + size + '×' + size + '에 쓸 새 도안이 부족합니다. weekly-art.cjs에 소재를 추가하세요.');
}

module.exports = { createArtwork, silhouette };
