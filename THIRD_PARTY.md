# Zemberek dictionary attribution

Copyright 2018 Ahmet A. Akın, Mehmet D. Akın.

Source project: https://github.com/ahmetaa/zemberek-nlp

Source path: `morphology/src/main/resources/tr/master-dictionary.dict`

Source Git blob SHA: `60367e838c506d8b43a77cf69c2fba0111bb7221`.

Retrieved: 2026-10-30. License: Apache License 2.0; original notice is in `ZEMBEREK-LICENSE.txt`, complete license in `APACHE-2.0.txt`.

Additional source path: `morphology/src/main/resources/tr/non-tdk.dict`.

Additional source Git blob SHA: `7cfb69fd9174fee8266e85db5d02234d8b3be78e`. Retrieved: 2026-10-30. The 44 selected source lines are retained in `scripts/source-supplement.txt` under the same Apache 2.0 license. The full source is not imported because it also contains variant spellings and entries outside the game's policy.

Modifications: extracted 3–5 character headword lines into `scripts/source-headwords.txt`; filtered punctuation, reduplication-only entries and excluded entries; deduplicated; converted to Turkish uppercase; normalized circumflex vowels; compiled to a JavaScript word array. In v1.1, listed infinitive headwords are included and the erroneous ending-based exclusion of AHMAK is removed. No inflected surface forms were generated. A separate preferred-word list changes only opening/hint preference, not the legal set. KEK is not an official TDK or Zemberek product.

The independently prepared KEK additions in `scripts/editorial-headwords.tsv` include original short sense notes for review; they are not copied definitions from a third-party dictionary. See `docs/dictionary-policy.md` for the policy and limitations.

The original source excerpts are retained to make this transformation reproducible. The Zemberek source headword data does not include definitions. Content corrections update the selected source/editorial files and regression tests, then increment `DICTIONARY_VERSION`. Known compatible versions are restored only by replaying their moves; unknown or incompatible saved sessions are not loaded.
