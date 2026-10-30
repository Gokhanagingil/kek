# Zemberek dictionary attribution

Copyright 2018 Ahmet A. Akın, Mehmet D. Akın.

Source project: https://github.com/ahmetaa/zemberek-nlp

Source path: `morphology/src/main/resources/tr/master-dictionary.dict`

Source Git blob SHA: `60367e838c506d8b43a77cf69c2fba0111bb7221`.

Retrieved: 2026-10-30. License: Apache License 2.0; original notice is in `ZEMBEREK-LICENSE.txt`, complete license in `APACHE-2.0.txt`.

Modifications: extracted 3–5 character headword lines into `scripts/source-headwords.txt`; filtered punctuation, verb-only infinitives and excluded entries; deduplicated; converted to Turkish uppercase; normalized circumflex vowels; compiled to a JavaScript word array. No inflected surface forms were generated. A separate preferred-word list changes only opening/hint preference, not the legal set. KEK is not an official TDK or Zemberek product.

The original source excerpt is retained to make this transformation reproducible. The source headword data does not include definitions. Content corrections should update the builder and regression tests, then increment `DICTIONARY_VERSION`; incompatible saved sessions are deliberately not loaded.
