import type { Locale } from './i18n'

export const experienceSources = {
  mycelium: { label: 'ANBG · The mycelium', href: 'https://www.anbg.gov.au/fungi/mycelium.html' },
  spores: { label: 'ANBG · Spore release and dispersal', href: 'https://www.anbg.gov.au/fungi/dispersal.html' },
  pores: { label: 'ANBG · Boletes & polypores', href: 'https://www.anbg.gov.au/fungi/types-boletes.html' },
  gills: { label: 'ANBG · Types of fungal fruiting bodies', href: 'https://www.anbg.gov.au/fungi/types-of-fungi.html' },
  surfaces: { label: 'ANBG · Stereoid & paint fungi', href: 'https://www.anbg.gov.au/fungi/types-stereoid-paint.html' },
} as const

type ExperienceCopy = {
  illustration: string; source: string; closer: string; close: string; original: string; methods: string; loupeHelp: string
  xray: { label: string; heading: string; lead: string; surface: string; below: string; slider: string; output: string; art: string; description: string; stories: { id: string; title: string; text: string; source: 'mycelium' | 'spores' }[] }
  atlas: { label: string; heading: string; lead: string; caution: string; cards: { id: 'pores' | 'gills' | 'surfaces'; title: string; short: string; detail: string; source: 'pores' | 'gills' | 'surfaces' }[] }
  time: { label: string; heading: string; lead: string; slider: string; scenario: string; method: string; stages: { title: string; phrase: string; text: string; source: string }[]; sources: string }
}

