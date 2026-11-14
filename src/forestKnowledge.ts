import { messages } from './i18n'
import type { Locale } from './i18n'
import type { NoteNumber } from './forestPaths'

export const forestSources = {
  chaga: { name: 'Latvijas Daba — melnā spulgpiepe, čaga', url: 'https://www.latvijasdaba.lv/senes/inonotus-obliquus-frfr-pilat/' },
  chagaLife: { name: 'Latvijas valsts meži — Dekoratīvā slimība – čaga', url: 'https://www.lvm.lv/jaunumi/2405-dekorativa-slimiba-caga' },
  birch: { name: 'Michael Kuo, MushroomExpert — Fomitopsis betulina', url: 'https://www.mushroomexpert.com/fomitopsis_betulina.html' },
  birchName: { name: 'Latvijas Daba — brūnā bērzupiepe (Piptoporus betulinus)', url: 'https://www.latvijasdaba.lv/senes/piptoporus-betulinus-bull-fr-p-karst/' },
  sulphur: { name: 'Latvijas Daba — parastā sērpiepe', url: 'https://www.latvijasdaba.lv/senes/laetiporus-sulphureus-bull-fr-murrill/' },
  sulphurGuide: { name: 'Pat O’Reilly, First Nature — Laetiporus sulphureus', url: 'https://www.first-nature.com/fungi/laetiporus-sulphureus.php' },
  tinder: { name: 'Latvijas Daba — īstā posapiepe', url: 'https://www.latvijasdaba.lv/senes/fomes-fomentarius-l-fr-fr/' },
  redBelt: { name: 'Latvijas Daba — parastā apmalpiepe', url: 'https://www.latvijasdaba.lv/senes/fomitopsis-pinicola-sw-fr-p-karst/' },
  artistName: { name: 'Latvijas Daba — parastā plakanpiepe', url: 'https://www.latvijasdaba.lv/senes/ganoderma-applanatum-pers-pat/' },
  artist: { name: 'Pat O’Reilly, First Nature — Ganoderma applanatum', url: 'https://www.first-nature.com/fungi/ganoderma-applanatum.php' },
  deadwood: { name: 'Müller & Bütler — A review of habitat thresholds for dead wood', url: 'https://doi.org/10.1007/s10342-010-0400-5' },
  deadwoodHabitats: { name: 'Humphrey & Bailey, Forest Research — Managing deadwood in forests and woodlands', url: 'https://www.forestresearch.gov.uk/publications/managing-deadwood-in-forests-and-woodlands/' },
  decay: { name: 'Bai et al. — Spatial Heterogeneity of SOM Concentrations Associated with White-rot Versus Brown-rot Wood Decay', url: 'https://doi.org/10.1038/s41598-017-14181-7' },
  mycorrhiza: { name: 'Australian National Botanic Gardens — Mycorrhizas', url: 'https://www.anbg.gov.au/fungi/mycorrhiza.html' },
  lucidum: { name: 'Latvijas Sarkanā grāmata — lakas plakanpiepe', url: 'https://sarkanagramata.lu.lv/suga/lakas-plakanpiepe/' },
  law: { name: 'MK noteikumi Nr. 396 — 1. pielikuma 9.27. punkts', url: 'https://likumi.lv/ta/id/12821-noteikumi-par-ipasi-aizsargajamo-sugu-un-ierobezoti-izmantojamo-ipasi-aizsargajamo-sugu-sarakstu' },
  taxonomy: { name: 'Cao, Wu & Dai — Species clarification of the prize medicinal Ganoderma mushroom “Lingzhi”', url: 'https://doi.org/10.1007/s13225-012-0178-5' },
} as const
export type ForestSource = keyof typeof forestSources
export type NoteSection = { heading: string; paragraphs: string[]; sources?: ForestSource[]; footnote?: string; label?: string }
export type NoteCopy = {
  title: string; heading: string; description: string; motif: string; lead: string
  sections: NoteSection[]; care: string; related: NoteNumber[]
}

