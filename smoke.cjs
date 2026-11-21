const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const elements=new Map(),storage=new Map();function element(id){if(!elements.has(id)){const styles=new Map();elements.set(id,{hidden:false,width:150,height:150,clientWidth:800,clientHeight:500,scrollTop:0,scrollLeft:0,style:{setProperty(k,v){styles.set(k,v)},getPropertyValue(k){return styles.get(k)}},classList:{toggle(){},add(){},remove(){}},setAttribute(){},addEventListener(){},getContext(){return {fillRect(){},strokeRect(){}}},showModal(){this.open=true},close(){this.open=false},click(){this.onclick?.()},focus(){},scrollIntoView(){}})}return elements.get(id)}
let mockTime = 0;
class TestDate extends Date { static now() { return mockTime; } }
const context={console,Date:TestDate,Set,JSON,Math,Array,Number,String,requestAnimationFrame(fn){fn()},setTimeout(){},setInterval(){},document:{hidden:false,querySelector:s=>s==='dialog[open]'?null:element(s),querySelectorAll:()=>[],addEventListener(){}},window:{innerWidth:1440,addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}};vm.createContext(context);vm.runInContext(fs.readFileSync('dist/puzzles.js','utf8')+fs.readFileSync('dist/extra-puzzles.js','utf8')+fs.readFileSync('dist/more-puzzles.js','utf8')+fs.readFileSync('dist/bloom-puzzles.js','utf8')+fs.readFileSync('dist/refined-puzzles.js','utf8')+fs.readFileSync('dist/weekly-puzzles.js','utf8')+fs.readFileSync('dist/app.js','utf8'),context);function run(s){return vm.runInContext(s,context)}
run('load(PUZZLES[2]);start(1,1);end()');assert.equal(run('state.cells[1]'),1);run("$('#undo').click()");assert.equal(run('state.cells[1]'),0);
run('start(0,-1);end()');assert.equal(run('state.cells[0]'),-1);run('start(0,-1);end()');assert.equal(run('state.cells[0]'),0);run('start(0,-1);end();start(0,1);end()');assert.equal(run('state.cells[0]'),-1);run('start(0,0);end()');assert.equal(run('state.cells[0]'),0);
run('start(0,1);end();$("#hint").click()');assert.equal(run('state.cells[0]'),-1);assert.equal(run('state.hints'),1);
run('while(!state.won){$("#hint").click()}');assert.equal(run('state.won'),true);assert.equal(run('state.collected'),true);assert.equal(element('#complete').hidden,false);
run('load(PUZZLES[1]);load(PUZZLES[2])');assert.equal(run('state.won'),true);run('$("#confirmReset").click()');assert.equal(run('state.won'),false);assert.equal(run('state.cells.every(v=>v===0)'),true);assert.equal(run('state.collected'),true);
run('start(1,1);paint(2);end()');assert.equal(run('state.cells[1]===1&&state.cells[2]===1'),true);run('save()');assert.equal(JSON.parse(storage.get('nemo-garden-v1')).heart.cells[1],1);
console.log('PASS: fill, cross, toggle, drag, undo, correction hint, completion, collection, reset, persistence.');
run('load(PUZZLES.find(p=>p.id==="fox20"));globalThis.baseline=[...state.cells];globalThis.editable=state.cells.map((v,i)=>givenSet.has(i)?-1:i).filter(i=>i>=0);start(editable[0],1);paintTo(editable[2]);end()');assert.equal(run('state.cells.length'),400);assert.equal(run('state.cells[editable[0]]'),1);run('$ ("#undo").click()');assert.equal(run('JSON.stringify(state.cells)===JSON.stringify(baseline)'),true);
run('filter="20"');assert.equal(run('filtered().length'),24);run('filter="15"');assert.equal(run('filtered().length'),18);assert.equal(run('PUZZLES.some(p=>p.size>20)'),false);
run('state.cells=answer.map(v=>v?1:0);check();load(PUZZLES[0]);load(PUZZLES.find(p=>p.id==="fox20"))');assert.equal(run('state.won'),true);
console.log('PASS: existing 20x20 and 15x15 puzzles; drag, undo, completion and persistence.');
const initialPuzzleCount = run('PUZZLES.length');
const scheduled = JSON.parse(run('JSON.stringify(WEEKLY_RELEASES)'));
assert.equal(run('PUZZLES.some(p => p.id === WEEKLY_RELEASES[0].puzzles[0].id)'), false);
for (const [index, batch] of scheduled.entries()) {
  const publishAt = Date.parse(batch.publishAt);
  assert.equal(run('releaseWeeklyPuzzles(' + (publishAt - 1) + ')'), false);
  assert.equal(run('releaseWeeklyPuzzles(' + publishAt + ')'), true);
  assert.equal(run('releaseWeeklyPuzzles(' + publishAt + ')'), false);
  assert.equal(run('PUZZLES.length'), initialPuzzleCount + (index + 1) * 4);
  for (const puzzle of batch.puzzles) {
    run('chooseSize(' + puzzle.size + ')');
    assert.ok(element('#sizeTabs').innerHTML.includes('data-size="' + puzzle.size + '"'));
    assert.equal(run('filtered().at(-1).id'), puzzle.id);
    run('load(filtered().at(-1)); state.cells=answer.map(v=>v?1:0); check(); load(PUZZLES[0]); load(filtered().at(-1))');
    assert.equal(run('state.cells.length'), puzzle.size ** 2);
    assert.equal(run('state.won'), true);
  }
}
console.log('PASS: four works appear together at 10:00 KST, play, and retain completed progress.');

