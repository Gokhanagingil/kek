# KEK validation · 2026-10-30

## Automated

- `npm test`: 21 passing tests, including 120 complete/bounded simulated games.
- `npm run build`: deterministic headword filtering; no generated case/possessive/plural forms.
- `npm run analyze`: 300 seeded random games across 3/4/5-letter configurations, with results in `graph-analysis.json`. These are computer simulations, not human playtesting or retention evidence.
- Turkish case mapping, decomposed Unicode, circumflex normalization, exact one-letter replacement, shared used-word set, and the 19-move KEK→SAL example.
- Rejected inputs do not change turns, scores or deadlines. Deadline-boundary submissions lose to expiry. A terminal result cannot award a second point.
- 120-second absolute clock; 30-second per-turn clock; pause/resume; solo hints separated; duel hints and pause disabled.
- All selected starts have a verified continuation; duel initial moves cannot terminate immediately.
- Real dead ends finish calm/duel and reseed rush without reusing words or resetting time.
- Calm save restored by replay; unknown versions/illegal moves rejected; v1.0 additive-compatible saves replay and migrate to v1.1.

## Browser checks

Chrome desktop and responsive iframe viewports of 390 px and 320 px. These check browser rendering, not physical iOS/Android hardware.

- Home screen, three mode selections, letter-count selectors, explanatory rules and local record UI.
- KEK→ÇEK→ÇOK by tapping tiles and Turkish keyboard; return to ÇEK correctly rejected as used.
- Mobile saved session resumes at ÇOK with two moves; hint marks assisted play.
- Duel player names and active-player change after valid move.
- Five-round concession match finishes at 2:3; starting player alternates; result offers a rematch instead of another round.
- Five-letter rush: YATAK→YASAK accepted through text input; timer holds at 1:51 while paused and resumes; finishing records one point and shows unused continuations.
- A narrow 320 px demonstration row initially clipped; corrected with flexible tile widths.
- Exact searches for EVE and EVİ report no match. EVIÇ/EVİYE prefix results do not make EVİ valid.
- 320 px iframe body reports equal `clientWidth` and `scrollWidth` after the fix (305 px usable width with scrollbar).

## Limits and next validation

- Human enjoyment, fairness across vocabulary skill levels, real-device keyboards, VoiceOver/TalkBack and long-term engagement still require pilot play.
- The word list is an NLP headword source with explicit filtering, not an independently reviewed complete contemporary Turkish dictionary. Some uncommon/regional terms remain legal. The browser dictionary search makes the accepted set visible outside active games.
- Local, same-device two-player mode only; no network rooms, account synchronization or online rankings.
- The hosted Site starts owner-private. The source repository is the user's existing public repository; this does not make the hosted game's audience public.

## v1.1 dictionary regression checks

- 283 additions, zero removals; 7,564 total entries (739 / 1,942 / 4,883 by length).
- AHMAK suffix-filter fix; ordinary derivations such as KAZMA, İŞSİZ, SÜTÇÜ and YAĞIŞ; licensed supplemental headwords such as CÜPPE, ÖĞE and BLOG.
- Listed infinitives accepted, while explicit possessive, case and conjugated examples remain rejected.
- Real five-move chain YAZMA → KAZMA → KAYMA → KALMA → DALMA → DALGA; returning to DALMA rejected.
- Previous dictionary-version save replays to the correct word and score; illegal histories and unknown versions still rejected.
- The new editorial additions have original brief sense notes for future review. They are not claimed to be an exhaustive or professionally audited TDK dataset.

Browser follow-up (Chrome, v1.1): dictionary shows 7,564 entries; exact searches accept KAZMA, AHMAK, SÜTÇÜ, YAĞIŞ, CÜPPE and ALMAK; EVİ, EVE, KEKİ and GELDİ have no exact match. An actual existing v1.0 calm session resumes at ÇOK with two moves. The screenshot is `dictionary-v1.1.jpg`.