const notes: Record<Locale, Record<Exclude<NoteNumber, '001'>, NoteCopy>> = {
  lv: {
    '002': {
      title: 'Čaga — melnā spulgpiepe uz bērza | Meža piezīme 002 | PIE.PE',
      heading: 'Melnā spulgpiepe jeb čaga',
      description: 'Kas ir melnais čagas izaugums uz bērza? Par Inonotus obliquus sterilo veidojumu, dzīves ciklu un atšķirību no brūnās bērzupiepes.',
      motif: 'Ogles melnums uz balta stumbra.',
      lead: 'Čaga ir melnās spulgpiepes (Inonotus obliquus) veidots sterils izaugums, visbiežāk uz dzīva bērza. Redzamais melnais veidojums nav sporas ražojošais augļķermenis. Latvijā šī sēne ir sastopama visā teritorijā.',
      sections: [
        { heading: 'Kontrasts, kas liek apstāties', paragraphs: ['Uz gaišas mizas neregulārais, plaisainais izaugums atgādina ogli. Tā izskats piesaista skatienu, taču melna krāsa vien nepierāda sugu. Svarīgs ir arī saimniekkoks un veidojuma uzbūve.', 'Sēņotne dzīvo koksnē un to noārda. Čaga sastopama galvenokārt uz bērziem, tomēr tā nav piesaistīta tikai vienai koku ģintij.'], sources: ['chaga', 'chagaLife'] },
        { heading: 'Divas atšķirīgas dzīves cikla daļas', paragraphs: ['Sterilajā izaugumā sporas neveidojas. Sporulējošais augļķermenis attīstās atsevišķi zem mizas, saistībā ar saimniekkoka atmiršanu; atveroties mizai, sporas var izplatīties.', 'Tāpēc redzamā melnā masa un sēnes vairošanās virsma nav viens un tas pats. Šī atšķirība palīdz saprast, kādēļ ne katrs uz koka redzamais sēnes veidojums ir parasta piepes cepurīte.'], sources: ['chagaLife'] },
        { heading: 'Uz bērza var augt arī cita sēne', paragraphs: ['Brūnā bērzupiepe (Fomitopsis betulina, agrāk Piptoporus betulinus) ir cita suga. Tai veidojas atsevišķi, sākumā gaiši, vēlāk brūngani augļķermeņi ar porainu apakšpusi.', 'Kopīgs saimniekkoks nepadara šīs sēnes par vienu sugu. Uzraksts “bērza piepe” bez zinātniskā nosaukuma var būt pārāk neskaidrs.'], sources: ['birchName', 'birch'] },
      ],
      care: 'Šī piezīme ir par sēnes bioloģiju. Tirdzniecības nosaukumi un ārstniecības solījumi neaizstāj sugas noteikšanu vai klīniskus pierādījumus; šeit nav medicīnisku lietošanas norādījumu.', related: ['004', '005'],
    },
    '003': {
      title: 'Parastā sērpiepe — krāsa un koksne | Meža piezīme 003 | PIE.PE',
      heading: 'Parastā sērpiepe',
      description: 'Parastā sērpiepe (Laetiporus sulphureus): dzeltenoranži augļķermeņi, lapu koki, novecošana un brūnā trupe. Vērošana ar noteikšanas robežām.',
      motif: 'Pēkšņa krāsa krēslainā mežā.',
      lead: 'Parastā sērpiepe (Laetiporus sulphureus) veido dzeltenus līdz oranžus, bieži čemuros sakārtotus augļķermeņus. Latvijā tā ir bieži sastopama uz lapu koku stumbriem gan mežos, gan parkos un alejās. Sēne izraisa brūno trupi.',
      sections: [
        { heading: 'Krāsa ir mainīgs notikums', paragraphs: ['Augļķermeņi parasti ir viengadīgi. Jauniem augļķermeņiem krāsa var būt sevišķi koša. Augot, novecojot un žūstot, tā mainās un izbalē; mīkstākā struktūra kļūst sīkstāka un sausāka.', 'Tas pats čemurs dažādos laikos var izskatīties pārsteidzoši atšķirīgs. Vērts pamanīt ne tikai krāsu, bet arī augļķermeņu malu, izvietojumu un apakšpusi ar sīkajām porām.'], sources: ['sulphur', 'sulphurGuide'] },
        { heading: 'Koks ir daļa no apraksta', paragraphs: ['Augļķermeņi parādās gan uz dzīviem kokiem, gan uz atmirušas koksnes. Redzamā daļa ir tikai sēnes dzīves posms: sēņotne koksnē var būt darbojusies jau agrāk.', 'Brūnā trupe maina koksnes sastāvu un izturību. Augļķermeņa klātbūtne nav pietiekama, lai no attāluma novērtētu visa koka stāvokli.'], sources: ['sulphur'] },
        { heading: 'Pazīstams nosaukums nav ēdamības garantija', paragraphs: ['Sērpiepei ir kulināra reputācija; angļu nosaukums chicken of the woods uz to arī norāda. Tomēr nosaukums, spilgta krāsa vai fotogrāfija nenosaka, vai konkrētu atradumu drīkst ēst.', 'Noteikšanā vajadzīgas zināšanas par sugām, saimniekkoku un augšanas vidi. Avotos minētas arī nevēlamas individuālas reakcijas. Šis ir vērošanas teksts, nevis ēdamo sēņu noteicējs.'], sources: ['sulphurGuide'] },
      ],
      care: 'Atstāj čemuru tā augšanas vietā un vēro tā pārmaiņas. PIE.PE mākslinieciskie attēli nav izmantojami ēdamības vai sugas noteikšanai.', related: ['004', '005'],
    },
    '004': {
      title: 'Trīs Latvijas meža piepes | Meža piezīme 004 | PIE.PE',
      heading: 'Trīs Latvijas meža piepes',
      description: 'Īstā posapiepe, parastā apmalpiepe un parastā plakanpiepe: atšķirīgas virsmas, saimniekkoki un daudzgadīgi augļķermeņi.',
      motif: 'Gadu gredzeni ārpus koka.',
      lead: 'Īstā posapiepe, parastā apmalpiepe un parastā plakanpiepe ir trīs atšķirīgas koksni noārdošu sēņu sugas. To daudzgadīgie augļķermeņi var palikt redzami vairākus gadus. Līdzīga plaukta forma vēl nenozīmē vienādu uzbūvi vai dzīvesveidu.',
      sections: [
        { heading: 'Īstā posapiepe — Fomes fomentarius', paragraphs: ['Cietā, pelēcīgā virsma un masīvā forma piesaista skatienu pie stumbra. Latvijas avoti šo sugu saista īpaši ar bērziem, arī ar atmirstošiem stumbriem, kritalām un celmiem. Tā izraisa balto trupi.', 'Nosaukumā palikusi cilvēka un sēnes kopīgā vēsture: no posapiepes gatavoja posu uguns uzturēšanai. Tas ir vēsturisks lietojums, nevis aicinājums noņemt augļķermeni.'], sources: ['tinder'] },
        { heading: 'Parastā apmalpiepe — Fomitopsis pinicola', paragraphs: ['Pie augošās malas bieži redzama sarkanīga vai oranža josla, bet virsma tuvāk pamatnei ir pelēcīgāka vai brūngana. Apakšpusē ir sīkas, gaišas poras.', 'Tā aug uz skuju koku un lapu koku koksnes un izraisa brūno trupi. Latvijas Daba to raksturo kā vienu no biežāk sastopamajām piepēm Latvijā.'], sources: ['redBelt'] },
        { heading: 'Parastā plakanpiepe — Ganoderma applanatum', paragraphs: ['Plakanāks, brūns augļķermenis un gaiša poru virsma veido citu siluetu. Porainā apakšpuse bojājuma vietā brūnē; angļu nosaukums artist’s bracket saistīts ar šo īpašību.', 'Suga veido ilgmūžīgus augļķermeņus uz atmirstošiem un atmirušiem stumbriem, īpaši lapu kokiem. Noteikšanā tā jāsalīdzina arī ar citām plakanpiepēm.'], sources: ['artistName', 'artist'] },
        { heading: 'Kārtas nav koka dzimšanas apliecība', paragraphs: ['Virsmas joslojums un jauni poru slāņi var liecināt par augļķermeņa pieaugumu. Pēc vienas redzamas joslas nevar noteikt koka vai visas sēņotnes vecumu. Nosaukumi šajā piezīmē ir sākums salīdzināšanai, nevis pilna noteikšanas atslēga.'], sources: ['artist'] },
      ],
      care: 'Salīdzini vairākas pazīmes un koksni, uz kuras sēne aug. Šeit nav sugu pierādošu fotogrāfiju; viena forma vai krāsa sugu neapstiprina.', related: ['002', '003', '006'],
    },
    '005': {
      title: 'Kritalas un laiks — koksnes otrā dzīve | Meža piezīme 005 | PIE.PE',
      heading: 'Kritalas un laiks',
      description: 'Atmirusi koksne, sēņu hifas, baltā un brūnā trupe. Kā koksnes noārdīšana piedalās meža apritē un atšķiras no mikorizas.',
      motif: 'Kad koks nokrīt, sākas otrā dzīve.',
      lead: 'Kritala ir atmirusi koksne, kuras noārdīšanā piedalās sēnes un citi organismi. Dažādi koksnes izmēri, mitrums un sadalīšanās pakāpes rada atšķirīgus dzīves apstākļus. Sēņu hifas — sīkie sēņotnes pavedieni — koksnē palīdz pārveidot tās vielas un iesaistīt tās tālākā apritē.',
      sections: [
        { heading: 'Viena kritala, vairākas pārmaiņas', paragraphs: ['Ciets stumbrs un mīksta, tālu sadalījusies koksne nav viena un tā pati dzīvesvieta. Atmirusī koksne ir nozīmīga ar to saistītajām sugām; tās daudzveidību palīdz saprast gan koka suga, gan koksnes veids un sadalīšanās stadija.', 'Eiropas mežu pētījumi rāda, ka atmirušās koksnes nozīmi nevar izteikt ar vienu universālu skaitli visiem mežiem. Vērīgs skatiens meklē atšķirības arī starp blakus gulošiem stumbriem.'], sources: ['deadwoodHabitats', 'deadwood'] },
        { heading: 'Baltā un brūnā trupe', paragraphs: ['Koksnē ir celuloze, hemiceluloze un lignīns. Baltās trupes sēnes spēj noārdīt lignīnu; atkarībā no sēnes un apstākļiem tās noārda arī citus koksnes komponentus.', 'Brūnajā trupē intensīvi tiek noārdīta celuloze un hemiceluloze, bet paliek salīdzinoši vairāk pārveidota lignīna. Atšķirīgie procesi maina gan koksnes izskatu un izturību, gan vielas, kas nonāk augsnē.'], sources: ['decay'] },
        { heading: 'Sēņotne nenozīmē vienu ekoloģisku lomu', paragraphs: ['Koksnes noārdīšanā sēne iegūst vielas no koksnes. Mikorizā sēņu hifas ir saistītas ar augu saknēm: daudzās šādās attiecībās augs nodod fotosintēzē iegūtas oglekļa vielas, bet sēne palīdz piekļūt augsnes barības vielām.', 'Tās ir atšķirīgas ekoloģiskas attiecības. Nav pamata pieņemt, ka katra koksni noārdošā piepe vienlaikus veido mikorizu vai ka visas meža sēnes dara vienu un to pašu darbu.'], sources: ['mycorrhiza'] },
      ],
      care: 'Pamani koksnes struktūru un to, kas uz tās dzīvo. Saudzīgai vērošanai nav nepieciešams plēst mizu vai izjaukt kritalu.', related: ['002', '003', '004'],
    },
    '006': {
      title: 'Lakas plakanpiepe — spīdums un aizsardzība | Meža piezīme 006 | PIE.PE',
      heading: 'Lakas plakanpiepe',
      description: 'Ganoderma lucidum Latvijā: spīdīga virsma, atmirusi koksne, jutīgas sugas novērtējums un juridiskā aizsardzība. Ar reishi nosaukuma skaidrojumu.',
      motif: 'Spīdīga virsma sūnu klusumā.',
      lead: 'Lakas plakanpiepe (Ganoderma lucidum) ir koksni noārdoša sēne ar lakai līdzīgu, spīdīgu virsmu. Latvijā tā ir īpaši aizsargājama suga. Latvijas Sarkanā grāmata to novērtē kā jutīgu (VU).',
      sections: [
        { heading: 'Spīdums un augšanas vieta', paragraphs: ['Sarkanbrūno cepurītes virsmu klāj ciets, lakai līdzīgs slānis; kāts bieži pievienots sāniski. Gaišajā apakšpusē ir poras. Spīdums ir pamanāma pazīme, taču ar to vien noteikšanai nepietiek.', 'Latvijā suga parasti aug uz celmiem vai pie atmirušu stumbru pamatnēm, pārsvarā uz lapu koku koksnes. Piemērotas vietas ir arī mitros saimnieciskos mežos un parkos; sēne izraisa balto trupi.'], sources: ['lucidum'] },
        { heading: 'Sastopamība un aizsardzība', paragraphs: ['Jaunā Latvijas Sarkanā grāmata sugu raksturo kā samērā bieži sastopamu, vienlaikus novērtējot kā jutīgu neliela pieaugušo indivīdu skaita dēļ. Redzamu atradņu izplatība un populācijas apdraudējums raksturo dažādas lietas.', 'Sarkanās grāmatas kategorija ir apdraudējuma novērtējums. Juridisko aizsardzību apstiprina MK noteikumu Nr. 396 īpaši aizsargājamo sugu saraksta 9.27. punkts.'], sources: ['lucidum', 'law'] },
        { heading: 'Ko nozīmē reishi vai lingzhi?', paragraphs: ['Šie tirdzniecībā lietotie nosaukumi nav pietiekami precīzi sugas noteikšanai. Taksonomiskos pētījumos Austrumāzijā kultivētā Ganoderma lingzhi ir nošķirta no Eiropā aprakstītās Ganoderma lucidum.', 'Tāpēc uz iepakojuma rakstītais nosaukums pats par sevi nepierāda saistību ar Latvijā atrastu sēni. Šī piezīme neizsaka apgalvojumus par ārstniecisku iedarbību.'], sources: ['taxonomy'] },
      ],
      care: 'Aizsargājamu sēni atstāj augšanas vietā: vēro un fotografē, nevis ievāc vai bojā augļķermeni un tā dzīvotni.', related: ['004', '005'],
    },
  },
  en: {
    '002': {
      title: 'Chaga — black growth on birch | Field note 002 | PIE.PE', heading: 'Chaga',
      description: 'The black chaga growth is not a spore-producing fruiting body. A sourced look at Inonotus obliquus, its life cycle and the separate birch polypore.',
      motif: 'Charcoal darkness on pale bark.',
      lead: 'Chaga is a sterile growth formed by Inonotus obliquus, most often on a living birch. The conspicuous black mass is not its spore-producing fruiting body. Latvian sources record the fungus throughout the country.',
      sections: [
        { heading: 'A contrast that holds the eye', paragraphs: ['Against pale bark, the irregular, cracked growth can look like charcoal. Its appearance draws attention, but blackness alone does not establish a species. The host tree and the structure of the growth matter too.', 'The mycelium lives in and decays the wood. Birch is the main host, but this fungus is not restricted to a single tree genus.'], sources: ['chaga', 'chagaLife'] },
        { heading: 'Two different parts of a life cycle', paragraphs: ['The sterile growth does not produce spores. A separate, spore-producing fruiting body develops beneath the bark in connection with the host’s death; openings in the bark allow spores to disperse.', 'The visible black mass and the reproductive surface are therefore different structures. Not every conspicuous fungal growth on a tree is an ordinary bracket cap.'], sources: ['chagaLife'] },
        { heading: 'Another fungus on the same tree', paragraphs: ['The birch polypore, Fomitopsis betulina, formerly called Piptoporus betulinus, is a separate species. It produces individual brackets that are initially pale and later brownish, with pores underneath.', 'Sharing a host does not make two fungi the same species. A loose label such as “birch fungus” can conceal an important difference.'], sources: ['birchName', 'birch'] },
      ],
      care: 'This note concerns fungal biology. A commercial name or health claim does not establish a specimen’s identity or clinical efficacy; no medical-use directions are offered here.', related: ['004', '005'],
    },
    '003': {
      title: 'Chicken of the woods — colour and wood | Field note 003 | PIE.PE', heading: 'Chicken of the woods',
      description: 'Laetiporus sulphureus: yellow-orange brackets, hardwood hosts, ageing and brown rot. A closer-looking note with identification and safety limits.',
      motif: 'Sudden colour in a dim wood.',
      lead: 'Laetiporus sulphureus, the sulphur polypore or chicken of the woods, forms yellow to orange brackets, often in overlapping clusters. In Latvia it is frequently recorded on hardwood trunks in forests, parks and avenues. It causes brown rot.',
      sections: [
        { heading: 'Colour is a passing moment', paragraphs: ['The brackets are usually annual. Fresh ones can be strikingly bright. Their colours change and fade as they grow, age and dry; the initially softer flesh becomes tougher and drier.', 'The same cluster can look remarkably different at another time. Notice the margins, arrangement and finely pored underside as well as the colour.'], sources: ['sulphur', 'sulphurGuide'] },
        { heading: 'The tree belongs in the description', paragraphs: ['Fruiting bodies appear on living trees as well as dead wood. They represent only one stage in the fungus’s life: mycelium may have been active in the wood before a bracket appeared.', 'Brown rot changes the wood’s composition and strength. A distant view of a fruiting body cannot establish the condition of the whole tree.'], sources: ['sulphur'] },
        { heading: 'A familiar name is no guarantee of edibility', paragraphs: ['This fungus has a culinary reputation, reflected in its English name. A name, vivid colour or photograph cannot determine whether a particular find is safe to eat.', 'Identification requires knowledge of the fungi, host and growing environment. Field guides also report adverse individual reactions. This is a note about observation, not an edible-mushroom identification guide.'], sources: ['sulphurGuide'] },
      ],
      care: 'Leave a cluster in place and notice how it changes. PIE.PE’s artistic imagery cannot establish a species or its suitability for eating.', related: ['004', '005'],
    },
    '004': {
      title: 'Three Latvian bracket fungi | Field note 004 | PIE.PE', heading: 'Three Latvian bracket fungi',
      description: 'Fomes fomentarius, Fomitopsis pinicola and Ganoderma applanatum: contrasting surfaces, hosts, wood decay and perennial brackets.',
      motif: 'Growth rings outside the tree.',
      lead: 'The tinder fungus, red-belted bracket and artist’s bracket are three different wood-decaying fungi. Their perennial fruiting bodies can remain visible for years. A similar shelf shape does not imply identical structures or ways of living.',
      sections: [
        { heading: 'Tinder fungus — Fomes fomentarius', paragraphs: ['The hard, greyish surface and substantial shape stand out against a trunk. Latvian sources associate it particularly with birch, including dying trunks, fallen wood and stumps. It causes white rot.', 'Its name carries a piece of human history: material from the fungus was prepared as tinder. That historical use is a reason to look more closely, not a request to remove a bracket.'], sources: ['tinder'] },
        { heading: 'Red-belted bracket — Fomitopsis pinicola', paragraphs: ['A reddish or orange band often marks the growing margin, with greyer or browner areas towards the base. The underside has small, pale pores.', 'It grows on both conifer and hardwood timber and causes brown rot. Latvijas Daba describes it as one of Latvia’s most frequently encountered bracket fungi.'], sources: ['redBelt'] },
        { heading: 'Artist’s bracket — Ganoderma applanatum', paragraphs: ['A flatter, brown bracket and pale pore surface make a different outline. The underside turns brown where damaged, a property behind the English name artist’s bracket.', 'Long-lived fruiting bodies develop on dying and dead trunks, especially hardwoods. Identification also requires comparison with other Ganoderma species.'], sources: ['artistName', 'artist'] },
        { heading: 'Layers cannot date the tree', paragraphs: ['Surface bands and new pore layers can indicate growth of a fruiting body. One visible band cannot establish the age of its tree or the entire mycelium. These names begin a comparison; they do not form a complete identification key.'], sources: ['artist'] },
      ],
      care: 'Compare several features and the wood supporting the fungus. No diagnostic species photographs are supplied here; shape or colour alone does not establish an identification.', related: ['002', '003', '006'],
    },
    '005': {
      title: 'Deadwood and time — a tree’s second life | Field note 005 | PIE.PE', heading: 'Deadwood and time',
      description: 'Fallen trees, fungal hyphae, white rot and brown rot. How wood decay contributes to forest cycles and differs from mycorrhizal relationships.',
      motif: 'When a tree falls, another life begins.',
      lead: 'A fallen trunk is dead wood undergoing change through the activity of fungi and other organisms. Different sizes, moisture levels and stages of decay provide different conditions for life. Fungal hyphae, the fine threads of mycelium, help transform the wood’s substances and return them to wider cycles.',
      sections: [
        { heading: 'One trunk, several changes', paragraphs: ['Hard timber and soft, extensively decayed wood are different habitats. Dead wood matters to the species associated with it; tree species, wood type and decay stage all help explain that diversity.', 'Research in European forests shows why its value cannot be reduced to one universal quantity for every forest. A closer look finds differences even between neighbouring logs.'], sources: ['deadwoodHabitats', 'deadwood'] },
        { heading: 'White rot and brown rot', paragraphs: ['Wood contains cellulose, hemicellulose and lignin. White-rot fungi can break down lignin and, depending on the fungus and conditions, other wood components too.', 'Brown rot extensively breaks down cellulose and hemicellulose, leaving relatively more modified lignin. These pathways change the wood’s appearance and strength, and the substances entering the soil.'], sources: ['decay'] },
        { heading: 'Mycelium does not mean one ecological role', paragraphs: ['A wood-decaying fungus obtains resources from wood. In mycorrhizas, fungal hyphae associate with plant roots: in many such relationships the plant supplies carbon compounds made by photosynthesis, while the fungus helps obtain soil nutrients.', 'These are different ecological relationships. We should not assume that every wood-decaying bracket also forms mycorrhizas, or that all forest fungi perform the same work.'], sources: ['mycorrhiza'] },
      ],
      care: 'Notice the wood’s structure and the life it supports. Gentle observation does not require peeling bark or breaking a log apart.', related: ['002', '003', '004'],
    },
    '006': {
      title: 'Lacquered bracket — shine and conservation | Field note 006 | PIE.PE', heading: 'Lacquered bracket',
      description: 'Ganoderma lucidum in Latvia: glossy surfaces, dead wood, Vulnerable assessment and legal protection, with a careful explanation of reishi and lingzhi.',
      motif: 'A glossy surface in the quiet moss.',
      lead: 'The lacquered bracket, Ganoderma lucidum, is a wood-decaying fungus with a varnish-like surface. It is legally protected in Latvia. The Latvian Red Data Book assesses it as Vulnerable (VU).',
      sections: [
        { heading: 'A shine and a growing place', paragraphs: ['A hard, lacquer-like layer covers the reddish-brown cap; the stem is often attached to one side. The paler underside has pores. Gloss is conspicuous, but it cannot establish an identification on its own.', 'In Latvia the fungus usually grows on stumps or near the bases of dead trunks, mainly hardwoods. Suitable sites also occur in damp managed forests and parks. The fungus causes white rot.'], sources: ['lucidum'] },
        { heading: 'Occurrence and protection', paragraphs: ['The current Latvian Red Data Book describes it as relatively common, while assessing it as Vulnerable because of a low number of mature individuals. The spread of visible records and a population’s conservation assessment describe different things.', 'The Red Data Book category is a threat assessment. Legal protection is confirmed separately by item 9.27 in the protected-species list of Latvian Cabinet Regulation No. 396.'], sources: ['lucidum', 'law'] },
        { heading: 'What do reishi and lingzhi mean?', paragraphs: ['These commercial names are not precise enough to establish a species. Taxonomic research distinguishes the cultivated East Asian Ganoderma lingzhi from Ganoderma lucidum originally described from Europe.', 'A name on a packet therefore does not establish a connection with a fungus found in Latvia. This note makes no claims about medicinal efficacy.'], sources: ['taxonomy'] },
      ],
      care: 'Leave a protected fungus where it grows: observe and photograph rather than collect or damage its fruiting bodies and habitat.', related: ['004', '005'],
    },
  },
}

