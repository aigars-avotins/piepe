import type { Locale } from './i18n'

// Shared site chrome (menu, footer) and the About / Colophon page. One typed shape for both languages.
type SiteCopy = {
  menu: { label: string; open: string; languages: string; items: { home: string; guide: string; notes: string; wallpapers: string; about: string } }
  footer: { thought: string; forest: string; read: string; about: string; portal: string; art: string; edition: string; meaning: string }
  status: { imageUnavailable: string; retry: string; soundHint: string; loupeNote: string; keepReading: string }
  about: {
    title: string; description: string; label: string; heading: string; lead: string; imageAlt: string
    sections: { id: string; heading: string; paragraphs: string[] }[]
    films: { id: string; heading: string; intro: string; items: { name: string; text: string }[]; outro: string }
    made: { id: string; heading: string; items: { term: string; text: string }[] }
    people: { heading: string; note: string }
    returnThought: string; returnLabel: string
  }
}

/** Credits and contact are the owner's to state; nothing is rendered until they are filled in. */
export const colophonPeople: { role: Record<Locale, string>; name: string; href?: string }[] = []

export const siteCopy: Record<Locale, SiteCopy> = {
  lv: {
    menu: { label: 'Takas', open: 'Takas: vietnes lapas un valoda', languages: 'Valoda', items: { home: 'Dzīvais mežs', guide: 'Kas ir piepe?', notes: 'Meža piezīmes', wallpapers: 'Meža foni', about: 'Par pie.pe' } },
    footer: { thought: 'Mežs paliek. Skatiens mainās.', forest: 'Mežā', read: 'Lasīt', about: 'Par', portal: 'Ienāc piepē', art: 'Filmas un attēli ir mākslīgā intelekta radīti mākslas darbi, nevis sugu noteikšanas pierādījumi.', edition: 'Izdevums', meaning: 'piepe — sēne, kas aug uz koka' },
    status: { imageUnavailable: 'Izpētes attēls nav pieejams. Oriģināla saite paliek pieejama.', retry: 'Mēģināt vēlreiz', soundHint: 'Skanējums mainās līdz ar skatienu', loupeNote: 'Digitālā lupa palielina esošo attēlu; tā nerada jaunas optiskas detaļas vai izmērītu mērogu.', keepReading: 'Turpini lasīt' },
    about: {
      title: 'Par PIE.PE — iecere, tapšana un pateicības', description: 'Kā tapa PIE.PE: viena doma par vērību, desmit mākslīgā intelekta radītas filmas, dabiska ritināšana, avotos balstītas piezīmes, burti un skaņa.',
      label: 'Par pie.pe / Kolofons', heading: 'Maza gaisma lielā mežā.', imageAlt: 'PIE.PE: maza silta gaisma tumšā mežā',
      lead: 'PIE.PE ir lēna vietne par piepēm un par skatīšanos. Piepe ir plaukts pie stumbra, kam parasti paejam garām. Šeit pie tās var apstāties.',
      sections: [
        { id: 'iecere', heading: 'Iecere', paragraphs: [
          'Vērība ir maza, pārvietojama gaisma. Tā neizgaismo visu mežu — tikai to vietu, kur skatāmies. PIE.PE šai domai ļauj īstenoties pa vienam solim: piepe atsaucas, kad tai tuvojies; filmā ir gaisma, ko vari pavirzīt; virs fotogrāfijas ir lupa.',
          'Nekas netiek prasīts. Katru ainu var pamest ar vienu kustību, filma neapstājas, lai kaut ko mācītu, un skaņa nekad nav nepieciešama.',
        ] },
        { id: 'tapsana', heading: 'Kā tas veidots', paragraphs: [
          'Ceļu ved desmit īsas filmas: ievads, pamošanās, divas meža ainavas un sešas, kas aizved piepē un atpakaļ. Tās tiek rādītas sākotnējā kvalitātē un ātrumā.',
          'Lapa ritinās tā, kā to dara tava ierīce: ritināšana nav pārņemta, nav 3D ainas un nav daļiņu dzinēja. Lasāmās lapas ir vienkāršs HTML un darbojas arī bez JavaScript.',
          'Ja ierīcē izvēlēta mazāka kustība vai datu taupīšana, to pašu stāstu izstāsta attēli un teksts, un neviena filma netiek ielādēta.',
        ] },
        { id: 'istais-un-izteletais', heading: 'Īstais un iztēlotais', paragraphs: [
          'Visas filmas, izpētes attēli un ekrāna foni ir mākslīgā intelekta radīti mākslas darbi. Tie nav dokumentāli kadri, mikroskopijas uzņēmumi vai pierādījumi sugas noteikšanai.',
          'Skaidrojumi ir rakstīti atsevišķi, un katrā lapā ir norādīti to avoti. Ja attēls un teksts šķiet pretrunā, uzticies tekstam un tā avotiem.',
        ] },
        { id: 'wallpapers', heading: 'Par ekrāna foniem', paragraphs: [
          'Meža fonus var bez maksas lejupielādēt un lietot savos ekrānos. Ja vēlies tos izmantot citādi — publikācijā, produktā vai tālākai izplatīšanai —, vispirms pajautā.',
        ] },
        { id: 'pieejamiba', heading: 'Pieejamība', paragraphs: [
          'Katru ceļu var noiet ar tastatūru, pieskārienu vai ekrāna lasītāju. Kustību var apturēt, valodu — nomainīt jebkurā brīdī, un skaņa sākas tikai tad, kad to ieslēdz.',
          'Vietne neizmanto izsekotājus, reklāmas vai trešo pušu skriptus. Tā atceras tikai to, vai ievads šajā pārlūka sesijā jau ir redzēts.',
        ] },
      ],
      films: { id: 'filmas-vardos', heading: 'Filmas vārdos', intro: 'Filmās nav runas. Tiem, kas tās neredz vai izvēlas neskatīties, — tas, kas tajās notiek.', items: [
        { name: 'Ievads', text: 'Plašs mežs rīta dūmakā. Kamera cauri papardēm tuvojas vecam stumbram un apstājas pie piepju kārtām tā sānā.' },
        { name: 'Pamošanās', text: 'Kamera tuvojas piepei, līdz tās slāņi piepilda kadru.' },
        { name: 'Zem virsmas', text: 'Sūnas, rasas lāses un sīki kātiņi pretgaismā — pasaule pirksta gala mērogā.' },
        { name: 'Tuvāk piepei', text: 'Kamera atstāj seno koku un pietuvojas vienai piepei.' },
        { name: 'Cauri porai', text: 'Gaišā, porainā apakšpuse piepilda kadru, un skatiens ieiet vienā no atverēm.' },
        { name: 'Zem redzamā', text: 'Šūnaina eja, kuras tālajā galā spīd gaisma.' },
        { name: 'Dzīvā sēņotnes pasaule', text: 'Iztēlota zeltaina telpa ar gaišiem pavedieniem un sīkām lodītēm. Tā turpinās, līdz izvēlies doties prom.' },
        { name: 'Atpakaļ caur piepi', text: 'Ceļš ārā pa to pašu poru.' },
        { name: 'Atgriešanās mežā', text: 'Kamera attālinās no porainās virsmas līdz senajam kokam.' },
        { name: 'Atkal gaismā', text: 'Plašs mežs; pār papardēm un stumbriem lēni slīd gaismas stari.' },
      ], outro: 'Skaņa ir klusa putnu balsu cilpa. Tā papildina, bet neko nepaskaidro.' },
      made: { id: 'riki-un-burti', heading: 'Rīki, burti un skaņa', items: [
        { term: 'Uzbūve', text: 'React, TypeScript un Vite; GSAP kamerai, kas seko ritināšanai. Iepriekš sagatavots HTML, ko pasniedz Cloudflare Workers ar stingru satura drošības politiku.' },
        { term: 'Burti', text: 'Cormorant Garamond (Christian Thalmann) un Manrope (Mikhail Sharanda), abi ar SIL Open Font licenci.' },
        { term: 'Skaņa', text: 'Meža skaņas veidotas no ieraksta “Birds” (kvgarlic, CC0), kas pielāgots Blanket projektā.' },
        { term: 'Attēli', text: 'Filmas, izpētes attēli un foni radīti ar mākslīgā intelekta attēlu un video rīkiem; kadri atlasīti un savstarpēji saskaņoti.' },
      ] },
      people: { heading: 'Veidotāji un saziņa', note: '' },
      returnThought: 'Paskaties vēlreiz uz to, kas jau bija tepat.', returnLabel: 'Atgriezties dzīvajā mežā',
    },
  },
  en: {
    menu: { label: 'Trails', open: 'Trails: site pages and language', languages: 'Language', items: { home: 'The living forest', guide: 'What is a bracket fungus?', notes: 'Field notes', wallpapers: 'Forest wallpapers', about: 'About pie.pe' } },
    footer: { thought: 'The forest stays. Your gaze changes.', forest: 'In the forest', read: 'Read', about: 'About', portal: 'Enter the fungus', art: 'The films and images are AI-made artwork, not evidence for identifying a species.', edition: 'Edition', meaning: 'piepe — Latvian for bracket fungus' },
    status: { imageUnavailable: 'The study image is unavailable. Its original link remains available.', retry: 'Try again', soundHint: 'The sound shifts as you explore', loupeNote: 'The digital loupe enlarges the existing image; it does not add optical detail or a measured scale.', keepReading: 'Keep reading' },
    about: {
      title: 'About PIE.PE — concept, process and credits', description: 'How PIE.PE was made: one idea about attention, ten AI-made films, native scrolling, sourced field notes, typefaces, sound and credits.',
      label: 'About / Colophon', heading: 'A small light in a large forest.', imageAlt: 'PIE.PE: a small warm light in a dark forest',
      lead: 'PIE.PE is a slow website about bracket fungi and about looking. “Piepe” is the Latvian word for a bracket fungus: a shelf on a trunk that most of us walk past. Here you can stop beside one.',
      sections: [
        { id: 'the-idea', heading: 'The idea', paragraphs: [
          'Attention is a small, movable light. It never shows the whole forest, only the place you are looking. PIE.PE lets that idea happen one step at a time: a fungus that answers when you come near, a light you can move across a film, a loupe over a photograph.',
          'Nothing is asked of you. Every scene can be left with a single action, the film never stops to teach, and sound is never required.',
        ] },
        { id: 'how-it-is-made', heading: 'How it is made', paragraphs: [
          'Ten short films carry the journey: an opening, an awakening, two forest scenes and six that travel into the fungus and back. They play at their original quality and speed.',
          'The page scrolls the way your device scrolls: no scroll hijacking, no 3D scene and no particle engine. The reading pages are plain HTML and work without JavaScript.',
          'If your device asks for reduced motion or is saving data, the same story is told with stills and text, and no film is requested.',
        ] },
        { id: 'real-and-imagined', heading: 'What is real and what is imagined', paragraphs: [
          'Every film, study image and wallpaper is AI-made artwork. None of it is documentary footage, microscopy or evidence for identifying a species.',
          'The explanations are written separately and cite their sources on each page. Where an image and the text seem to disagree, trust the text and its sources.',
        ] },
        { id: 'wallpapers', heading: 'About the wallpapers', paragraphs: [
          'The forest wallpapers are free to download and use on your own screens. For any other use — in a publication, a product or for redistribution — please ask first.',
        ] },
        { id: 'access', heading: 'Access', paragraphs: [
          'Every journey can be made by keyboard, by touch or with a screen reader. Motion can be paused, the language changed at any point, and sound starts only when you ask for it.',
          'The site uses no trackers, advertising or third-party scripts. It remembers only whether you have already seen the introduction in this browser session.',
        ] },
      ],
      films: { id: 'films-in-words', heading: 'The films in words', intro: 'The films contain no speech. For anyone who cannot see them, or chooses not to watch, this is what happens in them.', items: [
        { name: 'Opening', text: 'A wide forest in morning haze. The camera travels through ferns to an old trunk and settles on tiers of bracket fungi along its side.' },
        { name: 'Awakening', text: 'The camera moves toward the fungus until its layers fill the frame.' },
        { name: 'Beneath the surface', text: 'Moss, dew and small stalks against the light: a world at the scale of a fingertip.' },
        { name: 'Approaching the fungus', text: 'The camera leaves the ancient tree and closes in on a single bracket.' },
        { name: 'Through a pore', text: 'The pale, porous underside fills the frame, and the view passes into one of its openings.' },
        { name: 'Beneath what is visible', text: 'A honeycombed passage, lit from its far end.' },
        { name: 'The living world', text: 'An imagined golden space of pale threads and small spheres. It continues until you choose to leave.' },
        { name: 'Leaving the fungus', text: 'The way out, through the same pore.' },
        { name: 'Returning to the forest', text: 'The camera draws back from the porous surface to the ancient tree.' },
        { name: 'Back in the light', text: 'A wide forest; shafts of light move slowly over ferns and trunks.' },
      ], outro: 'The sound is a quiet loop of birdsong. It accompanies the films and explains nothing.' },
      made: { id: 'tools-and-type', heading: 'Tools, type and sound', items: [
        { term: 'Build', text: 'React, TypeScript and Vite; GSAP for the camera that follows your scrolling. Prerendered HTML served by Cloudflare Workers under a strict Content Security Policy.' },
        { term: 'Type', text: 'Cormorant Garamond by Christian Thalmann and Manrope by Mikhail Sharanda, both under the SIL Open Font License.' },
        { term: 'Sound', text: 'Forest ambience adapted from “Birds” by kvgarlic (CC0), as edited for the Blanket project.' },
        { term: 'Imagery', text: 'Films, study images and wallpapers were made with AI image and video tools; frames were selected and matched to one another.' },
      ] },
      people: { heading: 'Credits and contact', note: '' },
      returnThought: 'Look again at what was already there.', returnLabel: 'Return to the living forest',
    },
  },
}