export const experienceCopy: Record<Locale, ExperienceCopy> = {
  lv: {
    illustration: 'Mākslinieciski izpētes attēli', source: 'Lasīt avotu', closer: 'Aplūkot tuvāk', close: 'Aizvērt tuvplānu', original: 'Oriģinālais attēls', methods: 'Par attēliem un metodi', loupeHelp: 'Pārvieto lupu ar peli vai pirkstu. Ar tastatūru izmanto bulttaustiņus; Home atgriež centru.',
    xray: {
      label: 'Zem mizas', heading: 'Redzamais ir tikai sākums.',
      lead: 'Virsma paslēpj daļu no stāsta. Iztēlots šķēlums aicina domāt par sēņotni, ko šis meža attēls nevar parādīt.',
      surface: 'Mizas virsma', below: 'Ilustratīvs šķēlums', slider: 'Atseguma robeža', output: 'ilustrācijas atsegti',
      art: 'Mizas un sēņotnes attēli veidoti kā mākslinieciska rekonstrukcija, nevis rentgens vai mikroskopijas novērojums. Pavedienu krāsa un izvietojums nav izmērīti un neder sugas noteikšanai.', description: 'Mizas virsmas un iztēlota koksnes šķēluma salīdzinājums: sīki gaiši sēņotnes pavedieni sazarojas koksnē zem mizas.',
      stories: [
        { id: 'wood', title: 'Koksne ir dzīves telpa', text: 'Koksni noārdošas sēnes sēņotne var augt koksnē arī tad, kad augļķermeni neredzam. Koksne šeit ir substrāts — vide un vielu avots sēnei.', source: 'mycelium' },
        { id: 'hyphae', title: 'Pavedieni, kas pārveido', text: 'Hifas sazarojas un izdala fermentus apkārtējā vidē. Sašķeltās vielas sēne uzņem; koksnes noārdīšana ir daļa no vielu aprites. Tas nenozīmē, ka visas sēnes noārda koksni vai veido mikorizu.', source: 'mycelium' },
        { id: 'spores', title: 'Augļķermenis un ceļš tālāk', text: 'Piepe ir augļķermenis. Daudzām piepēm sporas veidojas poru stobriņu iekšpusē, nevis katrā koksnē esošajā hifā. Pēc atbrīvošanās gaisa plūsmas var tās aiznest tālāk; jaunas sēņotnes attīstībai vajadzīgi piemēroti apstākļi.', source: 'spores' },
      ],
    },
    atlas: {
      label: 'Pazīmju atlants', heading: 'Augļķermeņa pazīmju atlants.',
      lead: 'Poras, lapiņas un joslota augšpuse — trīs atšķirīgi skatieni uz augļķermeņa uzbūvi. Izpēti virsmu ar lupu vai atver pilna izmēra attēlu salīdzinājumu.',
      caution: 'Šis ir vērošanas ceļvedis, nevis sugas noteikšanas instruments. Pazīmes jāvērtē kopā ar augšanas vietu un citām īpašībām; trīs attēli neaptver visu sēņu daudzveidību.',
      cards: [
        { id: 'pores', title: 'Poras', short: 'Atveres sīkos stobriņos.', detail: 'Poras ir atveres stobriņos, kuru iekšpusē ir sporas veidojošā virsma. Dažām piepēm atveres ir viegli saskatāmas, citām nepieciešama lupa. Attēlā redzamās atveres nav kalibrēts vienas sugas poru mērījums.', source: 'pores' },
        { id: 'gills', title: 'Lapiņas', short: 'Plānas plātnītes zem cepurītes.', detail: 'Lapiņu sānu virsmas nes sporas veidojošo slāni. Arī uz koksnes var augt sēnes ar lapiņainiem augļķermeņiem; plaukta forma pati par sevi nepierāda porainu apakšpusi.', source: 'gills' },
        { id: 'surfaces', title: 'Augšanas joslas', short: 'Koncentriskas krāsu joslas un smalka augšpuses tekstūra.', detail: 'Koncentriskās joslas un smalkās krokas atklāj krāsas un virsmas maiņu augļķermeņa augšpusē. Tās palīdz raksturot atradumu, taču vienas pašas nenosaka sugu vai vecumu. Sporas veidojošā apakšpuse jāaplūko atsevišķi.', source: 'surfaces' },
      ],
    },
    time: {
      label: 'Kritalas laika kapsula', heading: 'Dzīve nepazūd. Tā maina formu.',
      lead: 'Četri skatieni uz atmirstošu koksni — no svaiga stumbra līdz pārmaiņām, kas kļūst par daļu no meža turpinājuma.',
      slider: 'Pāreja starp ekoloģiskajiem posmiem', scenario: 'Māksliniecisks noārdīšanās posmu salīdzinājums, nevis viena koka laika dokumentācija.', method: 'Posmi var pārklāties. Pārmaiņu ātrumu ietekmē koka suga, izmērs, mitrums, klimats un novietojums; arī vēlākajos posmos daļa koksnes var saglabāties. Šie četri attēli rāda ekoloģisku scenāriju, nevis izmērītu kalendāru.',
      sources: 'Zinātniskais konteksts: atmirušās koksnes biotopi un noārdīšanās procesi.',
      stages: [
        { title: 'Nesen kritis', phrase: 'Mežā parādās jauna telpa.', text: 'Stumbrs vēl saglabā lielu daļu savas uzbūves. Atmirušā koksnē sākas vai turpinās sēņu un citu organismu darbība; sēnes tajā var būt bijušas jau pirms koka nokrišanas.', source: '#source-deadwoodHabitats' },
        { title: 'Agrīna noārdīšanās', phrase: 'Virsma sāk atvērties.', text: 'Miza un koksne mainās, rodas atšķirīgi mitruma un patvēruma apstākļi. Sēņu darbība pārveido koksnes vielas; augļķermeņu parādīšanās nav piesaistīta vienam noteiktam gadam.', source: '#source-deadwoodHabitats' },
        { title: 'Attīstīta trupe', phrase: 'Viens stumbrs, daudzas dzīvesvietas.', text: 'Daļa koksnes kļūst mīkstāka, veidojas plaisas un dobumi. Atšķirīgām sugām piemērotas dažādas sadalīšanās stadijas; baltās un brūnās trupes procesi nav viens un tas pats.', source: '#source-decay' },
        { title: 'Aprites turpinājums', phrase: 'Robeža ar augsni kļūst klusāka.', text: 'Sadalījusies koksne un tajā dzīvojošie organismi piedalās vielu apritē. Tā var veidot piemērotus apstākļus citai dzīvībai, tomēr no katras kritalas neizaug jauns koks un noārdīšanās nenotiek vienā universālā termiņā.', source: '#source-deadwoodHabitats' },
      ],
    },
  },
  en: {
    illustration: 'Artistic study images', source: 'Read the source', closer: 'Look closer', close: 'Close the closer view', original: 'Original image', methods: 'Images and method', loupeHelp: 'Move the loupe with the pointer or a finger. Use arrow keys on a keyboard; Home returns to the centre.',
    xray: {
      label: 'Beneath the bark', heading: 'What we see is a beginning.',
      lead: 'The surface hides part of the story. This imagined cross-section makes room to think about mycelium that the forest image cannot show.',
      surface: 'Bark surface', below: 'Illustrative cross-section', slider: 'Reveal boundary', output: 'of the illustration revealed',
      art: 'The bark and mycelium images are artistic reconstructions, not X-rays or microscopic observations. The colour and arrangement of the strands are not measured and cannot identify a species.', description: 'A comparison of bark and an imagined wood cross-section: fine, pale mycelial strands branch through the wood beneath the bark.',
      stories: [
        { id: 'wood', title: 'Wood is a place to live', text: 'The mycelium of a wood-decaying fungus can grow inside wood when no fruiting body is visible. Here, wood is its substrate: an environment and a source of resources.', source: 'mycelium' },
        { id: 'hyphae', title: 'Threads that transform', text: 'Hyphae branch and release enzymes into their surroundings. The fungus absorbs the simpler compounds; wood decay contributes to wider cycles. This does not mean that all fungi decay wood or form mycorrhizas.', source: 'mycelium' },
        { id: 'spores', title: 'A fruiting body, a way onward', text: 'A bracket is a fruiting body. In many brackets, spores form along the inner surfaces of pore tubes, not in every hypha within the wood. Air currents can carry released spores away; new mycelium needs suitable conditions to develop.', source: 'spores' },
      ],
    },
    atlas: {
      label: 'A fruiting-body atlas', heading: 'An atlas of fruiting-body features.',
      lead: 'Pores, gills and a banded upper surface: three views of fruiting-body structure. Explore a surface with the loupe, or open the full-size comparison.',
      caution: 'This is an observation guide, not a species identification tool. Features must be considered alongside the growing site and other characteristics; three images cannot encompass fungal diversity.',
      cards: [
        { id: 'pores', title: 'Pores', short: 'Openings into tiny tubes.', detail: 'Pores open into tubes with spore-producing inner surfaces. Some are readily visible; others need a hand lens. The openings shown are not calibrated measurements of one species’ pores.', source: 'pores' },
        { id: 'gills', title: 'Gills', short: 'Thin plates beneath a cap.', detail: 'The sides of the gills carry the spore-producing layer. Gilled fruiting bodies can also grow on wood; a shelf shape does not establish a pored underside.', source: 'gills' },
        { id: 'surfaces', title: 'Growth bands', short: 'Concentric colour bands and fine upper-surface texture.', detail: 'Concentric bands and fine ridges show changes in colour and texture across the upper surface. They help describe a fruiting body, but cannot establish its species or age on their own. The spore-bearing underside must be examined separately.', source: 'surfaces' },
      ],
    },
    time: {
      label: 'The deadwood time capsule', heading: 'Life changes its shape.',
      lead: 'Four ways to look at dead wood, from a newly fallen trunk to changes that become part of the forest’s continuation.',
      slider: 'Explore the ecological stages', scenario: 'An artistic comparison of decay stages, not a time-lapse of one tree.', method: 'Stages can overlap. Tree species, size, moisture, climate and position affect the rate; some wood can remain even in later stages. The four images illustrate an ecological scenario, not a measured calendar.',
      sources: 'Scientific context: deadwood habitats and decay processes.',
      stages: [
        { title: 'Newly fallen', phrase: 'A new space enters the forest.', text: 'The trunk retains much of its structure. The activity of fungi and other organisms begins or continues in dead wood; fungi may already have been present before the tree fell.', source: '#source-deadwoodHabitats' },
        { title: 'Early decay', phrase: 'The surface begins to open.', text: 'Bark and wood change, providing different conditions for moisture and shelter. Fungal activity transforms the wood’s substances; fruiting bodies do not appear on a fixed yearly schedule.', source: '#source-deadwoodHabitats' },
        { title: 'Advanced decay', phrase: 'One trunk, many habitats.', text: 'Some wood softens, with cracks and hollows developing. Different species suit different stages of decay; white rot and brown rot are distinct processes.', source: '#source-decay' },
        { title: 'Cycles continue', phrase: 'The edge of the soil grows quieter.', text: 'Decayed wood and its organisms contribute to nutrient cycling. They can provide conditions for other life, but not every log grows a new tree and there is no universal deadline for decomposition.', source: '#source-deadwoodHabitats' },
      ],
    },
  },
}
