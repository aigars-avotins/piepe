export const observations = [
  {
    id: 'surface', label: 'Surface', title: 'A small shelf.\nAnother world.',
    text: 'A pale edge catches the morning light. Below it, another. And another. What looked like a detail in the bark becomes a place to linger.',
    footnote: 'Begin with what is in front of you.',
  },
  {
    id: 'beneath', label: 'Beneath', title: 'The visible part\nis not the whole.',
    text: 'We give a thing a name and think we have understood it. But a surface can also be a threshold. Imagine the patient work beyond it: small connections, quiet changes, a beginning you never saw.',
    footnote: 'An imagined map of attention, not a species diagram.',
  },
  {
    id: 'beyond', label: 'Beyond', title: 'Take a different\nway of looking.',
    text: 'On your way back, choose one ordinary thing. The grain of a table. A crack in a wall. A familiar tree. Stop for a moment. You do not need to find something rare. Look again at what was already there.',
    footnote: 'A field note to carry out of the forest.',
  },
] as const

// Trace from the supplied 1920×1080 end frame, not an invented organism.
export const shelfEdges = 'M1008 413 C1080 387 1192 433 1367 394 M941 531 C1035 493 1135 568 1251 536 M1258 476 C1360 465 1444 492 1536 457 M943 642 C1056 615 1148 701 1437 678 M1004 748 C1110 785 1250 819 1395 773'
