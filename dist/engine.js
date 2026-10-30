import { WORDS, COMMON, DICTIONARY_VERSION } from './lexicon.js';
export { DICTIONARY_VERSION };
export const normalize = s => String(s).normalize('NFC').trim().toLocaleUpperCase('tr-TR').replaceAll('Â','A').replaceAll('Î','İ').replaceAll('Û','U');
export const dictionary = new Set(WORDS);
export const common = new Set(COMMON);
const patterns = new Map();
for (const word of WORDS) for (let i=0;i<word.length;i++) {
  const key=word.slice(0,i)+'*'+word.slice(i+1);
  if(!patterns.has(key)) patterns.set(key,[]);
  patterns.get(key).push(word);
}
const cache=new Map();
export function neighbors(word) {
  word=normalize(word);
  if(!cache.has(word)) {
    const result=new Set();
    for(let i=0;i<word.length;i++) for(const w of patterns.get(word.slice(0,i)+'*'+word.slice(i+1))||[]) if(w!==word)result.add(w);
    cache.set(word,[...result].sort((a,b)=>Number(common.has(b))-Number(common.has(a))||a.localeCompare(b,'tr')));
  }
  return cache.get(word);
}
export function available(word,used=new Set()) { return neighbors(word).filter(w=>!used.has(w)); }
export function differences(a,b) { if(a.length!==b.length)return Infinity;return [...a].filter((c,i)=>c!==b[i]).length; }
export function validate(current,raw,used=new Set()) {
  const word=normalize(raw);
  if(word.length!==current.length)return {ok:false,code:'length',message:`Kelime ${current.length} harfli kalmalı.`};
  if(!/^[A-ZÇĞİÖŞÜ]+$/.test(word))return {ok:false,code:'letters',message:'Yalnızca Türkçe harf kullan.'};
  if(differences(current,word)!==1)return {ok:false,code:'difference',message:'Yalnızca bir harfi değiştir.'};
  if(used.has(word))return {ok:false,code:'repeat',message:'Bu kelime zincirde kullanıldı. Başka bir yol bul.'};
  if(!dictionary.has(word))return {ok:false,code:'dictionary',message:'Oyun sözlüğünde yok. Çekim ekleri ve özel adlar kabul edilmez.'};
  return {ok:true,word};
}
// Bounded DFS: opening selection must have an actual common-word continuation,
// rather than relying on degree or connected-component size alone.
export function findPath(start,minMoves=8,limit=4000) {
  let visits=0;const path=[start],seen=new Set(path);
  function walk(word) {
    if(path.length>minMoves)return [...path];
    if(++visits>limit)return null;
    const options=neighbors(word).filter(w=>common.has(w)&&!seen.has(w));
    options.sort((a,b)=>neighbors(b).filter(w=>common.has(w)).length-neighbors(a).filter(w=>common.has(w)).length);
    for(const w of options){seen.add(w);path.push(w);const found=walk(w);if(found)return found;path.pop();seen.delete(w);}
    return null;
  }
  return walk(start);
}
const preferred={3:['KEK','BAL','KAR','KOL','GÜL','ÇAY','KUM','TAS','YOL','TAŞ','CAN','KAZ','SÖZ','DAL','TOP','SAÇ','GÖL','GÜN'],4:['KALE','KARA','KASA','KAYA','PARA','MASA','DERE','SARI','KOVA','DANA','YAKA','KAPI','TAVA','TANE','KONU','KEDİ','KORU','KURU','SERA','KULE'],5:['KABAK','KAYIK','KAYIN','KAPAK','KAZAN','DAMAR','DAMAT','TABAN','TAVAN','TARAK','YATAK','YASAK','YARIK','YARIM','SABAN','SAMAN','KAVAK','ÇAKIL','TAKIM','DURAK']};
// Continuations are validated in tests, avoiding a blocking DFS at browser startup.
export const openingPools=Object.fromEntries([3,4,5].map(n=>[n,preferred[n].filter(w=>dictionary.has(w))]));
export function chooseStart(length,mode='calm',exclude=new Set(),rng=Math.random) {
  let pool=openingPools[length].filter(w=>!exclude.has(w)&&available(w,exclude).length>=2);
  pool=pool.filter(w=>neighbors(w).every(next=>available(next,new Set([...exclude,w,next])).length>0));
  if(!pool.length)pool=openingPools[length].filter(w=>!exclude.has(w)&&available(w,exclude).length>0);
  if(!pool.length)pool=COMMON.filter(w=>w.length===length&&!exclude.has(w)&&available(w,exclude).length>=2);
  return pool.length?pool[Math.floor(rng()*pool.length)%pool.length]:null;
}
export const DURATIONS={calm:0,rush:120000,duel:30000};
export function createGame({mode='calm',length=3,names=['Oyuncu 1','Oyuncu 2'],round=1,scores=[0,0],starter=0,start,now=Date.now()}={}) {
  if(!['calm','rush','duel'].includes(mode)||![3,4,5].includes(length))throw new Error('Geçersiz oyun ayarı');
  const first=start||chooseStart(length,mode);
  if(!dictionary.has(first)||first.length!==length)throw new Error('Geçersiz başlangıç');
  return {version:DICTIONARY_VERSION,mode,length,names:names.map((n,i)=>String(n||`Oyuncu ${i+1}`).slice(0,20)),round,scores:[...scores],starter,turn:starter,current:first,history:[{word:first,player:null}],used:new Set([first]),moves:0,assisted:false,hints:0,status:'playing',deadline:DURATIONS[mode]?now+DURATIONS[mode]:null,pausedRemaining:null,startedAt:now,endedAt:null,winner:null,reason:null,chains:1};
}
export function remaining(game,now=Date.now()){return game.pausedRemaining??Math.max(0,(game.deadline??now)-now);}
export function finish(game,reason,now=Date.now(),winner=null) {
  if(game.status==='ended')return;
  game.status='ended';game.reason=reason;game.endedAt=now;game.winner=winner;
  if(game.mode==='duel'&&winner!==null)game.scores[winner]++;
}
export function tick(game,now=Date.now()) {
  if(game.status==='playing'&&game.deadline!==null&&now>=game.deadline)finish(game,'timeout',now,game.mode==='duel'?1-game.turn:null);
  return game.status;
}
export function submit(game,raw,now=Date.now()) {
  tick(game,now);
  if(game.status!=='playing')return {ok:false,code:'ended',message:'Bu tur sona erdi.'};
  const result=validate(game.current,raw,game.used);if(!result.ok)return result;
  game.current=result.word;game.used.add(result.word);game.moves++;
  game.history.push({word:result.word,player:game.mode==='duel'?game.turn:null});
  if(game.mode==='duel'){game.turn=1-game.turn;game.deadline=now+DURATIONS.duel;}
  if(!available(game.current,game.used).length) {
    if(game.mode==='rush') {
      const next=chooseStart(game.length,'rush',game.used);
      if(next){game.current=next;game.used.add(next);game.history.push({word:next,player:null,newChain:true});game.chains++;return {...result,newChain:true};}
    }
    finish(game,'blocked',now,game.mode==='duel'?1-game.turn:null);
  }
  return result;
}
export function pause(game,now=Date.now()) {
  tick(game,now);if(game.status!=='playing'||game.mode==='duel')return false;
  game.pausedRemaining=game.deadline===null?null:remaining(game,now);game.status='paused';return true;
}
export function resume(game,now=Date.now()) {if(game.status!=='paused')return; if(game.pausedRemaining!==null)game.deadline=now+game.pausedRemaining;game.pausedRemaining=null;game.status='playing';}
export function hint(game,now=Date.now()) {
  tick(game,now);if(game.status!=='playing'||game.mode==='duel')return null;
  const options=available(game.current,game.used);if(!options.length)return null;
  const familiar=options.filter(w=>common.has(w));
  const next=[...(familiar.length?familiar:options)].sort((a,b)=>available(b,game.used).length-available(a,game.used).length)[0];
  game.assisted=true;game.hints++;return next;
}
export function pack(game){return {...game,used:[...game.used]};}
export function restore(raw) {
  try{
    if(raw.version!==DICTIONARY_VERSION||raw.mode!=='calm'||!['playing','paused'].includes(raw.status)||!Array.isArray(raw.history)||!raw.history.length)return null;
    const game=createGame({mode:'calm',length:raw.length,start:raw.history[0].word,now:raw.startedAt});
    for(const entry of raw.history.slice(1))if(!submit(game,entry.word,raw.startedAt).ok)return null;
    if(game.status==='ended')return null;
    game.assisted=!!raw.assisted;game.hints=Math.max(0,Number(raw.hints)||0);return game;
  }catch{return null;}
}
