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
export const fungusOutline = 'M1005 415 C1015 384 1085 391 1145 400 C1220 403 1290 398 1368 391 C1405 391 1398 422 1368 436 L1390 453 C1460 451 1512 438 1538 452 C1564 476 1505 499 1473 507 L1538 527 C1615 525 1663 548 1656 580 C1640 615 1550 639 1490 649 C1480 672 1515 690 1480 728 C1440 764 1350 776 1315 794 L1270 854 C1210 904 1148 904 1115 871 L1100 810 C1058 790 1010 765 1010 742 L970 707 C916 693 902 662 930 638 L934 610 C900 585 897 546 927 531 L960 511 C995 492 1040 487 1075 488 L1078 454 C1043 448 1013 437 1005 415 Z'
export const shelfEdges = 'M1008 413 C1080 387 1192 433 1367 394 M941 531 C1035 493 1135 568 1251 536 M1258 476 C1360 465 1444 492 1536 457 M943 642 C1056 615 1148 701 1437 678 M1004 748 C1110 785 1250 819 1395 773'
