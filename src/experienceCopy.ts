import type { Locale } from './i18n'

export const experienceSources = {
  mycelium: { label: 'ANBG · The mycelium', href: 'https://www.anbg.gov.au/fungi/mycelium.html' },
  spores: { label: 'ANBG · Spore release and dispersal', href: 'https://www.anbg.gov.au/fungi/dispersal.html' },
  pores: { label: 'ANBG · Boletes & polypores', href: 'https://www.anbg.gov.au/fungi/types-boletes.html' },
  gills: { label: 'ANBG · Types of fungal fruiting bodies', href: 'https://www.anbg.gov.au/fungi/types-of-fungi.html' },
  surfaces: { label: 'ANBG · Stereoid & paint fungi', href: 'https://www.anbg.gov.au/fungi/types-stereoid-paint.html' },
} as const

type ExperienceCopy = {
  illustration: string; source: string; closer: string; close: string
  xray: { label: string; heading: string; lead: string; surface: string; below: string; slider: string; output: string; art: string; stories: { id: string; title: string; text: string; source: 'mycelium' | 'spores' }[] }
  atlas: { label: string; heading: string; lead: string; caution: string; cards: { id: 'pores' | 'gills' | 'surfaces'; title: string; short: string; detail: string; source: 'pores' | 'gills' | 'surfaces' }[]; smooth: string; teeth: string }
  time: { label: string; heading: string; lead: string; slider: string; scenario: string; stages: { title: string; phrase: string; text: string; source: string }[]; sources: string }
}

