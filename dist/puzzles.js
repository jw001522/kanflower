const PUZZLES = [
 {id:'tulip',name:'봄날의 튤립',en:'SPRING TULIP',size:10,tag:'꽃 한 송이',bg:'#f5e8df',rows:['..p....p..','..pp..pp..','..pppppp..','...pppp...','....gg....','....gg....','.gg.gg....','..gggg.gg.','...ggggg..','....gg....']},
 {id:'tree',name:'느긋한 나무',en:'SLOW GROWING TREE',size:10,tag:'초록의 쉼',bg:'#e6ecd9',rows:['....gg....','...gggg...','..gggggg..','.gggggggg.','.gggggggg.','..gggggg..','....bb....','....bb....','...bbbb...','..gggggg..']},
 {id:'heart',name:'작은 마음',en:'LITTLE LOVE',size:5,tag:'첫 번째 한 칸',bg:'#f4e3e2',rows:['.p.p.','ppppp','ppppp','.ppp.','..p..']},
 {id:'sprout',name:'새로운 시작',en:'A NEW BEGINNING',size:5,tag:'작은 새싹',bg:'#e6ebd9',rows:['gg.gg','.ggg.','..g..','..g..','.bbb.']},
 {id:'mushroom',name:'숲속의 버섯',en:'FOREST TREASURE',size:10,tag:'숲의 작은 비밀',bg:'#f1e6db',rows:['...rrrr...','..rrrrrr..','.rrrrrrrr.','rrrrrrrrrr','rrrrrrrrrr','...bbbb...','...bbbb...','...bbbb...','..bbbbbb..','..........']},
 {id:'cup',name:'따뜻한 한 잔',en:'A WARM LITTLE CUP',size:10,tag:'오후의 여유',bg:'#e7e8e1',rows:['...b.b....','...b.b....','..........','.ttttttt..','.tttttttt.','.ttttt.tt.','.tttttttt.','..tttttt..','..........','.bbbbbbbb.']}
];
const COLORS={d:'#b85153',k:'#485047',w:'#f3efe2',p:'#d88495',g:'#759567',b:'#b28a65',r:'#d78e64',t:'#88a5a0',a:'#bbd2cd',v:'#8d88a5',y:'#e3c787',s:'#a7b98b'};
function clues(line){const out=[];let n=0;for(const a of [...line,0]){if(a)n++;else if(n){out.push(n);n=0}}return out.length?out:[0]}
function solution(p){return p.rows.join('').split('').map(c=>c!=='.'?1:0)}
const artCache=new Map();
function svgArt(p){if(artCache.has(p.id))return artCache.get(p.id);const paths={};p.rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c!=='.')paths[c]=(paths[c]||'')+`M${x} ${y}h1v1h-1Z`}));const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${p.size+2} ${p.size+2}" role="img" aria-label="${p.name}" shape-rendering="crispEdges">${Object.entries(paths).map(([c,d])=>`<path fill="${COLORS[c]}" d="${d}"/>`).join('')}</svg>`;artCache.set(p.id,svg);return svg}
