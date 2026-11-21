const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const scripts=['puzzles','extra-puzzles','more-puzzles','bloom-puzzles','refined-puzzles','weekly-puzzles'].map(f=>fs.readFileSync('dist/'+f+'.js','utf8')).join('\n');
const app=fs.readFileSync('dist/app.js','utf8');
const setup=fs.readFileSync('smoke.cjs','utf8').split('vm.createContext(context);')[0];
function boot(saved={}){const fixture=new Function('require',setup+';return {context,storage};')(require);fixture.storage.set('nemo-garden-v1',JSON.stringify(saved));vm.createContext(fixture.context);vm.runInContext(scripts+'\n'+app,fixture.context);return code=>vm.runInContext(code,fixture.context)}
let run=boot();
for(const id of ['turtle20','watermelon15','clock20-20261026','umbrella10','cup5']){
run('load(PUZZLES.find(p=>p.id==='+JSON.stringify(id)+'))');
assert.ok(run('automaticSet.size')>0,id);
assert.equal(run('[...automaticSet].every(i=>state.cells[i]===-1)'),true);
assert.equal(run('puzzleStatus(current)'),'new');
run('globalThis.before=JSON.stringify(state.cells);start([...automaticSet][0],0);end()');
assert.equal(run('JSON.stringify(state.cells)===before'),true);
run('globalThis.target=state.cells.findIndex((v,i)=>!givenSet.has(i));start(target,1);end();$("#undo").click()');
assert.equal(run('JSON.stringify(state.cells)===before'),true);
run('$("#confirmReset").click()');assert.equal(run('[...automaticSet].every(i=>state.cells[i]===-1)'),true);
}
const old={cells:Array(225).fill(0),seconds:34,hints:1,won:false,collected:false};old.cells[100]=1;
run=boot({current:'cat15',cat15:old});assert.equal(run('current.usingPrevious'),true);assert.equal(run('state.cells[100]'),1);assert.equal(run('state.seconds'),34);assert.equal(run("state.artRevision"),'legacy-20261031');
run('save()');const saved=JSON.parse(run("localStorage.getItem('nemo-garden-v1')"));run=boot(saved);assert.equal(run('current.usingPrevious'),true);run('$("#confirmReset").click()');assert.equal(run('current.usingPrevious'),false);assert.equal(run('state.artRevision'),'20261031');
const complete={...old,won:true,collected:true};
run=boot({current:'cat15',cat15:complete});assert.equal(run('state.won'),true);assert.equal(run('state.cells.every((v,i)=>(v===1?1:0)===answer[i])'),true);assert.equal(run('state.seconds'),34);
console.log('PASS: 0-line autofill across sizes, locked marks, undo, reset, untouched status, old progress/reload preserved, deliberate reset opens revised art, completed collection retained.');
