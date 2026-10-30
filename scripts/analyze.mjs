import fs from 'node:fs';
import {dictionary,common,neighbors,available,openingPools,chooseStart,createGame,submit,findPath} from '../dist/engine.js';
let seed=20261030;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};
const results=[];
for(const length of [3,4,5]){
  const lengths=[];
  for(let i=0;i<100;i++){
    const g=createGame({mode:'calm',length,start:chooseStart(length,'calm',new Set(),rng),now:0});
    while(g.status==='playing'&&g.moves<500){const options=available(g.current,g.used);const familiar=options.filter(w=>common.has(w));const choices=familiar.length?familiar:options;submit(g,choices[Math.floor(rng()*choices.length)],g.moves+1);}
    lengths.push(g.moves);
  }
  lengths.sort((a,b)=>a-b);
  results.push({length,words:[...dictionary].filter(w=>w.length===length).length,openings:openingPools[length].length,simulations:100,policy:'Uniform random among preferred common-word neighbors, otherwise all legal neighbors',minimum:lengths[0],median:(lengths[49]+lengths[50])/2,maximum:lengths.at(-1),example:findPath(openingPools[length][0],length===5?8:12)});
}
const report={generated:'2026-10-30',dictionary:dictionary.size,warning:'Simulated move counts, not human usability results, difficulty guarantees or maximum possible chain lengths.',results};
fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/graph-analysis.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
