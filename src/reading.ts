import type { Locale } from './i18n'

export const readingSources = [
  { id: 'anbg', name: 'Australian National Botanic Gardens', title: 'What is a fungus?', url: 'https://www.anbg.gov.au/fungi/what-is-fungus.html' },
  { id: 'woodland', name: 'Woodland Trust', title: 'Bracket fungi identification', url: 'https://www.woodlandtrust.org.uk/blog/bracket-fungi-identification/' },
  { id: 'ucipm', name: 'University of California IPM', title: 'Wood Decay Fungi in Landscape Trees', url: 'https://ipm.ucanr.edu/home-and-landscape/wood-decay-fungi-in-landscape-trees/' },
] as const

type Section = { id: string; heading: string; paragraphs: string[]; sources: (typeof readingSources[number]['id'])[] }
type Reading = {
  title: string; description: string; heading: string; label: string; lead: string; topic: string
  sections: Section[]; noticeHeading: string; observations: string[]; identification: string
  artNote: string; sourceHeading: string; sourceNote: string; returnLabel: string; returnThought: string; imageAlt: string
}

export const readings: Record<Locale, Reading> = {
  lv: {
    title: 'Kas ir piepe? Piepes, poras un sēņotne | PIE.PE',
    description: 'Kas ir piepe, kā aug sēņotne un kam vajadzīgas poras? Īss, avotos balstīts skaidrojums par piepēm uz dzīviem un nokaltušiem kokiem.',
    heading: 'Kas ir piepe?', label: 'Meža lasījums', topic: 'Piepes',
    lead: 'Piepe ir sēnes redzamais augļķermenis, ko bieži pamana uz stumbra, zara vai kritalas plaukta vai pakava formā. Tas ir tikai daļa no sēnes: koksnē var augt sēņotne — mikroskopisku pavedienu tīkls. Ar vārdu “piepe” apzīmē dažādu sēņu augļķermeņus, nevis vienu sugu.',
    sections: [
      { id: 'senotne', heading: 'Kas ir sēņotne?', paragraphs: [
        'Sēņotni veido sīki pavedieni — hifas. Tās aug, sazarojas un uzņem barības vielas. Uz mizas redzamā piepe ir augļķermenis, kurā veidojas sporas; tā neatklāj visu koksnē esošo sēņotni.',
        'Vienai sēņotnei var būt vairāki augļķermeņi. Arī laikā, kad piepe nav redzama, sēne var turpināt augt savā substrātā.',
      ], sources: ['anbg'] },
      { id: 'augsana', heading: 'Kā piepes aug?', paragraphs: [
        'Koksni noārdošu sēņu hifas izdala fermentus, kas sašķeļ sarežģītas organiskās vielas mazākās, uzņemamās molekulās. Piemērotos apstākļos sēņotne izveido augļķermeņus.',
        'Daži augļķermeņi saglabājas vienu sezonu, citi ir daudzgadīgi un pieaug, veidojot jaunas kārtas. Pēc piepes izmēra vien nevar noteikt ne sēņotnes apjomu, ne to, cik ilgi sēne dzīvo koksnē.',
      ], sources: ['anbg', 'ucipm'] },
      { id: 'poras', heading: 'Kam vajadzīgas poras un sporas?', paragraphs: [
        'Daudzām piepēm apakšpusē redzamas poras — atveres sīkos stobriņos. Sporas veidojas uz stobriņu iekšējām virsmām un izkļūst caur šīm atverēm. Gaisa plūsmas tās var aiznest tālāk; piemērotā vietā no sporas var sākties jaunas sēņotnes attīstība.',
        'Tomēr ne visiem plauktveidīgiem augļķermeņiem ir poras. Apakšpusē var būt arī lapiņas vai gludāka virsma. Tāpēc ir vērts paskatīties ne tikai uz piepes augšpusi.',
      ], sources: ['anbg', 'ucipm'] },
      { id: 'koki', heading: 'Ko piepes dara kokiem?', paragraphs: [
        'Daudzas koksni noārdošas sēnes izmanto atmirušu koksni. Citas sastopamas arī dzīvos kokos: tās var noārdīt stumbra vai sakņu koksni un mazināt tās izturību. Dzīvā kokā ir arī nedzīvi audi, tādēļ “aug uz dzīva koka” vēl neizskaidro visu sēnes un koka attiecību.',
        'Augļķermenis var liecināt par iekšēju trupi, bet neatklāj tās pilnu apjomu. Par koka drošību nevar spriest pēc vienas piepes vai fotogrāfijas; šādu novērtējumu veic kvalificēts arborists.',
      ], sources: ['ucipm'] },
      { id: 'meza-loma', heading: 'Kāpēc koksnes noārdīšana ir svarīga?', paragraphs: [
        'Mežā kritala nav tikai koka dzīves beigas. Sēnes noārda tajā esošās vielas, piedaloties barības vielu apritē. Trūdoša koksne un dobumi savukārt kļūst par dzīvesvietu citiem organismiem.',
        'Viena un tā pati noārdīšanās meža ekosistēmā var būt nepieciešama, bet atsevišķam kokam — mazināt koksnes stiprību. Sēnes lomu palīdz saprast tās augšanas vieta un konkrētā situācija.',
      ], sources: ['anbg', 'ucipm'] },
    ],
    noticeHeading: 'Ko pamanīt mežā?',
    observations: [
      'Uz kā tā aug: dzīva stumbra, nokaltuša zara, celma vai kritalas?',
      'Kāda ir apakšpuse: poraina, lapiņaina vai gludāka?',
      'Kāda ir mala, virsma un augļķermeņu izvietojums — viens vai vairāki blakus?',
    ],
    identification: 'Šādi vērojumi palīdz aprakstīt atradumu. Viena forma vai krāsa sugu nepierāda: noteikšanā salīdzina vairākas pazīmes un augšanas apstākļus. Ar vienu attēlu ne vienmēr pietiek. Šis lasījums ir ievads vērošanā, nevis sugu noteicējs.',
    artNote: 'PIE.PE kinematogrāfiskais mežs ir mākslīgā intelekta radīta mākslinieciska interpretācija. Tā attēli un filmas nav sugu noteikšanas pierādījumi un nedokumentē konkrētu vietu.',
    sourceHeading: 'Avoti tālākai lasīšanai', sourceNote: 'Skaidrojums balstīts šajos botānikas, koku patoloģijas un dabas aizsardzības avotos. Tajos minētos reģionālos sugu piemērus nevajadzētu automātiski attiecināt uz Latviju.',
    returnLabel: 'Atgriezties dzīvajā mežā', returnThought: 'Paskaties vēlreiz uz to, kas jau bija tepat.',
    imageAlt: 'PIE.PE mākslīgā intelekta radīta meža interpretācija ar piepēm uz koka',
  },
  en: {
    title: 'What is a bracket fungus? Pores and mycelium | PIE.PE',
    description: 'What is a bracket fungus, how does mycelium grow, and what are pores for? A concise, sourced guide to shelf fungi on living and dead trees.',
    heading: 'What is a bracket fungus?', label: 'A forest reading', topic: 'Bracket fungi',
    lead: 'A bracket fungus, also called a shelf fungus, is usually noticed as a fruiting body projecting from a tree or fallen wood. The bracket is only part of the fungus: its mycelium can grow through the wood. The name covers many different fungi, not a single species.',
    sections: [
      { id: 'mycelium', heading: 'What is mycelium?', paragraphs: [
        'Mycelium is a network of microscopic threads called hyphae. They grow, branch and absorb nutrients. The bracket on the bark is a fruiting body that produces spores; it does not reveal the whole network inside the wood.',
        'One mycelium can produce several fruiting bodies. Even when no bracket is visible, the fungus may still be growing in its substrate.',
      ], sources: ['anbg'] },
      { id: 'growth', heading: 'How do bracket fungi grow?', paragraphs: [
        'The hyphae of wood-decaying fungi release enzymes that break complex organic material into smaller molecules the fungus can absorb. Under suitable conditions, the mycelium produces fruiting bodies.',
        'Some fruiting bodies last a season; others are perennial and add new layers as they grow. A bracket’s size alone does not reveal the extent of its mycelium or how long the fungus has occupied the wood.',
      ], sources: ['anbg', 'ucipm'] },
      { id: 'pores', heading: 'What are pores and spores for?', paragraphs: [
        'Many brackets have pores underneath: openings into tiny tubes. Spores form on the tubes’ inner surfaces and are released through the openings. Air currents can carry them away; in suitable conditions, a spore can begin the development of new mycelium.',
        'Not every shelf-shaped fruiting body has pores. Some have gills or a smoother underside. Looking underneath can tell you more than the upper surface alone.',
      ], sources: ['anbg', 'ucipm'] },
      { id: 'trees', heading: 'On living and dead trees', paragraphs: [
        'Many wood-decaying fungi use dead wood. Others also occur in living trees, where they can decay trunk or root wood and reduce its strength. A living tree contains dead tissues too, so finding a bracket on one does not explain the entire relationship.',
        'A fruiting body may indicate internal decay without showing its full extent. A single bracket or photograph cannot establish whether a tree is safe; that assessment belongs to a qualified arborist.',
      ], sources: ['ucipm'] },
      { id: 'forest-life', heading: 'Why does wood decay matter?', paragraphs: [
        'A fallen trunk is more than the end of a tree. Fungi break down its organic material and take part in nutrient cycling. Decaying wood and the hollows that develop also provide places for other organisms to live.',
        'The same decay can be valuable to a forest ecosystem while reducing the strength of an individual tree. The growing site and circumstances help explain the fungus’s role.',
      ], sources: ['anbg', 'ucipm'] },
    ],
    noticeHeading: 'What to notice in the woods',
    observations: [
      'The substrate: a living trunk, dead branch, stump or fallen log?',
      'The underside: pores, gills or a smoother surface?',
      'The margin, surface and arrangement: a solitary bracket or a group?',
    ],
    identification: 'These observations help describe a find. Shape or colour alone does not establish a species: identification brings together several features and the growing conditions. A single image is not always enough. This reading is an introduction to observation, not a species-identification key.',
    artNote: 'The cinematic PIE.PE forest is an artistic interpretation made with AI-generated imagery. Its pictures and films are not evidence for species identification and do not document a named place.',
    sourceHeading: 'Sources for a closer look', sourceNote: 'This explanation draws on the botanical, tree-pathology and conservation sources below. Their regional species examples should not automatically be applied to other parts of the world.',
    returnLabel: 'Return to the living forest', returnThought: 'Look again at what was already there.',
    imageAlt: 'An AI-generated PIE.PE forest interpretation with bracket fungi on a tree',
  },
}