export function fieldNote(locale: Locale, number: NoteNumber): NoteCopy {
  if (number !== '001') return notes[locale][number]
  const t = messages[locale]
  return {
    title: `${t.noteLabel} — ${t.atlas} | PIE.PE`, heading: t.atlas,
    description: locale === 'lv' ? 'Trīs sākotnējie PIE.PE vērojumi: virsma, apslēptais un skatiens, ko paņemt līdzi. Meža piezīme 001 lasīšanai savā ritmā.' : 'The three original PIE.PE observations: surface, what lies beneath, and a different gaze to carry away. Field note 001, read at your own pace.',
    motif: locale === 'lv' ? 'Mazs pieturas punkts uzmanībai.' : 'A small place to pause and pay attention.',
    lead: locale === 'lv' ? 'Trīs sākotnējie PIE.PE literārie vērojumi aicina palēnināt skatienu. Šeit tos var izlasīt vienkopus un lejupielādēt. Tie ir uzmanības vingrinājumi, nevis konkrētas sēņu sugas atraduma pieraksts.' : 'These three original PIE.PE literary observations invite a slower gaze. Read them together here or keep a text copy. They are exercises in attention, not a record of finding a particular fungal species.',
    sections: t.observations.map(observation => ({ heading: observation.title, label: observation.label, paragraphs: [observation.text], footnote: observation.footnote })),
    care: locale === 'lv' ? 'Mežā sāc ar vienu detaļu: malu, virsmu vai gaismu. Tās ieraudzīšanai nav nepieciešams neko paņemt vai nosaukt par atrastu sugu.' : 'In the woods, begin with one detail: a margin, a surface, a patch of light. Seeing it does not require taking anything away or giving it a species name.', related: ['002', '005'],
  }
}

