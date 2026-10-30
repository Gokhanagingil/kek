import fs from 'node:fs';
const normalize = s => s.normalize('NFC').toLocaleUpperCase('tr-TR').replaceAll('Â','A').replaceAll('Î','İ').replaceAll('Û','U');
// Exact independent headwords only. Never generate inflections or imperative stems.
const blocked = new Set(`EVE EVİ EVDE EVDEN EVİN EVLER EVLERİ ADAMI BİRİ KİMİ ÇOĞU TOPU TÜMÜ ÜZERİ ELDEN GELEN GEÇEN ONLAR ÖBÜRÜ YURDU KADARCA ABD ACYO AMCIK AMCI AMINA SİK SİKİŞ SİKME SİKİK SİKİM SİKİL ORUSPU OROSPU PİÇ PEZEV GÖT İBNE İPNE KAHPE KALT SOYKIR`.split(/\s+/));
const common = new Set([...fs.readFileSync('scripts/common-words.txt','utf8').split(/\s+/).map(normalize).filter(w=>w.length===5),...fs.readFileSync('scripts/familiar-short.txt','utf8').split(/\s+/).map(normalize)]);
const words = new Set();
for (const line of fs.readFileSync('scripts/source-headwords.txt','utf8').split('\n')) {
  const raw = line.split(/\s/)[0];
  const word = normalize(raw);
  if (!/^[A-ZÇĞİÖŞÜ]{3,5}$/.test(word) || blocked.has(word)) continue;
  if (/P:(Verb|Punc|Dup|Abbr|Unknown)/.test(line)) continue;
  if (/(mak|mek)$/.test(raw) && !/P:Noun/.test(line)) continue;
  words.add(word);
}
const all = [...words].sort((a,b)=>a.localeCompare(b,'tr'));
const everyday = all.filter(w=>common.has(w));
fs.writeFileSync('dist/lexicon.js',`// Derived from Zemberek master-dictionary.dict (Apache-2.0). See THIRD_PARTY.md.\nexport const WORDS = ${JSON.stringify(all)};\nexport const COMMON = ${JSON.stringify(everyday)};\nexport const DICTIONARY_VERSION = '2026-10-30.1';\n`);
console.log(JSON.stringify({accepted:all.length,everyday:everyday.length,byLength:Object.fromEntries([3,4,5].map(n=>[n,{all:all.filter(w=>w.length===n).length,common:everyday.filter(w=>w.length===n).length}]))},null,2));
