# KEK · Bir harf, bin ihtimal

Türkçe kelime zinciri oyunu. Her hamlede yalnızca bir harf değişir. Harf eklenmez, silinmez veya taşınmaz. Başlangıç kelimesi dahil, aynı turda kelime tekrarı yasaktır.

## Oyna

Özel oyun bağlantısı: https://kek-kelime-oyunu.gokhan-agingil.chatgpt.site

Yayın, Site sahibinin ChatGPT hesabına özeldir. İnternetten arkadaş daveti veya farklı cihazlar arasında eşleşme bu sürümde yoktur. Düello aynı cihazda sırayla oynanır.

## Modlar

- **Sakin akış:** Süresiz en uzun zincir. Her hamleden sonra bu tarayıcıya kaydedilir; yeniden açınca devam edilebilir.
- **Zamana karşı:** 120 saniye. Her geçerli yeni kelime 1 puan. Gerçek çıkmazda yeni bir başlangıç açılır, toplam süre ve kullanılmış kelimeler korunur. Mola süreci durdurur; arka plan sekmesine geçmek durdurmaz.
- **Düello:** İki isim, iki oyuncu, ortak kelime geçmişi. Her hamleye 30 saniye. Hamlesi kalmayan, süresi dolan veya turu bırakan kaybeder. Her tur başlangıç oyuncusu değişir. İlk 3 turu kazanan maçı kazanır.

3, 4 ve 5 harf desteklenir. Başlangıçlar, yaygın kelimeler üzerinden en az 12 hamle (3–4 harf) veya 8 hamle (5 harf) içeren bir yol bulunarak seçilir. Bu, oyuncunun her seçiminin aynı uzunluğu sağlayacağını garanti etmez. İlk başlangıçta tek hamlelik çıkmazlara açılan kelimeler seçilmez.

## Kelime politikası

- Kesin bir oyun sözlüğüne eşitlik kontrolü yapılır; üretken ekleme/morfolojik türetme uygulanmaz.
- `EVE`, `EVİ`, `EVDE`, `EVDEN`, `EVİN`, `EVLER` gibi çekimler kabul edilmez. `GEL`, `GİT` gibi yalın emir biçimleri sözlüğe otomatik eklenmez.
- `DOLMA`, `GELİR`, `GİDER`, `YAZAR`, `YEMEK`, `KAPI`, `YAZI` gibi bağımsız isim anlamı olan maddeler kabul edilir. Yapım ekiyle oluşmuş bağımsız kelime ile çekimli biçim aynı şey değildir.
- Özel isim ve kısaltma sözlükleri içeri alınmaz. `DENİZ` gibi aynı zamanda cins isim olan kelimeler isim anlamıyla geçer.
- Türkçe yerel büyük harf dönüşümü kullanılır: `i → İ`, `ı → I`. `O/Ö`, `U/Ü`, `I/İ` farklı harflerdir. Düzeltme işareti sadeleştirilir: `â → A`, `î → İ`, `û → U`.
- Veri, Zemberek'in Apache 2.0 lisanslı ana sözlüğünden filtrelenmiştir. Tüm Türkçeyi kapsamaz; her maddenin dilbilimci tarafından tek tek denetlendiği iddia edilmez. Sözlük düzeltmeleri `scripts/build-dictionary.mjs` üzerinden sürümlenir. Başlangıç/ipuçlarında daha tanıdık kelimeler önceliklidir.
- İpucu kullanılan oyunlar ayrı rekor kategorisinde saklanır. Online liderlik tablosu veya hileye dayanıklı sunucu doğrulaması yoktur.

## Çalıştır

Bağımlılık kurulumu ve API anahtarı gerekmez. Node.js 24 ile:

```sh
npm run build
npm test
npm run analyze
python3 -m http.server 8080 --directory dist
```

Tarayıcıda `http://localhost:8080` açılır. ES modülleri nedeniyle `index.html` dosyasını `file://` ile açmayın.

## Kontroller

Harf kutusunu seçip ekran klavyesine dokunun. Fiziksel klavyede oklar konumu değiştirir, harf tuşları seçili konumu değiştirir, Enter gönderir, Backspace geri alır. “Kelimeyi yazarak gir” erişilebilir normal metin alanını açar. Ses varsayılan kapalıdır. Hareket azaltma tercihi desteklenir.

Kayıtlar `localStorage` içinde bu cihaz/tarayıcıya özeldir. Tarayıcı verilerini silmek kayıtları siler. Ses Web Audio ile yerel olarak üretilir. Oyun içinde üçüncü taraf API, reklam, analitik veya harici font isteği yoktur. Barındırma hizmetinin kendi erişim mekanizması ayrıdır.

## Mimari ve doğrulama

- `dist/engine.js`: DOM'dan bağımsız oyun kuralları, kelime grafiği, saat, tur ve kayıt doğrulama.
- `dist/app.js`: ekranlar, klavye, ses, diyaloglar, rekorlar ve oturum kaydı.
- `dist/lexicon.js`: tekrarlanabilir derleme çıktısı.
- `scripts/`: lisanslı kaynak kesiti, başlangıç/ipuçları kelime seçkileri, derleme ve oyun analizi.
- `test/engine.test.mjs`: 17 test; bunların içinde 120 simüle oyunun kuralları da kontrol edilir.
- `docs/graph-analysis.json`: ayrıca 300 deterministik otomatik oyun denemesi. İnsan kullanıcı testi değildir; hamle sayıları teorik en uzun yol veya garanti değildir.
- `docs/QA.md`: tarayıcıda doğrulanan akışlar ve bilinen sınırlar.

Statik dosyalar `dist/` dizinidir. Herhangi bir statik barındırma sistemiyle sunulabilir. Sites kimliği `.openai/hosting.json` içindedir; erişim anahtarı değildir. Yeniden yayınlamada aynı kimlik korunmalıdır.

## Üçüncü taraf verisi

Kaynak, sürüm ve lisans notları için [THIRD_PARTY.md](THIRD_PARTY.md), [ZEMBEREK-LICENSE.txt](ZEMBEREK-LICENSE.txt) ve [APACHE-2.0.txt](APACHE-2.0.txt).