run("data={};filter='5';statusFilter='all';load(PUZZLES.find(p=>p.id==='boat5'))");assert.equal(run("puzzleStatus(current)"),'new','givens alone must not start a puzzle');
run("state.seconds=1;save()");assert.equal(run("puzzleStatus(current)"),'playing');assert.ok(run("puzzleProgress(current)")<100);
run("statusFilter='new'");assert.equal(run("filtered().some(p=>p.id===current.id)"),false);
run("statusFilter='playing'");assert.equal(run("filtered().length"),1);
run("state.collected=true;save();statusFilter='done'");assert.equal(run("filtered().length"),1);assert.equal(run("puzzleProgress(current)"),100);
run("PUZZLES.forEach(p=>data[p.id]={collected:true});view(true)");assert.ok(element('#gallerySummary').textContent.includes('갤러리를 완성'));
console.log('PASS: untouched givens, playing status, progress cap, status filters, collected replay, gallery completion.');

run('load(PUZZLES[2]);$(\"#confirmReset\").click();start(0,1);end();start(1,-1);end()');const beforeProtected=run('history.length');run('start(0,-1);end();start(1,1);end()');assert.equal(run('state.cells[0]'),1);assert.equal(run('state.cells[1]'),-1);assert.equal(run('history.length'),beforeProtected);run('start(2,1);paintTo(0);end()');assert.equal(run('state.cells[1]'),-1);assert.equal(run('state.cells[2]'),1);run('start(0,0);end();start(0,-1);end()');assert.equal(run('state.cells[0]'),-1);console.log('PASS: occupied cells resist opposite marks and drag; erase allows changes; blocked actions preserve undo.');

run('start(0,-1);end()');assert.equal(run('state.cells[0]'),0);run('start(0,1);end();start(0,1);paintTo(2);end()');assert.equal(run('state.cells[0]'),0);assert.equal(run('state.cells[1]'),-1);assert.equal(run('state.cells[2]'),0);run('$(\"#undo\").click()');assert.equal(run('state.cells[0]'),1);assert.equal(run('state.cells[2]'),1);console.log('PASS: same-mark toggle, selective erase drag and undo.');

const completion=(cells,runs)=>JSON.parse(run('JSON.stringify(completedClues('+JSON.stringify(cells)+','+JSON.stringify(runs)+'))'));
assert.deepEqual(completion([1,1,1,-1,0,0,0,0],[3,2]),[true,false]);
assert.deepEqual(completion([0,0,0,-1,1,1],[3,2]),[false,true]);
assert.deepEqual(completion([0,0,0,1,1,0,0,0],[2,2]),[false,false]);
assert.deepEqual(completion([1,1,-1,0,0],[2,2]),[true,false]);
assert.deepEqual(completion([1,1,-1,1,1],[2,2]),[true,true]);
assert.deepEqual(completion([1,0,1,-1,0,0,0,0],[3,2]),[false,false]);
assert.deepEqual(completion([1,1,1,1,0],[3]),[false]);
assert.deepEqual(completion([0,0,0],[0]),[true]);
console.log('PASS: individual clue completion, duplicate ambiguity, erase reversal, invalid lines and zero clues.');
