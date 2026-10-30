import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,dictionary,differences,validate,neighbors,available,findPath,openingPools,chooseStart,createGame,submit,tick,finish,remaining,pause,resume,hint,pack,restore} from '../dist/engine.js';

test('Turkish i/ı and composed Unicode stay distinct; circumflex policy is explicit',()=>{
  assert.equal(normalize('  çiğ  '),'ÇİĞ');assert.equal(normalize('kır'),'KIR');assert.equal(normalize('göl'),'GÖL');assert.equal(normalize('kâr'),'KAR');assert.equal(normalize('I\u0307'),'İ');assert.equal(differences('KIR','KİR'),1);
});
test('exactly one substitution; length and order cannot change',()=>{
  assert.equal(validate('KEK','çek').ok,true);assert.equal(validate('KEK','KEK').code,'difference');assert.equal(validate('KEK','ÇOK').code,'difference');assert.equal(validate('KEK','KEKİ').code,'length');assert.equal(validate('KEK','KE!').code,'letters');assert.equal(validate('KEK','KKE').code,'difference');
});
test('inflections, names, abbreviations and unlisted imperatives are not generated',()=>{
  for(const w of ['EVE','EVİ','EVDE','EVDEN','EVLER','EVİN','ADAMI','BANA','SANA','ONU','ŞUNA','GEL','GİT','GELDİ','GİTTİ','TÜRKİYE','TDK','KDK'])assert.equal(dictionary.has(w),false,w);
  assert.equal(validate('EGE','EVE').code,'dictionary');
});
test('independent noun meanings and lexicalized derived words survive',()=>{
  for(const w of ['ÇEK','DOLMA','GELİR','GİDER','YAZAR','YEMEK','İLMEK','IRMAK','KAPI','YAZI','BİLGİ','ÇİĞ','GÜL'])assert.equal(dictionary.has(w),true,w);
});
test('missing everyday headwords and the AHMAK suffix-filter regression are accepted',()=>{
  for(const w of ['AHMAK','KAZMA','ARAMA','EŞSİZ','İŞSİZ','SÜTÇÜ','YAĞIŞ','CAMCI','CÜPPE','ÇITIR','GÜLÜŞ','GEÇİŞ','AKIŞ','ÖĞE','JİP','BAYT','BLOG','NEMLİ','YAŞLI','GURME','REFLÜ','VEGAN','YÜZME'])assert.equal(dictionary.has(w),true,w);
  for(const [from,to] of [['EKSİZ','EŞSİZ'],['KAZMA','YAZMA'],['GÜMÜŞ','GÜLÜŞ'],['AKIŞ','ATIŞ'],['YAĞIŞ','BAĞIŞ']]){
    assert.equal(dictionary.has(from),true,from);assert.equal(validate(from,to).ok,true,`${from} -> ${to}`);
  }
});
test('listed infinitives are accepted without admitting conjugated or possessive forms',()=>{
  for(const w of ['AÇMAK','ALMAK','ANMAK','DEMEK','ETMEK','İÇMEK','İNMEK','OLMAK','ÖLMEK','ÖVMEK','ÜZMEK'])assert.equal(dictionary.has(w),true,w);
  for(const w of ['EVE','EVİ','EVDE','EVDEN','EVİN','EVLER','KEKİ','ÇAYI','KEDİM','ADIMI','AĞACI','GÖZÜ','GELDİ','BAKTI','YAPTI','OKUDU','BİZİ','SİZE','GEL','GİT'])assert.equal(dictionary.has(w),false,w);
  assert.equal(validate('EĞMEK','EZMEK').ok,true);
});
test('new headwords extend a real chain and still cannot be repeated',()=>{
  const g=createGame({length:5,start:'YAZMA',now:0});
  for(const w of ['KAZMA','KAYMA','KALMA','DALMA','DALGA'])assert.equal(submit(g,w,1).ok,true,w);
  assert.equal(g.moves,5);assert.equal(submit(g,'DALMA',2).code,'repeat');
});
test('additive dictionary update replays previous-version saves without trusting their scores',()=>{
  const old=pack(createGame({start:'KEK',now:0}));old.version='2026-10-30.1';old.history.push({word:'ÇEK',player:null},{word:'ÇOK',player:null});old.moves=999;
  const restored=restore(old);assert.ok(restored);assert.equal(restored.current,'ÇOK');assert.equal(restored.moves,2);assert.equal(restored.version,'2026-10-30.2');
  assert.equal(restore({...old,history:[...old.history,{word:'EVİ'}]}),null);
});
test('the full 19-move example is legal, including repeat letter-position changes',()=>{
  const g=createGame({start:'KEK',now:0});const words='ÇEK ÇOK ŞOK TOK TOP TİP DİP DİL DAL BAL BOL YOL KOL KÜL GÜL GÖL GOL SOL SAL'.split(' ');
  for(const w of words)assert.equal(submit(g,w,1).ok,true,w);assert.equal(g.moves,19);assert.equal(g.used.size,20);
});
test('a shared used set blocks returning to the opening or opponents words',()=>{
  const g=createGame({mode:'duel',start:'KEK',now:0});submit(g,'ÇEK',1);assert.equal(submit(g,'KEK',2).code,'repeat');submit(g,'ÇOK',3);assert.equal(submit(g,'ÇEK',4).code,'repeat');assert.equal(g.moves,2);
});
test('invalid moves do not consume a turn, points or reset the clock',()=>{
  const g=createGame({mode:'duel',start:'KEK',now:0});const before=pack(g);assert.equal(submit(g,'XYZ',100).ok,false);assert.deepEqual(pack(g),before);
});
test('duel passes control and resets the next 30-second turn clock',()=>{
  const g=createGame({mode:'duel',start:'KEK',now:100});assert.equal(submit(g,'ÇEK',1000).ok,true);assert.equal(g.turn,1);assert.equal(g.deadline,31000);assert.equal(g.history[1].player,0);assert.equal(pause(g,1001),false);assert.equal(hint(g,1001),null);
});
test('deadline wins over a late submission; a timeout is scored only once',()=>{
  const g=createGame({mode:'duel',start:'KEK',now:0});assert.equal(submit(g,'ÇEK',30000).ok,false);assert.equal(g.reason,'timeout');assert.equal(g.winner,1);assert.equal(g.moves,0);tick(g,40000);finish(g,'blocked',50000,0);assert.deepEqual(g.scores,[0,1]);
});
test('timed solo uses one absolute deadline, not extra seconds per word',()=>{
  const g=createGame({mode:'rush',start:'KEK',now:0});submit(g,'ÇEK',10000);assert.equal(g.deadline,120000);assert.equal(remaining(g,11000),109000);tick(g,130000);assert.equal(g.status,'ended');assert.equal(g.reason,'timeout');
});
test('pause freezes remaining time; resume resets only by paused duration',()=>{
  const g=createGame({mode:'rush',start:'KEK',now:0});assert.equal(pause(g,30000),true);tick(g,900000);assert.equal(g.status,'paused');assert.equal(remaining(g,900000),90000);assert.equal(submit(g,'ÇEK',900000).ok,false);resume(g,900000);assert.equal(g.deadline,990000);assert.equal(submit(g,'ÇEK',900001).ok,true);
});
test('hints are legal unused words and mark the run as assisted',()=>{
  const g=createGame({start:'KEK',now:0});const w=hint(g,100);assert.equal(validate(g.current,w,g.used).ok,true);assert.equal(g.assisted,true);assert.equal(g.hints,1);assert.equal(g.moves,0);
});
test('all advertised starting words have an actual 12/8-move common-word path',()=>{
  for(const n of [3,4,5]){assert.ok(openingPools[n].length>=10);for(const w of openingPools[n]){const moves=n===5?8:12,p=findPath(w,moves);assert.ok(p,w);assert.equal(new Set(p).size,p.length);assert.ok(p.length>moves);}}
});
test('duel opening cannot be won by an immediate leaf-word move',()=>{
  for(const n of [3,4,5])for(let i=0;i<100;i++){const w=chooseStart(n,'duel',new Set(),()=>i/100);for(const next of neighbors(w))assert.ok(available(next,new Set([w,next])).length,`${w} -> ${next}`);}
});
test('calm sessions restore by replaying legal moves and ignore forged scores',()=>{
  const g=createGame({start:'KEK',now:0});submit(g,'ÇEK',1);submit(g,'ÇOK',2);hint(g,3);const data=pack(g);data.moves=10000;const r=restore(data);assert.equal(r.moves,2);assert.equal(r.current,'ÇOK');assert.equal(r.assisted,true);assert.equal(r.used.size,3);assert.equal(restore({...data,history:[...data.history,{word:'EVİ'}]}),null);assert.equal(restore({...data,version:'old'}),null);assert.equal(restore(null),null);
});
test('dead ends end calm/duel but open a fresh timed chain without repeating words',()=>{
  const target=[...dictionary].find(w=>w.length===3&&neighbors(w).length===1);assert.ok(target);const previous=neighbors(target)[0];
  const calm=createGame({start:previous,now:0});assert.equal(submit(calm,target,1).ok,true);assert.equal(calm.status,'ended');assert.equal(calm.reason,'blocked');
  const duel=createGame({mode:'duel',start:previous,now:0});submit(duel,target,1);assert.equal(duel.winner,0);assert.deepEqual(duel.scores,[1,0]);
  const rush=createGame({mode:'rush',start:previous,now:0});const result=submit(rush,target,1);assert.equal(result.newChain,true);assert.equal(rush.chains,2);assert.equal(rush.moves,1);assert.equal(rush.deadline,120000);assert.equal(new Set(rush.history.map(e=>e.word)).size,rush.history.length);
});
test('simulated games preserve legal transitions, no repetition and one terminal outcome',()=>{
  let random=324712;const rng=()=>{random=(random*1664525+1013904223)>>>0;return random/2**32;};
  for(const n of [3,4,5])for(let run=0;run<40;run++){
    const g=createGame({mode:run%2?'duel':'calm',length:n,start:chooseStart(n,'duel',new Set(),rng),now:0});let now=0;
    while(g.status==='playing'&&g.moves<200){const next=available(g.current,g.used);assert.ok(next.length);const chosen=next[Math.floor(rng()*next.length)];const old=g.current;assert.equal(submit(g,chosen,++now).ok,true);assert.equal(differences(old,g.current),1);assert.equal(g.used.size,g.moves+1);}
    if(g.mode==='duel'&&g.status==='ended')assert.equal(g.scores.reduce((a,b)=>a+b),1);
  }
});
