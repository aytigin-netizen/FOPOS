import type { ExperimentVisualKind } from "../domain/experiment-types";

export type SceneArtwork = { src?: string; alt: string; caption: string; objectPosition?: string; cropScale?: number; };

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
    alt: "Sıcak ışıklı ahşap çalışma odasında açık kural kitabı, sembol kartları ve işlem tepsileri",
    caption: "Kapalı odada sembol eşleştirme kuralları: sözdizimi ve anlam ayrımı",
    objectPosition: "center 50%",
  },
  "pascals-wager": {
    src: "/assets/thought-experiments/pascal_wager_scales_1795459979577.jpg",
    alt: "Yıldızlı gece penceresi önünde mum ışığında pirinç terazi, zar ve parşömen defterler",
    caption: "Belirsizlik altında pratik karar hesabı ve inanç sorusu",
    objectPosition: "center 50%",
  },
  "antigone": {
    src: "/assets/thought-experiments/antigone_conscience_law_1795459980112.jpg",
    alt: "Meşalelerle aydınlatılmış antik Dor sütunlu avluda bronz kraliyet sütunu karşısında duran Antigone",
    caption: "Yürürlükteki buyruk ile yazılı olmayan vicdani yükümlülük arasındaki çatışma",
    objectPosition: "center 42%",
  },
  "veil-of-ignorance": {
    src: "/assets/thought-experiments/rawls_veil_ignorance_1795460546430.jpg",
    alt: "Dairesel mermer meclis odasında boş taş tabletler ve pirinç terazi üzerinde asılı yarı saydam bilgisizlik peçesi",
    caption: "Başlangıç durumunda kişisel konumu gizleyen peçe ve tarafsız adalet ilkeleri",
    objectPosition: "center 48%",
  },
  "circle-enlargement": {
    src: "/assets/thought-experiments/russell_circle_enlargement_1795462105941.jpg",
    alt: "Dar mum ışığıyla aydınlanan çalışma masasından yıldızlı gece gökyüzüne ve uzak dağlara açılan kemerli taş pencere",
    caption: "Kişisel çıkarların dar çemberinden felsefi sorgulamanın geniş ufkuna açılış",
    objectPosition: "center 50%",
  },
  "brillo-boxes": {
    src: "/assets/thought-experiments/danto_brillo_gallery_1795462106391.jpg",
    alt: "Bir yanda galeri kaidesi üzerinde sergilenen, diğer yanda arka depodaki rafta duran görsel olarak özdeş iki geometrik desenli kutu",
    caption: "Gözün göremediği fark: Sıradan nesneyi sanat yapıtına dönüştüren kuramsal bağlam",
    objectPosition: "center 50%",
  },
  "euthyphro-dilemma": {
    src: "/assets/thought-experiments/plato_euthyphro_temple_1795462107365.jpg",
    alt: "Antik Atina stoa revakında sunak üzerinde yan yana duran taş zeytinyağı kabı ve altın denge terazisi",
    caption: "Değerin ölçütü ilahi irade mi, yoksa iyinin kendi içsel doğası mı?",
    objectPosition: "center 52%",
  },
  "black-swan": {
    src: "/assets/thought-experiments/popper_black_swan_1795462107593.jpg",
    alt: "Sisli bir sabah gölünde solda süzülen beyaz kuğuların karşısında sağdaki sazlıklardan çıkıp suda halkalar oluşturan tek siyah kuğu",
    caption: "Binlerce doğrulayıcı gözlem karşısında tek bir aykırı örneğin sarsıcı gücü",
    objectPosition: "center 55%",
  },
  "niebla-mist": {
    src: "/assets/thought-experiments/unamuno_niebla_study_1795462109590.jpg",
    alt: "Salamanca'da sisle dolan bir yazar çalışma odasında açık el yazması defterin karşısında beliren silik paltolu karakter silueti",
    caption: "Kurmacanın yazarına karşı kendi gerçekliğini ve iradesini savunduğu an",
    objectPosition: "center 48%",
  },
  "sisyphus-boulder": {
    src: "/assets/thought-experiments/camus_sisyphus_mountain_1795462108493.jpg",
    alt: "Akdeniz'in koyu turkuaz sularına bakan dik kireçtaşı yamacında dev bir kayanın yanında dingin bir duruşla bekleyen tek insan silueti",
    caption: "Kaya yuvarlandıktan sonra yokuş aşağı inerken bilincin kazandığı özgürlük",
    objectPosition: "center 52%",
  },
  "achilles-tortoise": {
    src: "/assets/thought-experiments/carroll_achilles_tortoise_1795462405578.jpg",
    alt: "Antik sütunlu koşu yolunda sonsuz bir parşömen rulosu açılmışken defterine mantıksal adımlar yazan Aşil ve karşısında bekleyen kaplumbağa",
    caption: "Öncülleri kabul etmek yetmez: Çıkarım kuralı olmadan argüman sonsuz gerilemeye girer",
    objectPosition: "center 55%",
  },
};

export function getExperimentArtwork(kind: ExperimentVisualKind): SceneArtwork { return sceneArtworks[kind]; }