export const collectionCopy = {
  lv: {
    wallpapersTitle: 'Bezmaksas meža tapetes datoram un telefonam | PIE.PE', wallpapersHeading: 'Meža tapetes datoram un telefonam',
    wallpapersDescription: 'PIE.PE mākslinieciskais mežs ekrānam: bezmaksas 5K un 4K darbvirsmas tapetes un vertikāls telefona fons. Īsti JPG faili, skaidri izmēri.',
    wallpapersLead: 'Meža gaisma, veca ozola miza un sūnu tuvplāns. Izvēlies kompozīciju darbvirsmai vai telefonam.',
    desktopCaption: 'Mākslīgā intelekta meža ilustrācija ar sūnām, stumbru un dzintarkrāsas piepēm. Tumšākā kreisā mala atstāj vietu darbvirsmas ikonām.',
    phoneCaption: 'Mākslīgā intelekta ilustrācija: vertikāls skats gar sūnainu stumbru un piepju kārtām. Galīgais fons veidots garam telefona ekrānam.',
    desktopAlt: 'PIE.PE mākslīgā intelekta meža ilustrācijas horizontāls priekšskatījums ar piepēm uz stumbra',
    phoneAlt: 'PIE.PE mākslīgā intelekta meža ilustrācijas vertikāls priekšskatījums ar piepēm un sūnām',
    artDisclosure: 'Šie ir mākslīgā intelekta radīti mākslinieciski meža attēli. Tie nav dokumentālas fotogrāfijas vai pierādījumi sugu noteikšanai.',
    cinemaDisclosure: 'PIE.PE kinematogrāfiskais mežs ir mākslīgā intelekta radīta mākslinieciska interpretācija. Tā attēli un filmas nav sugu noteikšanas pierādījumi.',
    resolutionNote: 'Lejupielāžu izmēri ir 5120 × 2880 un 3840 × 2160 datoram, 1440 × 3120 telefonam. Faili ir rūpīgi palielināti no apstiprinātajām ilustrācijām; 5K un 4K apzīmē gatavā faila izmēru, nevis sākotnējās ilustrācijas izšķirtspēju.',
    saveHeading: 'Kā saglabāt fonu', saveText: 'Izvēlies atbilstošo izmēru un saglabā JPG failu. Ja telefona pārlūks atver attēlu, izmanto tā saglabāšanas vai kopīgošanas izvēlni. Fonu un tā novietojumu pēc tam izvēlies ierīces iestatījumos; dažādi ekrāni var apgriezt attēla malas.',
    indexTitle: 'Meža piezīmes — piepes, kritalas un vērība | PIE.PE', indexHeading: 'Meža piezīmes',
    indexDescription: 'PIE.PE Meža piezīmes 001–006: literāri vērojumi, čaga, sērpiepe, Latvijas piepes, kritalas un lakas plakanpiepe. Lasāmas latviski un angliski.',
    indexLead: 'Trīs sākotnējie literārie vērojumi un piecas avotos balstītas piezīmes par piepēm un koksnes dzīvi. Katrs teksts ir aicinājums paskatīties vēlreiz.',
    noteLabel: 'Meža piezīme', sources: 'Avoti un tālākā lasīšana', related: 'Turpini lasīt', allNotes: 'Visas Meža piezīmes', guide: 'Kas ir piepe?', wallpapers: 'Meža tapetes', forest: 'Atgriezties dzīvajā mežā',
    original: 'Saglabāt sākotnējo Meža piezīmi 001 (.txt)', originalContext: 'Šis ir sākotnējais PIE.PE teksts no interaktīvā piepes stāsta. Par augļķermeni, sēņotni un porām lasi zināšanu lapā “Kas ir piepe?”.',
    observation: 'Skatienam līdzi',
  },
  en: {
    wallpapersTitle: 'Free Forest Wallpapers for Desktop and Phone | PIE.PE', wallpapersHeading: 'Forest wallpapers for desktop and phone',
    wallpapersDescription: 'Carry the artistic PIE.PE forest onto your screen: free 5K and 4K desktop wallpapers and a vertical phone background. Real JPG downloads with clear dimensions.',
    wallpapersLead: 'Forest light, old oak bark and a close view of moss. Choose a composition for your desktop or phone.',
    desktopCaption: 'An AI-generated forest illustration with moss, a tree trunk and amber brackets. The darker left edge leaves room for desktop icons.',
    phoneCaption: 'An AI-generated vertical view along a mossy trunk and layered brackets, composed for a tall phone screen.',
    desktopAlt: 'Horizontal preview of an AI-generated PIE.PE forest illustration with bracket fungi on a trunk',
    phoneAlt: 'Vertical preview of an AI-generated PIE.PE forest illustration with bracket fungi and moss',
    artDisclosure: 'These are artistic forest images made with AI. They are not documentary photographs or evidence for species identification.',
    cinemaDisclosure: 'PIE.PE’s cinematic forest uses AI-generated artistic imagery. Its images and films are not evidence for species identification.',
    resolutionNote: 'Downloads measure 5120 × 2880 and 3840 × 2160 for desktop, and 1440 × 3120 for phone. The approved illustrations were carefully enlarged; 5K and 4K describe the finished files, not the original rendering resolution.',
    saveHeading: 'Saving your background', saveText: 'Choose a size and save the JPG file. If your phone browser opens the image, use its save or share menu. Then choose the background and its position in your device settings; different screens may crop the edges.',
    indexTitle: 'Field notes — fungi, deadwood and attention | PIE.PE', indexHeading: 'Field notes',
    indexDescription: 'PIE.PE field notes 001–006: literary observations, chaga, sulphur polypore, Latvian brackets, deadwood and lacquered bracket. Read in English or Latvian.',
    indexLead: 'Three original literary observations and five sourced notes on fungi and the life of wood. Each text is an invitation to look again.',
    noteLabel: 'Field note', sources: 'Sources and further reading', related: 'Keep reading', allNotes: 'All field notes', guide: 'What is a bracket fungus?', wallpapers: 'Forest wallpapers', forest: 'Return to the living forest',
    original: 'Keep the original Field note 001 (.txt)', originalContext: 'This is the original PIE.PE text from the interactive fungus encounter. For fruiting bodies, mycelium and pores, read the factual guide “What is a bracket fungus?”.',
    observation: 'Carry a different gaze',
  },
} as const
