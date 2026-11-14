import type {Locale} from './i18n'
export const threadCopy = {
  lv: {
    follow: 'Atklāj pavedienu', close: 'Atgriezties pie filmas', beats: 'Trīs pavedieni',
    quietHelp: 'Izvēlies vienu no trim pavedieniem. Escape atgriež pie mierīgā skata.',
    help: 'Pārvieto gaismu ar peli vai pirkstu. Bulttaustiņi pārvieto gaismu, Enter atver nākamo pavedienu, Home atgriež sākumā. Escape aizver pavedienu.',
    stories: [
      {title: 'Sākums ir koksnē.', text: 'Koksni noārdošās sēnes iegūst barības vielas, sašķeļot koksnes sastāvdaļas. Daļa šīs dzīves paliek skatienam slēpta.'},
      {title: 'Viena sēne. Daudz pavedienu.', text: 'Sēņotni veido mikroskopiski pavedieni — hifas. Piepe ir augļķermenis, nevis visa sēne.'},
      {title: 'Mežs sākas no jauna.', text: 'Noārdoties koksnei, barības vielas atgriežas apritē un rodas mājvietas citiem organismiem. Dažas piepes aug arī dzīvos kokos.'},
    ],
  },
  en: {
    follow: 'Follow a thread', close: 'Return to pure cinema', beats: 'Three threads',
    quietHelp: 'Choose one of the three threads. Escape returns to the quiet view.',
    help: 'Move the light with your pointer or finger. Arrow keys move the light, Enter opens the next thread, Home returns to the beginning. Escape closes the thread.',
    stories: [
      {title: 'A life within the wood.', text: 'Wood-decaying fungi obtain nutrients by breaking down parts of the wood. Much of that work happens out of sight.'},
      {title: 'One fungus. Many threads.', text: 'Mycelium is made of microscopic threads called hyphae. A bracket is a fruiting body, rather than the whole fungus.'},
      {title: 'The forest begins again.', text: 'As wood decays, nutrients return to circulation and other organisms find a home. Some bracket fungi also grow on living trees.'},
    ],
  },
} satisfies Record<Locale, unknown>

