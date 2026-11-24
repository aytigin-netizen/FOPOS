import type { ExperimentVisualKind } from "../domain/experiment-types";

export type SceneArtwork = {
  src?: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};

export const sceneArtworks: Record<ExperimentVisualKind, SceneArtwork> = {
  "beetle-box": {
    src: "/assets/thought-experiments/beetle_box_study_1795459978216.jpg",
    alt: "Ahşap bir seminer masası üzerinde yan yana duran dört kapalı küçük ahşap kutu",
    caption: "Herkesin kendi kapalı kutusu: özel yaşantı ve ortak dil sorusu",
    objectPosition: "center 58%",
  },
  "theseus-ship": {
    src: "/assets/thought-experiments/theseus_ship_harbor_1795459978540.jpg",
    alt: "Antik bir limanda demirli ahşap gemi ve rıhtımda bekleyen yeni kereste tahtaları",
    caption: "Parçaları zamanla yenilenen gemi: süreklilik ve özdeşlik paradoksu",
    objectPosition: "center 52%",
  },
  "plato-cave": {
    src: "/assets/thought-experiments/plato_cave_allegory_1795459977629.jpg",
    alt: "İçerisinde ateş ışığı ve taş duvarlara düşen gölgeler bulunan, uzağında gün ışığına açılan mağara",
    caption: "Mağaradaki ateş ışığından dışarıdaki güneşe yükselen bilgi yolculuğu",
    objectPosition: "center 50%",
  },
  "trolley-dilemma": {
    src: "/assets/thought-experiments/trolley_dilemma_tracks_1795459978113.jpg",
    alt: "İki farklı raya ayrılan demiryolu makasına yaklaşan klasik tramvay ve ön planda makas kolu",
    caption: "İki raya ayrılan makas önünde eylem, sonuç ve sorumluluk seçimi",
    objectPosition: "center 55%",
  },
  "last-human": {
    src: "/assets/thought-experiments/routley_last_human_1795459979883.jpg",
    alt: "Alacakaranlıkta el değmemiş bir ormana, nehre ve yaban hayatına bakan kayalık tepede tek başına duran insan silueti",
    caption: "İnsan sonrası dünyada doğanın ve canlı yaşamının kendinde değeri",
    objectPosition: "center 48%",
  },
  "chinese-room": {
    alt: "Sıcak bir masa lambası altında kural kitapları ve yazışma kutusu bulunan ahşap çalışma odası",
    caption: "Kapalı odada sembol eşleştirme kuralları: sözdizimi ve anlam ayrımı",
    objectPosition: "center 50%",
  },
  "pascals-wager": {
    src: "/assets/thought-experiments/pascal_wager_scales_1795459979577.jpg",
    alt: "Yıldızlı gece penceresi önünde mum ışığında pirinç terazi, zar ve parşömen defterler",
    caption: "Belirsizlik altında pratik karar hesabı ve inanç sorusu",
    objectPosition: "center 50%",
  },
  antigone: {
    src: "/assets/thought-experiments/antigone_conscience_law_1795459980112.jpg",
    alt: "Meşalelerle aydınlatılmış antik Dor sütunlu avluda bronz kraliyet sütunu karşısında duran Antigone",
    caption: "Yürürlükteki buyruk ile yazılı olmayan vicdani yükümlülük arasındaki çatışma",
    objectPosition: "center 42%",
  },
};

export function getExperimentArtwork(kind: ExperimentVisualKind): SceneArtwork {
  return sceneArtworks[kind];
}
