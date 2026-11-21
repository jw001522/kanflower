const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const {solvePuzzle,lineDomain,clues}=require('./solver.cjs');const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/puzzles.js','utf8')+fs.readFileSync('dist/extra-puzzles.js','utf8')+fs.readFileSync('dist/more-puzzles.js','utf8')+fs.readFileSync('dist/bloom-puzzles.js','utf8')+fs.readFileSync('dist/refined-puzzles.js','utf8')+fs.readFileSync('dist/weekly-puzzles.js','utf8')+';this.puzzles=PUZZLES;this.weekly=WEEKLY_RELEASES;this.solution=solution;this.colors=COLORS',ctx);
// Cross-check the polynomial line solver against exhaustive enumeration on short lines.
for(let mask=0;mask<128;mask++){const row=Array.from({length:7},(_,i)=>(mask>>i)&1),runs=clues(row),known=row.map((v,i)=>i%3===0?(v?1:-1):0),domain=lineDomain(7,runs,known);let on=0n,off=0n;for(let alt=0;alt<128;alt++){const r=Array.from({length:7},(_,i)=>(alt>>i)&1);if(JSON.stringify(clues(r))!==JSON.stringify(runs)||r.some((v,i)=>known[i]&&v!==(known[i]===1?1:0)))continue;for(let i=0;i<7;i++){if(r[i])on|=1n<<BigInt(i);else off|=1n<<BigInt(i)}}assert.equal(domain.on,on);assert.equal(domain.off,off)}
const timedPuzzles = ctx.weekly.flatMap(release => release.puzzles);
const allPuzzles = [...ctx.puzzles, ...timedPuzzles];
assert.equal(new Set(allPuzzles.map(p => p.id)).size, allPuzzles.length, 'All puzzles must have stable, unique IDs');
assert.ok(ctx.weekly.length > 0, "The weekly catalog must contain a release");
let previousRelease;
for (const batch of ctx.weekly) {
  assert.match(batch.publishAt, /^\d{4}-\d{2}-\d{2}T10:00:00\+09:00$/);
  const release = Date.parse(batch.publishAt);
  const day = batch.publishAt.slice(0, 10);
  assert.ok(new Date(release).getUTCDay() === 1 && new Date(release).toISOString().slice(0, 10) === day, day + ': Monday release');
  if (previousRelease !== undefined) {
    assert.equal(release - previousRelease, 7 * 24 * 60 * 60 * 1000, day + ': exactly one week apart');
  }
  previousRelease = release;
  assert.deepEqual(Array.from(batch.puzzles, puzzle => puzzle.size).sort((a,b) => a-b), [5, 10, 15, 20], day + ': exactly one work of each size');
  for (const puzzle of batch.puzzles) {
    assert.ok(puzzle.name.trim() && ['자연', '동물', '풍경', '소품'].includes(puzzle.category), puzzle.id + ': title and category');
    assert.equal(puzzle.givens.length, 0, puzzle.id + ': solve using only line clues');
    assert.equal(solvePuzzle(puzzle).unknown, 0, puzzle.id + ': solve without guessing');
  }
}
const weeklyIds=['chick5-20261102','cabin10-20261102','boot15-20261102','pinecone20-20261102'];
assert.deepEqual(weeklyIds.map(id=>ctx.puzzles.find(p=>p.id===id)?.size),[5,10,15,20]);
assert.ok(weeklyIds.every(id=>ctx.puzzles.find(p=>p.id===id).givens.length===0));
function countSmall(p){const n=p.size,answer=ctx.solution(p),domains=cl=>Array.from({length:2**n},(_,m)=>Array.from({length:n},(_,i)=>(m>>i)&1)).filter(r=>JSON.stringify(clues(r))===JSON.stringify(cl)),rows=Array.from({length:n},(_,r)=>domains(clues(answer.slice(r*n,(r+1)*n)))),cols=Array.from({length:n},(_,c)=>domains(clues(Array.from({length:n},(_,r)=>answer[r*n+c]))));let count=0;function search(board){if(count>1)return;if(board.length===n){count++;return}for(const row of rows[board.length]){const next=[...board,row];if(cols.every((options,c)=>options.some(v=>next.every((line,k)=>line[c]===v[k]))))search(next)}}search([]);return count}
for(const p of allPuzzles){assert.equal(p.rows.length,p.size);for(const row of p.rows){assert.equal(row.length,p.size);for(const c of row)assert.ok(c==='.'||ctx.colors[c])}const solved=solvePuzzle(p);if(solved.unknown&&p.size<=10){assert.equal(countSmall(p),1,p.id+' unique solution')}else{assert.equal(solved.unknown,0,p.id+' must solve without guesses');assert.equal(JSON.stringify(solved.board.map(v=>v===1?1:0)),JSON.stringify(ctx.solution(p)),p.id+' must match artwork')}assert.ok((p.givens||[]).length<=10);console.log(`PASS ${p.id}: ${p.size}x${p.size}, unique solution`)}
console.log('PASS: line solver independently checked; '+allPuzzles.length+' unique puzzles; scheduled puzzles solve from line clues alone.');
