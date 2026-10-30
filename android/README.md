# KEK Android

Çevrimdışı Android paketi; uygulama kimliği `com.gokhanagingil.kek`, sürüm `1.1.0` / `11001`.

- Android 8.0 (API 26) veya üzeri; güncel Android System WebView gerekir.
- Web oyunu ve 7.564 kelimelik sözlük APK içindedir. INTERNET, depolama, mikrofon veya konum izni istenmez; giriş ve uzak sunucu gerekmez.
- `dist/` derleme sırasında varlıklara kopyalanır. HTTPS yerel varlık kökeni ES modüllerini ve kalıcı `localStorage` kayıtlarını destekler.
- Tarayıcıdaki ve uygulamadaki rekorlar ayrıdır. Uygulama verilerini temizlemek veya kaldırmak kayıtları siler. Aynı paket kimliği ve imzayla yapılan güncellemeler kayıtları korur.
- Android geri tuşu önce açık pencereyi kapatır; oyundayken ana sayfaya dönüşü sorar; ana sayfadayken uygulamadan çıkışı sorar.
- Durum çubuğu, gezinme alanı ve klavye için kenar boşlukları uygulanır. Döndürme, açık WebView'ı yeniden oluşturmaz. Süreli modların saati arka planda işlemeye devam eder; sakin oyun her hamlede kaydedilir.
- Sonuç kopyalama yerel, yalnızca uygulama kökenine açık bir pano bağlantısı kullanır.

## Derleme

JDK 17, Gradle 8.13, Android SDK 36 / build-tools 36.0.0:

```sh
npm run build
npm test
gradle -p android assembleRelease lintRelease
gradle -p android connectedDebugAndroidTest
```

`Android APK` GitHub Actions iş akışı derler, hizalar, lint ve Android emülatörü testlerini çalıştırır. CI imzasız release APK üretir. Son kullanıcıya verilen APK bunun **özel anahtarla imzalanmış** kopyasıdır; debug APK değildir. İmza anahtarı veya parolası GitHub'a konulmaz. Sonraki APK'lar aynı özel anahtarla imzalanmalı ve `versionCode` artırılmalıdır.

Release APK'da WebView hata ayıklama kapalıdır. Emülatör testleri debug derlemesi üzerinden aynı oyun varlıklarını, çevrimdışı açılışı, kelime kabul/ret kontrolünü, hamleleri, kayıt devamını, geri davranışını, düello sırasını ve pano köprüsünü sınar. Fiziksel telefon testi ayrıca gerekir.
