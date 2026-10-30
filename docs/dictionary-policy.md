# KEK sözlük politikası · v1.1

Oyuncunun girdisi, normalleştirmeden sonra kabul listesindeki **bir maddenin tamamına** eşit olmalıdır. Sonek eşleştirme, kök bulup her çekimi kabul etme veya kelime üretme yapılmaz. Harf sayısı, tek harf değişimi ve tekrar kontrolleri ayrıca uygulanır.

## Bağımsız kelime ve çekim ayrımı

- `EVİ`, `EVE`, `EVDE`, `KEKİ`, `ÇAYI`, `KEDİM`, `GELDİ`, `YAPTI` geçmez.
- `KAZMA`, `SÜTÇÜ`, `İŞSİZ`, `YAĞIŞ`, `ARAMA` gibi kendi sözlük anlamı bulunan türemiş sözcükler geçer. Yapım eki bulunması tek başına ret nedeni değildir.
- Kaynakta madde başı olarak bulunan `ALMAK`, `AÇMAK`, `İÇMEK` gibi mastarlar geçer. Kaynak kelimelerden emir, zaman veya kişi eki almış biçimler türetilmez; `GEL` ve `GİT` otomatik eklenmez.
- `AHMAK` bir sıfattır. Son harflerinin `mak` olması kelimeyi fiil ya da geçersiz yapmaz. v1.0'daki bu fazla geniş filtre kaldırıldı.
- `YAZAR`, `GELİR`, `GİDER`, `DOLMA` gibi eş yazımlı kelimelerin bağımsız anlamı kabul için yeterlidir. Rastgele ekli biçimler bu gerekçeyle kabul edilmez.

## Kaynaklar ve ekleme süreci

1. `scripts/source-headwords.txt`: Zemberek ana sözlüğünün daha önce alınmış 3–5 harfli kesiti.
2. `scripts/source-supplement.txt`: Aynı projenin `non-tdk.dict` dosyasından seçilen 44 satır. Dosyanın tamamı alınmaz; içinde yazım varyantları, kısaltmalar ve özel adlar da bulunur. Seçkide `BLOG`, `BAYT`, `CÜPPE`, `GURME`, `JİP`, `ÖĞE`, `REFLÜ` gibi maddeler vardır.
3. `scripts/editorial-headwords.tsv`: KEK için hazırlanmış ek seçki. Her madde için sözcük türü ve özgün kısa anlam notu tutulur. Bu liste TDK veri tabanının kopyası değildir; resmî TDK doğrulaması veya dilbilimci onayı iddiası taşımaz. Notlar oyuncuya tanım olarak sunulmaz; sonraki incelemeyi kolaylaştırır.

Yeni madde eklerken çekim biçimi mi bağımsız kelime mi olduğu kontrol edilir, gerekçesi ek seçkiye yazılır ve örnek bir kabul/ret regresyonu eklenir. Bilinmeyen sözcükler için sözlüğün tam olduğu varsayılmaz. Otomatik morfoloji çıktısı, yazım denetleyicisinin kabul ettiği her biçim veya filtrelenmemiş metin derlemi oyun sözlüğüne katılmaz.

## Güncelleme

Sözlük sürümü `2026-10-30.2`, oyun sürümü `1.1.0`. Kabul listesi 7.281'den 7.564 maddeye çıktı: 3 harfte +5, 4 harfte +51, 5 harfte +227. Hiçbir önceki madde çıkarılmadı. Tam fark `dictionary-update.json` içindedir.

Önceki sözlük sürümündeki süresiz oyunlar, bütün hamleleri yeniden doğrulanarak yüklenir. Kayıtta yazan puan güvenilir sayılmaz; yeniden hesaplanır. Bilinmeyen sürümler ve geçersiz zincirler yüklenmez. Yerel rekorlar korunur; yeni kelime seçenekleri önceki oyunlara göre zincir imkânlarını değiştirebilir.

Bu çalışma kullanıcının bildirdiği genel eksikliklere yöneliktir. Reddedilen somut örnekler henüz paylaşılmadığı için o örneklerin tamamının giderildiği iddia edilmez.