export const experienceCopy: Record<Locale, ExperienceCopy> = {
  lv: {
    illustration: 'Shematiska ilustrācija · nav sugas attēls vai mēroga mērījums', source: 'Lasīt avotu', closer: 'Aplūkot tuvāk', close: 'Aizvērt tuvplānu',
    xray: {
      label: 'Zem mizas', heading: 'Redzamais ir tikai sākums.',
      lead: 'Virsma paslēpj daļu no stāsta. Iztēlots šķēlums aicina domāt par sēņotni, ko šis meža attēls nevar parādīt.',
      surface: 'Mizas virsma', below: 'Ilustratīvs šķēlums', slider: 'Atseguma robeža', output: 'ilustrācijas atsegti',
      art: 'Sēņotnes ilustratīva vizualizācija. Meža virsma ir esoša PIE.PE mākslīgā intelekta ilustrācija; šķēlums un dzintarkrāsas hifas ir shēma, nevis rentgens vai mikroskopijas novērojums. Līniju izmērs, krāsa un izvietojums nav mērīti.',
      stories: [
        { id: 'wood', title: 'Koksne ir dzīves telpa', text: 'Koksni noārdošas sēnes sēņotne var augt koksnē arī tad, kad augļķermeni neredzam. Koksne šeit ir substrāts — vide un vielu avots sēnei.', source: 'mycelium' },
        { id: 'hyphae', title: 'Pavedieni, kas pārveido', text: 'Hifas sazarojas un izdala fermentus apkārtējā vidē. Sašķeltās vielas sēne uzņem; koksnes noārdīšana ir daļa no vielu aprites. Tas nenozīmē, ka visas sēnes noārda koksni vai veido mikorizu.', source: 'mycelium' },
        { id: 'spores', title: 'Augļķermenis un ceļš tālāk', text: 'Piepe ir augļķermenis. Daudzām piepēm sporas veidojas poru stobriņu iekšpusē, nevis katrā koksnē esošajā hifā. Pēc atbrīvošanās gaisa plūsmas var tās aiznest tālāk; jaunas sēņotnes attīstībai vajadzīgi piemēroti apstākļi.', source: 'spores' },
      ],
    },
    atlas: {
      label: 'Pazīmju atlants', heading: 'Vēl viens skatiens apakšpusē.',
      lead: 'Poras, lapiņas un citas virsmas stāsta par augļķermeņa uzbūvi. Atver zīmējumu un salīdzini struktūras — tās nav konkrētu sugu fotogrāfijas.',
      caution: 'Šis ir vērošanas ceļvedis, nevis sugas noteikšanas instruments. Pazīmes jāvērtē kopā ar augšanas vietu un citām īpašībām; trīs zīmējumi neaptver visu sēņu daudzveidību.',
      smooth: 'Gluda virsma', teeth: 'Adatiņas',
      cards: [
        { id: 'pores', title: 'Poras', short: 'Atveres sīkos stobriņos.', detail: 'Poras ir atveres stobriņos, kuru iekšpusē ir sporas veidojošā virsma. Dažām piepēm atveres ir viegli saskatāmas, citām nepieciešama lupa. Zīmējums parāda principu, nevis vienas sugas poru izmēru.', source: 'pores' },
        { id: 'gills', title: 'Lapiņas', short: 'Plānas plātnītes zem cepurītes.', detail: 'Lapiņu sānu virsmas nes sporas veidojošo slāni. Arī uz koksnes var augt sēnes ar lapiņainiem augļķermeņiem; plaukta forma pati par sevi nepierāda porainu apakšpusi.', source: 'gills' },
        { id: 'surfaces', title: 'Citas virsmas', short: 'Gluds klājums vai atsevišķas adatiņas.', detail: 'Gluda sporas veidojošā virsma un zobaini izaugumi ir atšķirīgas uzbūves, nevis viena kopīga sugu grupa. Uz koksnes aug arī sēnes ar gludām, krokotām vai sīki zobainām virsmām. Šeit abas idejas parādītas atsevišķi.', source: 'surfaces' },
      ],
    },
    time: {
      label: 'Kritalas laika kapsula', heading: 'Dzīve nepazūd. Tā maina formu.',
      lead: 'Četri skatieni uz atmirstošu koksni — no svaiga stumbra līdz pārmaiņām, kas kļūst par daļu no meža turpinājuma.',
      slider: 'Izvēlies ekoloģisko posmu', scenario: 'Ilustratīvi ekoloģiskie posmi, nevis kalendārs. Tie var pārklāties; ātrumu ietekmē koka suga, izmērs, mitrums, klimats un novietojums. Arī vēlīnos posmos daļa koksnes var saglabāties.',
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
    illustration: 'Schematic illustration · not a species image or measured scale', source: 'Read the source', closer: 'Look closer', close: 'Close the closer view',
    xray: {
      label: 'Beneath the bark', heading: 'What we see is a beginning.',
      lead: 'The surface hides part of the story. This imagined cross-section makes room to think about mycelium that the forest image cannot show.',
      surface: 'Bark surface', below: 'Illustrative cross-section', slider: 'Reveal boundary', output: 'of the illustration revealed',
      art: 'An illustrative visualisation of mycelium. The surface is existing AI-generated PIE.PE artwork; the cross-section and amber hyphae are a diagram, not an X-ray or microscopic observation. Line sizes, colours and positions are not measurements.',
      stories: [
        { id: 'wood', title: 'Wood is a place to live', text: 'The mycelium of a wood-decaying fungus can grow inside wood when no fruiting body is visible. Here, wood is its substrate: an environment and a source of resources.', source: 'mycelium' },
        { id: 'hyphae', title: 'Threads that transform', text: 'Hyphae branch and release enzymes into their surroundings. The fungus absorbs the simpler compounds; wood decay contributes to wider cycles. This does not mean that all fungi decay wood or form mycorrhizas.', source: 'mycelium' },
        { id: 'spores', title: 'A fruiting body, a way onward', text: 'A bracket is a fruiting body. In many brackets, spores form along the inner surfaces of pore tubes, not in every hypha within the wood. Air currents can carry released spores away; new mycelium needs suitable conditions to develop.', source: 'spores' },
      ],
    },
    atlas: {
      label: 'An atlas of surfaces', heading: 'Another look underneath.',
      lead: 'Pores, gills and other surfaces reveal different fruiting-body structures. Open a drawing and compare them: these are diagrams, not species photographs.',
      caution: 'This is an observation guide, not a species identification tool. Features must be considered alongside the growing site and other characteristics; three drawings cannot encompass fungal diversity.',
      smooth: 'Smooth surface', teeth: 'Teeth',
      cards: [
        { id: 'pores', title: 'Pores', short: 'Openings into tiny tubes.', detail: 'Pores open into tubes with spore-producing inner surfaces. Some are readily visible; others need a hand lens. This drawing shows a principle, not the measured pores of a particular species.', source: 'pores' },
        { id: 'gills', title: 'Gills', short: 'Thin plates beneath a cap.', detail: 'The sides of the gills carry the spore-producing layer. Gilled fruiting bodies can also grow on wood; a shelf shape does not establish a pored underside.', source: 'gills' },
        { id: 'surfaces', title: 'Other surfaces', short: 'A smooth layer or separate teeth.', detail: 'A smooth spore-bearing surface and tooth-like projections are different structures, not one shared species group. Wood also supports fungi with smooth, wrinkled or finely toothed surfaces. The two ideas are drawn separately here.', source: 'surfaces' },
      ],
    },
    time: {
      label: 'The deadwood time capsule', heading: 'Life changes its shape.',
      lead: 'Four ways to look at dead wood, from a newly fallen trunk to changes that become part of the forest’s continuation.',
      slider: 'Choose an ecological stage', scenario: 'Illustrative ecological stages, not a calendar. Stages can overlap; tree species, size, moisture, climate and position all affect the rate. Some wood can remain even in later stages.',
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
