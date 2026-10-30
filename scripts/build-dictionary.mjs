import fs from 'node:fs';
const normalize = s => s.normalize('NFC').toLocaleUpperCase('tr-TR').replaceAll('Â','A').replaceAll('Î','İ').replaceAll('Û','U');
// Exact independent headwords only. Never generate inflections or imperative stems.
// Dictionary infinitives are headwords too; an ending alone is not a rejection rule.
const blocked = new Set(`EVE EVİ EVDE EVDEN EVİN EVLER EVLERİ ADAMI BİRİ KİMİ ÇOĞU TOPU TÜMÜ ÜZERİ ELDEN GELEN GEÇEN ONLAR ÖBÜRÜ YURDU KADARCA ABD ACYO AMCIK AMCI AMINA SİK SİKİŞ SİKME SİKİK SİKİM SİKİL ORUSPU OROSPU PİÇ PEZEV GÖT İBNE İPNE KAHPE KALT SOYKIR`.split(/\s+/));
const common = new Set([...fs.readFileSync('scripts/common-words.txt','utf8').split(/\s+/).map(normalize).filter(w=>w.length===5),...fs.readFileSync('scripts/familiar-short.txt','utf8').split(/\s+/).map(normalize)]);
const words = new Set();
for (const source of ['scripts/source-headwords.txt','scripts/source-supplement.txt']) {
  for (const line of fs.readFileSync(source,'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const raw = line.split(/\s/)[0];
    const word = normalize(raw);
    const tags = (line.match(/\bP:\s*([^;\]]+)/)?.[1] || 'Noun').split(',').map(s=>s.trim());
    if (!/^[ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]{3,5}$/.test(word) || blocked.has(word)) continue;
    if (tags.some(tag=>['Punc','Dup','Abbr','Unknown','Prop'].includes(tag))) continue;
    if (tags.includes('Verb') && !/(mak|mek)$/.test(raw)) continue;
    words.add(word);
  }
}
const editorial = new Set();
for (const [i,line] of fs.readFileSync('scripts/editorial-headwords.tsv','utf8').split('\n').entries()) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [raw,pos,sense,...extra] = line.split('\t');
  const word = normalize(raw);
  if (!/^[ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]{3,5}$/.test(word) || blocked.has(word) || !['isim','sıfat','zarf'].includes(pos) || !sense?.trim() || extra.length || editorial.has(word)) {
    throw new Error(`Geçersiz ek sözlük maddesi: ${i+1}: ${raw}`);
  }
  editorial.add(word);words.add(word);common.add(word);
}
// Familiar additions from the licensed supplement also make useful hints.
for (const word of 'BAYT BLOG CÜPPE ÇITIR EVYE GURME JİP KÜVÖZ ÖĞE ÖNSÖZ ÖZSU SİBER VEGAN REFLÜ'.split(' ')) common.add(word);
const all = [...words].sort((a,b)=>a.localeCompare(b,'tr'));
const everyday = all.filter(w=>common.has(w));
fs.writeFileSync('dist/lexicon.js',`// Zemberek headwords (Apache-2.0), plus KEK editorial additions. See THIRD_PARTY.md.\nexport const WORDS = ${JSON.stringify(all)};\nexport const COMMON = ${JSON.stringify(everyday)};\nexport const DICTIONARY_VERSION = '2026-10-30.2';\n// Additive update: old sessions still require a full legal-move replay.\nexport const COMPATIBLE_DICTIONARY_VERSIONS = ['2026-10-30.1', DICTIONARY_VERSION];\n`);
console.log(JSON.stringify({accepted:all.length,everyday:everyday.length,byLength:Object.fromEntries([3,4,5].map(n=>[n,{all:all.filter(w=>w.length===n).length,common:everyday.filter(w=>w.length===n).length}]))},null,2));
