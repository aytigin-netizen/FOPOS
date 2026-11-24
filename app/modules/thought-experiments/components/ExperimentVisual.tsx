import { useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { ExperimentVisualKind } from "../domain/experiment-types";

type Props = { kind: ExperimentVisualKind; compact?: boolean };

const labels: Record<ExperimentVisualKind, string> = {
  "beetle-box": "Kapalı kutular ve karşılaştırılamayan özel içerikler",
  "theseus-ship": "Geminin parçalarının zaman içinde değişimini gösteren süreç şeması",
  "plato-cave": "Mağara, gölgeler, ateş, çıkış ve güneş alegorisi",
  "trolley-dilemma": "İki seçenekli tramvay etik ikilemi",
  "last-human": "Son insan ve insan dışı yaşamı gösteren çevre etiği illüstrasyonu",
  "chinese-room": "Çin Odası sembol girdi, kural işleme ve çıktı şeması",
  "pascals-wager": "Pascal bahsinin inanç seçenekleri ve sonuç matrisi",
  antigone: "Antigone ile Kreon arasındaki yasa ve vicdan çatışması",
  "veil-of-ignorance": "Bilgisizlik peçesi, başlangıç durumu ve adalet ilkeleri şeması",
  "circle-enlargement": "Kişisel çıkar çemberinden felsefi düşünce ufkuna genişleme şeması",
  "brillo-boxes": "Görsel olarak özdeş iki kutu ve sanat dünyası bağlamı karşılaştırması",
  "euthyphro-dilemma": "Euthyphron ikileminin iki boynuzu ve değer ölçütü diyagramı",
  "black-swan": "Tümevarım birikimi karşısında tek siyah kuğunun yanlışlama gücü",
  "niebla-mist": "Sis romanında yazar ile kurgu karakter arasındaki ontolojik yüzleşme",
  "sisyphus-boulder": "Sisifos'un yokuşu, iniş bilinci ve absürd ile yüzleşme döngüsü",
  "achilles-tortoise": "Öncüller (A, B) ile çıkarım kuralı (Z) arasındaki sonsuz gerileme paradoksu",
};

type PlatoFocus = "all" | "shadows" | "fire" | "exit";
type TrolleyVariant = "switch" | "bridge";
type TrolleyTrack = "neutral" | "intervene" | "stay";
type AntigoneFocus = "conflict" | "antigone" | "creon";
type RawlsStage = 1 | 2 | 3;
type ThreeStage = 1 | 2 | 3;

export default function ExperimentVisual({ kind, compact = false }: Props) {
  const title = labels[kind];

  // Interactive pedagogical states (purely ephemeral UI state, only used when !compact)
  const [beetleRevealed, setBeetleRevealed] = useState(false);
  const [theseusStep, setTheseusStep] = useState<ThreeStage>(1);
  const [platoFocus, setPlatoFocus] = useState<PlatoFocus>("all");
  const [trolleyVariant, setTrolleyVariant] = useState<TrolleyVariant>("switch");
  const [trolleyTrack, setTrolleyTrack] = useState<TrolleyTrack>("neutral");
  const [lastHumanAfter, setLastHumanAfter] = useState(false);
  const [chineseStep, setChineseStep] = useState<0 | 1 | 2 | 3>(0);
  const [pascalCell, setPascalCell] = useState<string | null>(null);
  const [antigoneFocus, setAntigoneFocus] = useState<AntigoneFocus>("conflict");
  const [rawlsStage, setRawlsStage] = useState<RawlsStage>(1);
  const [russellStage, setRussellStage] = useState<ThreeStage>(1);
  const [dantoStage, setDantoStage] = useState<ThreeStage>(1);
  const [euthyphroStage, setEuthyphroStage] = useState<ThreeStage>(1);
  const [popperStage, setPopperStage] = useState<ThreeStage>(1);
  const [unamunoStage, setUnamunoStage] = useState<ThreeStage>(1);
  const [camusStage, setCamusStage] = useState<ThreeStage>(1);
  const [carrollStage, setCarrollStage] = useState<ThreeStage>(1);

  const beetleItems = ["◆", "✦", "∅", "△"];

  const platoHint: Record<PlatoFocus, string> = {
    all: "Anlatıyı bütün olarak izleyin; öğrenciler karakterleri kendi kavramlarıyla adlandırsın.",
    shadows: "Duvar ve gölgeler: Mahkûmlar yalnızca önlerindeki yansımaları gerçeklik olarak görür.",
    fire: "Ateş ve taşınan nesneler: Gölgeleri oluşturan kaynak mağaranın içindedir, henüz güneş değildir.",
    exit: "Çıkış ve güneş: Alışma güçlüğü bilgi edinme sürecindeki direnci ve sorgulamayı temsil eder.",
  };

  const pascalDetails: Record<string, string> = {
    "believe-true": "İnanmayı seçme + varsayım doğru: En yüksek pratik kazanç beklentisi (karar modeli varsayımı).",
    "believe-false": "İnanmayı seçme + varsayım yanlış: Sınırlı kayıp / yaşam biçimi bedeli varsayılır.",
    "doubt-true": "İnanmamayı seçme + varsayım doğru: Karar tablosunda en yüksek pratik kayıp riski.",
    "doubt-false": "İnanmamayı seçme + varsayım yanlış: Sınırlı dünyevi sonuç; doğruluk sorunu hâlâ açıktır.",
  };

  const antigoneHint: Record<AntigoneFocus, string> = {
    conflict: "Thebai'deki defin yasağı etrafında iki meşruiyet ölçütü karşı karşıya gelir.",
    antigone: "Antigone: Yöneticinin buyruğu, tanrısal ve yazılı olmayan yükümlülüğü ortadan kaldıramaz.",
    creon: "Kreon: Kent düzeni ve otorite için yürürlükteki buyruğa herkes uymalıdır.",
  };

  return (
    <figure
      className={`thought-visual thought-visual-${kind}${compact ? " is-compact" : ""}`}
      role="img"
      aria-label={title}
    >
      <svg viewBox="0 0 800 420" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`visual-paper-${kind}-${compact ? "c" : "f"}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8f5ed" />
            <stop offset="1" stopColor="#e8eee8" />
          </linearGradient>
          <linearGradient id={`visual-night-${kind}-${compact ? "c" : "f"}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1c342e" />
            <stop offset="1" stopColor="#47685a" />
          </linearGradient>
          <marker
            id={`visual-arrow-${kind}-${compact ? "c" : "f"}`}
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0 0 L0 6 L8 3 z" fill="#9a7841" />
          </marker>
        </defs>

        <rect
          x="0"
          y="0"
          width="800"
          height="420"
          rx="20"
          fill={`url(#visual-paper-${kind}-${compact ? "c" : "f"})`}
        />

        {kind === "beetle-box" && (
          <>
            {[0, 1, 2, 3].map((n) => (
              <g key={n} transform={`translate(${82 + n * 170} 118)`}>
                {/* Shared public speech bubble */}
                <rect x="18" y="-58" width="90" height="32" rx="8" fill="#24463c" />
                <text x="63" y="-37" textAnchor="middle" fill="#f7eed9" fontSize="15" fontWeight="700">
                  “böcek”
                </text>
                <rect x="0" y="25" width="125" height="145" rx="12" fill="#fffdf8" stroke="#8d9b8f" strokeWidth="4" />
                {/* Lid closed or opened */}
                {!compact && beetleRevealed ? (
                  <>
                    <path d="M-4 22 L38 -18 L120 -6" fill="none" stroke="#8d7650" strokeWidth="5" strokeLinecap="round" />
                    <text
                      x="62"
                      y="112"
                      textAnchor="middle"
                      fill={n === 2 ? "#a34b37" : "#24463c"}
                      fontSize="44"
                      fontWeight="700"
                    >
                      {beetleItems[n]}
                    </text>
                    <text x="62" y="148" textAnchor="middle" fill="#68776e" fontSize="13">
                      {n === 2 ? "Boş kutu" : "Özel içerik"}
                    </text>
                  </>
                ) : (
                  <>
                    <path d="M-5 25 L62 -5 L132 25" fill="#d9c9a7" stroke="#8d7650" strokeWidth="4" />
                    <path d="M20 92 Q62 62 105 92" fill="none" stroke="#c5cfc7" strokeWidth="3" strokeDasharray="5 7" />
                    <text x="62" y="128" textAnchor="middle" fill="#89928c" fontSize="14" fontWeight="600">
                      Kapalı
                    </text>
                  </>
                )}
                <text x="62" y="205" textAnchor="middle" fill="#40594c" fontSize="17" fontWeight="700">
                  Kutu {n + 1}
                </text>
              </g>
            ))}
            <text x="400" y="365" textAnchor="middle" fill="#385447" fontSize="22" fontWeight="700">
              {!compact && beetleRevealed
                ? "İçerikler farklı veya boş olsa da ortak sözcük sürüyor"
                : "İçerik özel · Sözcük ortak"}
            </text>
          </>
        )}

        {kind === "theseus-ship" && (
          <>
            {[0, 1, 2].map((n) => {
              const visible = compact || n + 1 <= theseusStep;
              const isCurrent = !compact && n + 1 === theseusStep;
              return (
                <g
                  key={n}
                  transform={`translate(${80 + n * 245} 112)`}
                  opacity={visible ? 1 : 0.16}
                >
                  {isCurrent && (
                    <rect
                      x="-14"
                      y="-14"
                      width="213"
                      height="226"
                      rx="16"
                      fill="rgba(181, 138, 69, 0.08)"
                      stroke="#b58a45"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                  )}
                  <path
                    d="M0 95 L185 95 L155 150 L35 150 Z"
                    fill={n === 1 ? "#b58a45" : "#55786a"}
                    stroke="#29483d"
                    strokeWidth="5"
                  />
                  {[0, 1, 2, 3, 4].map((p) => (
                    <path
                      key={p}
                      d={`M${28 + p * 29} 98 v48`}
                      stroke={n === 1 && p >= 2 ? "#fff6dc" : "#e8ddc7"}
                      strokeWidth="3"
                    />
                  ))}
                  <path
                    d="M90 90 V5 L150 90 Z"
                    fill={n === 1 ? "#d9bd87" : "#e6e2d5"}
                    stroke="#405b4e"
                    strokeWidth="4"
                  />
                  <text x="92" y="195" textAnchor="middle" fill="#40594c" fontSize="17" fontWeight="700">
                    {["1. Başlangıç", "2. Parçalar yenilenir", "3. Eski parçalardan 2. gemi"][n]}
                  </text>
                </g>
              );
            })}
            <path
              d="M260 190 H305"
              stroke="#9a7841"
              strokeWidth="4"
              opacity={compact || theseusStep >= 2 ? 1 : 0.2}
              markerEnd={`url(#visual-arrow-${kind}-${compact ? "c" : "f"})`}
            />
            <path
              d="M505 190 H550"
              stroke="#9a7841"
              strokeWidth="4"
              opacity={compact || theseusStep >= 3 ? 1 : 0.2}
              markerEnd={`url(#visual-arrow-${kind}-${compact ? "c" : "f"})`}
            />
            <text x="400" y="360" textAnchor="middle" fill="#385447" fontSize="21" fontWeight="700">
              {!compact && theseusStep === 3
                ? "Modern varyant: Hangisi başlangıçtaki Theseus Gemisi?"
                : "Aynılık hangi ölçüte dayanır?"}
            </text>
          </>
        )}

        {kind === "plato-cave" && (
          <>
            <path d="M35 325 V170 Q45 55 205 45 H595 Q755 55 765 170 V325" fill="#29483d" />
            <path d="M65 310 V180 Q85 85 220 75 H580 Q715 85 735 180 V310" fill="#45685a" />

            {/* Fire & light cone */}
            <g opacity={compact || platoFocus === "all" || platoFocus === "fire" ? 1 : 0.35}>
              <circle cx="180" cy="180" r="34" fill="#e2bd75" />
              <path d="M180 220 L260 300 L100 300 Z" fill="#d9bd87" opacity=".5" />
              <text x="180" y="132" textAnchor="middle" fill="#f7e3b7" fontSize="14" fontWeight="700">
                Ateş
              </text>
            </g>

            {/* Prisoners & Shadows */}
            <g opacity={compact || platoFocus === "all" || platoFocus === "shadows" ? 1 : 0.35}>
              {[0, 1, 2].map((n) => (
                <g key={n}>
                  <circle cx={360 + n * 75} cy="235" r="13" fill="#d9d5c8" />
                  <path d={`M${360 + n * 75} 250 v45`} stroke="#d9d5c8" strokeWidth="9" />
                  <path
                    d={`M${360 + n * 75 - 20} 260 l-15 25 M${360 + n * 75 + 20} 260 l15 25`}
                    stroke="#d9d5c8"
                    strokeWidth="7"
                  />
                </g>
              ))}
              {/* Shadow silhouettes on wall */}
              <rect x="570" y="175" width="46" height="80" rx="8" fill="#172925" opacity="0.7" />
              <text x="485" y="152" textAnchor="middle" fill="#e6e2d5" fontSize="14" fontWeight="700">
                Mahkûmlar ve Gölgeler
              </text>
            </g>

            {/* Exit & Sun */}
            <g opacity={compact || platoFocus === "all" || platoFocus === "exit" ? 1 : 0.35}>
              <path d="M650 75 Q700 10 750 75" stroke="#e2bd75" strokeWidth="8" fill="none" />
              <circle cx="690" cy="55" r="28" fill="#f0cf8b" />
              <text x="690" y="108" textAnchor="middle" fill="#fff3d6" fontSize="14" fontWeight="700">
                Çıkış · Güneş
              </text>
            </g>

            <text x="400" y="375" textAnchor="middle" fill="#fff8e9" fontSize="22" fontWeight="700">
              Gölgeden ışığa · Sanıdan bilgiye
            </text>
          </>
        )}

        {kind === "trolley-dilemma" && (
          <>
            {compact || trolleyVariant === "switch" ? (
              <>
                <path
                  d="M400 70 V175"
                  stroke="#536b5d"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M400 175 L210 300"
                  stroke={!compact && trolleyTrack === "intervene" ? "#b58a45" : "#536b5d"}
                  strokeWidth={!compact && trolleyTrack === "intervene" ? "14" : "10"}
                  fill="none"
                  strokeLinecap="round"
                  opacity={!compact && trolleyTrack === "stay" ? 0.35 : 1}
                />
                <path
                  d="M400 175 L620 300"
                  stroke={!compact && trolleyTrack === "stay" ? "#a34b37" : "#536b5d"}
                  strokeWidth={!compact && trolleyTrack === "stay" ? "14" : "10"}
                  fill="none"
                  strokeLinecap="round"
                  opacity={!compact && trolleyTrack === "intervene" ? 0.35 : 1}
                />
                <rect x="330" y="45" width="140" height="65" rx="12" fill="#d9bd87" stroke="#8c7043" strokeWidth="4" />
                <circle cx="355" cy="115" r="12" fill="#344d41" />
                <circle cx="445" cy="115" r="12" fill="#344d41" />
                {/* Side track: 1 person indicator, Main track: 5 persons indicator */}
                <rect
                  x="115"
                  y="282"
                  width="195"
                  height="68"
                  rx="12"
                  fill={!compact && trolleyTrack === "intervene" ? "#fbf3e2" : "#fffdf8"}
                  stroke={!compact && trolleyTrack === "intervene" ? "#b58a45" : "#8c9b8e"}
                  strokeWidth="3"
                />
                <rect
                  x="505"
                  y="282"
                  width="205"
                  height="68"
                  rx="12"
                  fill={!compact && trolleyTrack === "stay" ? "#fdf0ed" : "#fffdf8"}
                  stroke={!compact && trolleyTrack === "stay" ? "#a34b37" : "#8c9b8e"}
                  strokeWidth="3"
                />
                <text x="212" y="311" textAnchor="middle" fill="#24463c" fontSize="17" fontWeight="700">
                  Makası Çek (Yan Hat)
                </text>
                <text x="212" y="335" textAnchor="middle" fill="#68776e" fontSize="14">
                  1 kişi etkilenir
                </text>
                <text x="607" y="311" textAnchor="middle" fill="#24463c" fontSize="17" fontWeight="700">
                  Müdahale Etme (Ana Hat)
                </text>
                <text x="607" y="335" textAnchor="middle" fill="#68776e" fontSize="14">
                  5 kişi etkilenir
                </text>
              </>
            ) : (
              <>
                {/* Footbridge Variant (Thomson, 1976) */}
                <path d="M100 265 H700" stroke="#536b5d" strokeWidth="12" strokeLinecap="round" />
                <rect x="130" y="200" width="135" height="60" rx="12" fill="#d9bd87" stroke="#8c7043" strokeWidth="4" />
                <circle cx="155" cy="264" r="11" fill="#344d41" />
                <circle cx="240" cy="264" r="11" fill="#344d41" />
                {/* Overpass */}
                <rect x="330" y="95" width="140" height="22" rx="6" fill="#8d7650" />
                <path d="M350 117 V200 M450 117 V200" stroke="#c4b493" strokeWidth="8" />
                <circle cx="385" cy="72" r="14" fill="#24463c" />
                <circle cx="425" cy="72" r="16" fill="#9a7841" />
                {/* Group on main track */}
                {[540, 575, 610, 645, 680].map((x) => (
                  <circle key={x} cx={x} cy="240" r="11" fill="#40594c" />
                ))}
                <text x="400" y="155" textAnchor="middle" fill="#40594c" fontSize="16" fontWeight="700">
                  Üst Geçit Varyantı (Thomson, 1976)
                </text>
                <text x="400" y="325" textAnchor="middle" fill="#52625a" fontSize="15">
                  Doğrudan bir kişiyi araç olarak kullanmak ile yön değiştirmek arasındaki fark
                </text>
              </>
            )}
            <text x="400" y="390" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">
              Seçim · Sonuç · Sorumluluk · Araçsallaştırma
            </text>
          </>
        )}

        {kind === "last-human" && (
          <>
            <rect
              x="0"
              y="0"
              width="800"
              height="420"
              rx="20"
              fill={`url(#visual-night-${kind}-${compact ? "c" : "f"})`}
            />
            <circle cx="650" cy="90" r="42" fill="#e3c58c" />
            {[90, 210, 560, 690].map((x, i) => (
              <g key={x}>
                <path d={`M${x} 300 V${120 + (i % 2) * 40}`} stroke="#b7c8ae" strokeWidth="15" />
                <circle cx={x} cy={130 + (i % 2) * 40} r="63" fill="#8eaa8e" />
                <circle cx={x - 28} cy={145 + (i % 2) * 40} r="38" fill="#6f947b" />
              </g>
            ))}
            {/* Non-human living creatures / stream */}
            <path d="M120 322 Q400 296 680 322" stroke="#7aa398" strokeWidth="8" fill="none" opacity="0.7" />
            <circle cx="295" cy="275" r="9" fill="#d9bd87" />
            <circle cx="495" cy="268" r="10" fill="#d9bd87" />
            {/* Last Human silhouette (fades out when toggled to post-human ecosystem) */}
            <g opacity={!compact && lastHumanAfter ? 0.14 : 1}>
              <path
                d="M390 310 v-95 M390 240 l-38 -45 M390 240 l40 -45"
                stroke="#e6d6b8"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="390" cy="190" r="19" fill="#e6d6b8" />
            </g>
            <path d="M330 330 Q390 300 450 330" stroke="#d7bd8b" strokeWidth="5" fill="none" />
            <text x="400" y="385" textAnchor="middle" fill="#f4f1e7" fontSize="21" fontWeight="700">
              {!compact && lastHumanAfter
                ? "İnsan kalmadığında bile ekosistemin kendi değeri var mıdır?"
                : "İnsan olmasa da doğanın değeri var mı?"}
            </text>
          </>
        )}

        {kind === "chinese-room" && (
          <>
            <rect
              x="60"
              y="105"
              width="170"
              height="150"
              rx="16"
              fill={!compact && chineseStep === 1 ? "#fbf3e2" : "#fffdf8"}
              stroke={!compact && chineseStep === 1 ? "#b58a45" : "#8b9b8e"}
              strokeWidth={!compact && chineseStep === 1 ? "6" : "4"}
            />
            <rect
              x="305"
              y="70"
              width="210"
              height="215"
              rx="16"
              fill={!compact && chineseStep === 2 ? "#f4e6c8" : "#e7ddc7"}
              stroke={!compact && chineseStep === 2 ? "#b58a45" : "#9a7841"}
              strokeWidth={!compact && chineseStep === 2 ? "6" : "4"}
            />
            <rect
              x="590"
              y="105"
              width="150"
              height="150"
              rx="16"
              fill={!compact && chineseStep === 3 ? "#eaf4ee" : "#fffdf8"}
              stroke={!compact && chineseStep === 3 ? "#24463c" : "#8b9b8e"}
              strokeWidth={!compact && chineseStep === 3 ? "6" : "4"}
            />
            <text x="145" y="165" textAnchor="middle" fill="#40594c" fontSize="26" fontWeight="700">
              符号
            </text>
            <text x="145" y="205" textAnchor="middle" fill="#68776e" fontSize="16">
              1. Sembol Girdisi
            </text>
            <text x="410" y="135" textAnchor="middle" fill="#6f542b" fontSize="19" fontWeight="700">
              2. Kural Kitabı
            </text>
            <text x="410" y="162" textAnchor="middle" fill="#6f542b" fontSize="14">
              {!compact && chineseStep >= 2 ? "“符号 → 回答” eşleştir" : "Sözdizimi kuralları"}
            </text>
            <path d="M365 188 h90 M365 213 h90 M365 238 h90" stroke="#9a7841" strokeWidth="5" strokeLinecap="round" />
            <text x="665" y="165" textAnchor="middle" fill="#40594c" fontSize="26" fontWeight="700">
              回答
            </text>
            <text x="665" y="205" textAnchor="middle" fill="#68776e" fontSize="16">
              3. Sembol Çıktısı
            </text>
            <path
              d="M235 180 H295 M520 180 H580"
              stroke="#9a7841"
              strokeWidth="5"
              markerEnd={`url(#visual-arrow-${kind}-${compact ? "c" : "f"})`}
            />
            <text x="400" y="350" textAnchor="middle" fill="#385447" fontSize="21" fontWeight="700">
              {!compact && chineseStep === 3
                ? "Dışarıdan akıcı yanıt görünür · İçeride anlam bilinmiyor"
                : "Sembol işlemek ≠ anlamak"}
            </text>
          </>
        )}

        {kind === "pascals-wager" && (
          <>
            <rect x="300" y="30" width="200" height="56" rx="12" fill="#29483d" />
            <text x="400" y="65" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">
              Pratik Karar Yapısı
            </text>
            <path d="M400 86 V125 M400 125 L220 165 M400 125 L580 165" stroke="#9a7841" strokeWidth="4" fill="none" />
            {[
              { key: "believe", title: "İnanmayı Seçmek", x: 110 },
              { key: "doubt", title: "İnanmamayı Seçmek", x: 480 },
            ].map((branch) => (
              <g key={branch.key}>
                <rect
                  x={branch.x}
                  y="165"
                  width="210"
                  height="48"
                  rx="10"
                  fill="#e1d2b2"
                  stroke="#9a7841"
                  strokeWidth="3"
                />
                <text x={branch.x + 105} y="195" textAnchor="middle" fill="#24463c" fontSize="17" fontWeight="700">
                  {branch.title}
                </text>
              </g>
            ))}
            {/* 4 outcome cells */}
            {[
              { id: "believe-true", x: 75, y: 235, label: "Varsayım doğru", outcome: "Yüksek pratik kazanç" },
              { id: "believe-false", x: 240, y: 235, label: "Varsayım yanlış", outcome: "Sınırlı kayıp" },
              { id: "doubt-true", x: 435, y: 235, label: "Varsayım doğru", outcome: "Yüksek pratik kayıp" },
              { id: "doubt-false", x: 600, y: 235, label: "Varsayım yanlış", outcome: "Sınırlı sonuç" },
            ].map((cell) => {
              const active = !compact && pascalCell === cell.id;
              return (
                <g key={cell.id}>
                  <rect
                    x={cell.x}
                    y={cell.y}
                    width="150"
                    height="92"
                    rx="10"
                    fill={active ? "#fbf3e2" : "#fffdf8"}
                    stroke={active ? "#b58a45" : "#c7d0c9"}
                    strokeWidth={active ? "4" : "2"}
                  />
                  <text x={cell.x + 75} y={cell.y + 34} textAnchor="middle" fill="#68776e" fontSize="13" fontWeight="700">
                    {cell.label}
                  </text>
                  <text x={cell.x + 75} y={cell.y + 62} textAnchor="middle" fill="#24463c" fontSize="13" fontWeight="700">
                    {cell.outcome}
                  </text>
                </g>
              );
            })}
            <text x="400" y="382" textAnchor="middle" fill="#385447" fontSize="18" fontWeight="700">
              Pratik tercih, doğruluk kanıtı değildir
            </text>
          </>
        )}

        {kind === "antigone" && (
          <>
            <rect x="0" y="0" width="800" height="420" rx="20" fill="#efe8da" />
            <path d="M75 315 V125 H725 V315" stroke="#8d7650" strokeWidth="12" fill="none" />
            {[150, 250, 350, 450, 550, 650].map((x) => (
              <path key={x} d={`M${x} 130 V315`} stroke="#c4b493" strokeWidth="17" />
            ))}
            <path d="M85 125 L400 40 L715 125" fill="#d8c7a6" stroke="#8d7650" strokeWidth="8" />
            <g opacity={compact || antigoneFocus === "conflict" || antigoneFocus === "antigone" ? 1 : 0.35}>
              <circle cx="280" cy="215" r="28" fill="#9c7354" />
              <path d="M280 245 v85 M280 265 l-35 45 M280 265 l35 45" stroke="#526d5b" strokeWidth="17" strokeLinecap="round" />
              <text x="280" y="366" textAnchor="middle" fill="#24463c" fontSize="18" fontWeight="700">
                Antigone · Yazılı Olmayan Norm
              </text>
            </g>
            <g opacity={compact || antigoneFocus === "conflict" || antigoneFocus === "creon" ? 1 : 0.35}>
              <circle cx="530" cy="215" r="28" fill="#6d604e" />
              <path d="M530 245 v85 M530 265 l-35 45 M530 265 l35 45" stroke="#394c42" strokeWidth="17" strokeLinecap="round" />
              <text x="530" y="366" textAnchor="middle" fill="#24463c" fontSize="18" fontWeight="700">
                Kreon · Yürürlükteki Buyruk
              </text>
            </g>
          </>
        )}

        {kind === "veil-of-ignorance" && (
          <>
            {/* Left column: Hidden particular facts behind the veil */}
            <rect
              x="50"
              y="62"
              width="210"
              height="248"
              rx="14"
              fill={!compact && rawlsStage === 1 ? "#f4ece0" : "#fffdf8"}
              stroke={!compact && rawlsStage === 1 ? "#b58a45" : "#8d9b8f"}
              strokeWidth={!compact && rawlsStage === 1 ? "4" : "2.5"}
            />
            <text x="155" y="96" textAnchor="middle" fill="#24463c" fontSize="17" fontWeight="700">
              Peçe Arkası (Gizli)
            </text>
            {["Sınıf & Servet", "Doğal Yetenekler", "İyi Yaşam Anlayışı", "Kuşak & Konum"].map((item, idx) => (
              <g key={item}>
                <rect x="72" y={114 + idx * 45} width="166" height="34" rx="8" fill="#e9e2d2" stroke="#c7b898" strokeWidth="1.5" />
                <text x="155" y={136 + idx * 45} textAnchor="middle" fill="#5b5446" fontSize="14" fontWeight="600">
                  {!compact && rawlsStage === 3 ? `${item}: Açıklandı` : `${item}: ?`}
                </text>
              </g>
            ))}

            {/* Center: Translucent Veil Curtain & Maximin Choice */}
            <rect
              x="295"
              y="62"
              width="210"
              height="248"
              rx="14"
              fill={!compact && rawlsStage === 2 ? "#24463c" : "#2f5348"}
              stroke="#b58a45"
              strokeWidth={!compact && rawlsStage === 2 ? "4" : "2.5"}
            />
            <path d="M295 100 Q400 130 505 100" fill="none" stroke="#e1c28c" strokeWidth="4" />
            <text x="400" y="92" textAnchor="middle" fill="#f5e7c9" fontSize="16" fontWeight="700">
              Başlangıç Durumu (§24)
            </text>
            <text x="400" y="155" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="600">
              Açık Genel Bilgiler:
            </text>
            <text x="400" y="180" textAnchor="middle" fill="#d7e2dc" fontSize="13">
              Toplum ve ekonomi yasaları
            </text>
            <rect x="318" y="205" width="164" height="82" rx="10" fill="rgba(255,255,255,0.09)" stroke="rgba(225,194,140,0.45)" />
            <text x="400" y="236" textAnchor="middle" fill="#e1c28c" fontSize="15" fontWeight="700">
              Tarafsız Seçim Ölçütü
            </text>
            <text x="400" y="264" textAnchor="middle" fill="#ffffff" fontSize="13">
              En kötü konumu güvenceye al
            </text>

            {/* Right column: Chosen principles */}
            <rect
              x="540"
              y="62"
              width="210"
              height="248"
              rx="14"
              fill={!compact && rawlsStage === 3 ? "#eaf4ef" : "#fffdf8"}
              stroke={!compact && rawlsStage === 3 ? "#24463c" : "#8d9b8f"}
              strokeWidth={!compact && rawlsStage === 3 ? "4" : "2.5"}
            />
            <text x="645" y="96" textAnchor="middle" fill="#24463c" fontSize="17" fontWeight="700">
              Seçilen İlkeler
            </text>
            <rect x="560" y="118" width="170" height="74" rx="9" fill="#f7faf7" stroke="#c8dad0" strokeWidth="2" />
            <text x="645" y="148" textAnchor="middle" fill="#24463c" fontSize="14" fontWeight="700">
              1. Eşit Temel Özgürlükler
            </text>
            <text x="645" y="172" textAnchor="middle" fill="#5b6962" fontSize="12">
              Herkes için eşit hak güvencesi
            </text>
            <rect x="560" y="208" width="170" height="82" rx="9" fill="#f7faf7" stroke="#c8dad0" strokeWidth="2" />
            <text x="645" y="238" textAnchor="middle" fill="#24463c" fontSize="14" fontWeight="700">
              2. Fırsat Eşitliği & Fark İlkesi
            </text>
            <text x="645" y="262" textAnchor="middle" fill="#5b6962" fontSize="12">
              Eşitsizlik en dezavantajlının
            </text>
            <text x="645" y="278" textAnchor="middle" fill="#5b6962" fontSize="12">
              yararına ise meşrudur
            </text>

            <path
              d="M262 186 H290 M508 186 H536"
              stroke="#9a7841"
              strokeWidth="4"
              markerEnd={`url(#visual-arrow-${kind}-${compact ? "c" : "f"})`}
            />
            <text x="400" y="368" textAnchor="middle" fill="#385447" fontSize="20" fontWeight="700">
              {!compact && rawlsStage === 1
                ? "Kendi konumunu bilmeyen kişi ayrıcalık kuramaz"
                : !compact && rawlsStage === 2
                  ? "Maximin: Herhangi bir konumda yaşanabilir kurallar seç"
                  : "Peçe kalktığında ilkeler herkes için bağlayıcı kalır"}
            </text>
          </>
        )}

        {kind === "circle-enlargement" && (
          <>
            {/* Outer cosmic philosophical horizon */}
            <circle
              cx="400"
              cy="195"
              r={!compact && russellStage === 3 ? 168 : 148}
              fill={!compact && russellStage === 3 ? "#e2efe8" : "#f1ede2"}
              stroke={!compact && russellStage === 3 ? "#24463c" : "#b8b0a0"}
              strokeWidth={!compact && russellStage === 3 ? "4" : "2"}
              strokeDasharray={!compact && russellStage === 1 ? "8 6" : undefined}
            />
            <text x="400" y="72" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Felsefi Sorgulama Ufku (Evren, Değer, Hakikat)
            </text>

            {/* Middle inquiry ring */}
            <circle
              cx="400"
              cy="200"
              r="102"
              fill={!compact && russellStage === 2 ? "#f9f1df" : "#fffdf8"}
              stroke={!compact && russellStage === 2 ? "#b58a45" : "#8d9b8f"}
              strokeWidth={!compact && russellStage === 2 ? "4" : "2"}
            />
            <text x="400" y="124" textAnchor="middle" fill="#7c5d2c" fontSize="14" fontWeight="700">
              Merak · Şüphe · “Neden?” Soruları
            </text>

            {/* Inner narrow circle of private practical interests */}
            <circle
              cx="400"
              cy="210"
              r="58"
              fill={!compact && russellStage === 1 ? "#24463c" : "#3a5b50"}
              stroke="#9a7841"
              strokeWidth="3"
            />
            <text x="400" y="206" textAnchor="middle" fill="#fffdf8" fontSize="14" fontWeight="700">
              Dar Çıkar
            </text>
            <text x="400" y="226" textAnchor="middle" fill="#d9e4de" fontSize="12">
              Çemberi
            </text>

            {(!compact && russellStage >= 2) && (
              <path
                d="M458 210 H530 M342 210 H270"
                stroke="#9a7841"
                strokeWidth="4"
                markerEnd={`url(#visual-arrow-${kind}-${compact ? "c" : "f"})`}
              />
            )}

            <text x="400" y="388" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">
              {!compact && russellStage === 1
                ? "Yalnızca gündelik alışkanlıklar içinde kalan dar çember"
                : !compact && russellStage === 2
                  ? "Felsefi soru, kesin sayılan kabulleri sarsarak ufku açar"
                  : "Zihin önyargılardan arındıkça benlik ve dünya genişler"}
            </text>
          </>
        )}

        {kind === "brillo-boxes" && (
          <>
            {/* Left: Supermarket Storeroom Box */}
            <rect
              x="70"
              y="72"
              width="255"
              height="240"
              rx="14"
              fill={!compact && dantoStage === 1 ? "#f8f3e8" : "#fffdf8"}
              stroke={!compact && dantoStage === 1 ? "#9a7841" : "#c7d0c9"}
              strokeWidth={!compact && dantoStage === 1 ? "3.5" : "2"}
            />
            <text x="197" y="102" textAnchor="middle" fill="#5b6962" fontSize="15" fontWeight="700">
              Süpermarket Deposu
            </text>
            <rect x="137" y="128" width="120" height="110" rx="8" fill="#ffffff" stroke="#24463c" strokeWidth="3" />
            <rect x="145" y="142" width="104" height="24" fill="#b44332" />
            <rect x="145" y="176" width="104" height="24" fill="#2c4b68" />
            <text x="197" y="274" textAnchor="middle" fill="#25352f" fontSize="15" fontWeight="700">
              Sıradan Ticari Kutu
            </text>
            <text x="197" y="295" textAnchor="middle" fill="#6b7771" fontSize="12">
              Fiziksel biçim özdeş
            </text>

            {/* Center: Theory / Artworld Bridge */}
            <rect
              x="348"
              y="138"
              width="104"
              height="100"
              rx="12"
              fill={!compact && dantoStage === 2 ? "#24463c" : "#355a4e"}
              stroke="#e1c28c"
              strokeWidth={!compact && dantoStage === 2 ? "4" : "2"}
            />
            <text x="400" y="176" textAnchor="middle" fill="#f7eed9" fontSize="14" fontWeight="700">
              Sanat
            </text>
            <text x="400" y="196" textAnchor="middle" fill="#f7eed9" fontSize="14" fontWeight="700">
              Dünyası
            </text>
            <text x="400" y="218" textAnchor="middle" fill="#d9c08f" fontSize="11">
              Kuram & Tarih
            </text>

            {/* Right: Gallery Pedestal Box */}
            <rect
              x="475"
              y="72"
              width="255"
              height="240"
              rx="14"
              fill={!compact && dantoStage === 3 ? "#ebf4ef" : "#fffdf8"}
              stroke={!compact && dantoStage === 3 ? "#24463c" : "#c7d0c9"}
              strokeWidth={!compact && dantoStage === 3 ? "4" : "2"}
            />
            <text x="602" y="102" textAnchor="middle" fill="#24463c" fontSize="15" fontWeight="700">
              Sanat Galerisi Kaidesi
            </text>
            <rect x="542" y="128" width="120" height="110" rx="8" fill="#ffffff" stroke="#24463c" strokeWidth="3" />
            <rect x="550" y="142" width="104" height="24" fill="#b44332" />
            <rect x="550" y="176" width="104" height="24" fill="#2c4b68" />
            <rect x="526" y="238" width="152" height="14" rx="4" fill="#d9d2c3" />
            <text x="602" y="274" textAnchor="middle" fill="#24463c" fontSize="15" fontWeight="700">
              Warhol: Brillo Kutusu
            </text>
            <text x="602" y="295" textAnchor="middle" fill="#6b7771" fontSize="12">
              Sanatsal kimlik ve yorum
            </text>

            <text x="400" y="374" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">
              {!compact && dantoStage === 1
                ? "Gözle bakıldığında iki nesne arasında hiçbir fark yoktur"
                : !compact && dantoStage === 2
                  ? "Gözün görmediği sanat kuramı ve tarih nesneyi dönüştürür"
                  : "Estetik yargı yalnızca biçime mi, yoksa anlama da mı dayanır?"}
            </text>
          </>
        )}

        {kind === "euthyphro-dilemma" && (
          <>
            <rect x="240" y="34" width="320" height="58" rx="12" fill="#24463c" />
            <text x="400" y="68" textAnchor="middle" fill="#fffdf8" fontSize="18" fontWeight="700">
              Sokrates'in Sorusu (Euthyphron 10a)
            </text>
            <path d="M400 92 V132 M400 132 L210 172 M400 132 L590 172" stroke="#9a7841" strokeWidth="4" fill="none" />

            {/* Horn 1 */}
            <rect
              x="60"
              y="172"
              width="300"
              height="140"
              rx="14"
              fill={!compact && euthyphroStage === 2 ? "#f9f1df" : "#fffdf8"}
              stroke={!compact && euthyphroStage === 2 ? "#b58a45" : "#8d9b8f"}
              strokeWidth={!compact && euthyphroStage === 2 ? "4" : "2.5"}
            />
            <text x="210" y="206" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              1. Boynuz: İyidir çünkü...
            </text>
            <text x="210" y="234" textAnchor="middle" fill="#385447" fontSize="15" fontWeight="700">
              Zaten iyi olduğu için sevilir
            </text>
            <text x="210" y="264" textAnchor="middle" fill="#6b7771" fontSize="13">
              İyilik ölçütü iradeden önce
            </text>
            <text x="210" y="284" textAnchor="middle" fill="#6b7771" fontSize="13">
              ve akılla kavranabilir
            </text>

            {/* Horn 2 */}
            <rect
              x="440"
              y="172"
              width="300"
              height="140"
              rx="14"
              fill={!compact && euthyphroStage === 3 ? "#eaf3ee" : "#fffdf8"}
              stroke={!compact && euthyphroStage === 3 ? "#24463c" : "#8d9b8f"}
              strokeWidth={!compact && euthyphroStage === 3 ? "4" : "2.5"}
            />
            <text x="590" y="206" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              2. Boynuz: İyidir çünkü...
            </text>
            <text x="590" y="234" textAnchor="middle" fill="#385447" fontSize="15" fontWeight="700">
              Sevildiği / emredildiği için iyidir
            </text>
            <text x="590" y="264" textAnchor="middle" fill="#6b7771" fontSize="13">
              İyiliğin dış ölçütü yoktur;
            </text>
            <text x="590" y="284" textAnchor="middle" fill="#6b7771" fontSize="13">
              keyfîlik itirazına açık mı?
            </text>

            <text x="400" y="372" textAnchor="middle" fill="#385447" fontSize="18" fontWeight="700">
              {!compact && euthyphroStage === 1
                ? "Değerin kaynağı ilahi irade mi, yoksa iyinin kendi özü müdür?"
                : !compact && euthyphroStage === 2
                  ? "1. Seçenek: Akıl iyiliği ilahi emirden bağımsız tanıyabilir"
                  : "2. Seçenek: İyi, yalnızca buyruğun kendisiyle tanımlanır"}
            </text>
          </>
        )}

        {kind === "black-swan" && (
          <>
            {/* Left: White swans inductive accumulation */}
            <rect
              x="54"
              y="68"
              width="320"
              height="236"
              rx="14"
              fill={!compact && popperStage === 1 ? "#f9f1df" : "#fffdf8"}
              stroke={!compact && popperStage === 1 ? "#b58a45" : "#8d9b8f"}
              strokeWidth={!compact && popperStage === 1 ? "4" : "2.5"}
            />
            <text x="214" y="102" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Tümevarım Gözlemleri
            </text>
            {[0, 1, 2, 3].map((idx) => (
              <g key={idx} transform={`translate(${94 + idx * 64} 152)`}>
                <ellipse cx="22" cy="24" rx="22" ry="14" fill="#ffffff" stroke="#8d9b8f" strokeWidth="2.5" />
                <path d="M36 18 Q44 0 36 -8 Q30 -8 32 -2" fill="none" stroke="#8d9b8f" strokeWidth="3" strokeLinecap="round" />
              </g>
            ))}
            <text x="214" y="232" textAnchor="middle" fill="#385447" fontSize="15" fontWeight="700">
              “Bütün kuğular beyazdır”
            </text>
            <text x="214" y="258" textAnchor="middle" fill="#6b7771" fontSize="13">
              10.000 beyaz kuğu genel kuralı
            </text>
            <text x="214" y="276" textAnchor="middle" fill="#6b7771" fontSize="13">
              mantıksal olarak kesinler mi?
            </text>

            {/* Right: Single Black Swan refutation */}
            <rect
              x="426"
              y="68"
              width="320"
              height="236"
              rx="14"
              fill={!compact && popperStage >= 2 ? "#ebf3ee" : "#fffdf8"}
              stroke={!compact && popperStage >= 2 ? "#24463c" : "#8d9b8f"}
              strokeWidth={!compact && popperStage >= 2 ? "4" : "2.5"}
            />
            <text x="586" y="102" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Aykırı Tek Örnek (Yanlışlama)
            </text>
            <g transform="translate(556 146)">
              <ellipse cx="30" cy="30" rx="30" ry="18" fill="#1b2622" />
              <path d="M50 22 Q60 -2 48 -12 Q40 -12 43 -4" fill="none" stroke="#1b2622" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="49" cy="-9" r="3" fill="#b44332" />
            </g>
            <text x="586" y="232" textAnchor="middle" fill="#9c3f2e" fontSize="15" fontWeight="700">
              Tek Siyah Kuğu → Yasa Çürür
            </text>
            <text x="586" y="258" textAnchor="middle" fill="#5b6962" fontSize="13">
              Bilimsel önerme: Çürütme deneyine
            </text>
            <text x="586" y="276" textAnchor="middle" fill="#5b6962" fontSize="13">
              ilkece açık olmalıdır (Popper)
            </text>

            <path
              d="M378 186 H422"
              stroke="#9a7841"
              strokeWidth="4"
              markerEnd={`url(#visual-arrow-${kind}-${compact ? "c" : "f"})`}
            />
            <text x="400" y="368" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">
              {!compact && popperStage === 1
                ? "Tümevarım hiçbir zaman tam kesinlik sağlamaz"
                : !compact && popperStage === 2
                  ? "Doğrulama ile yanlışlama arasında mantıksal bakışımsızlık vardır"
                  : "Yanlışlanabilir olmayan iddia bilim dışı (sözdebilim) kalır"}
            </text>
          </>
        )}

        {kind === "niebla-mist" && (
          <>
            {/* Author Frame */}
            <rect
              x="65"
              y="68"
              width="270"
              height="242"
              rx="14"
              fill={!compact && unamunoStage === 1 ? "#f9f1df" : "#fffdf8"}
              stroke={!compact && unamunoStage === 1 ? "#b58a45" : "#8d9b8f"}
              strokeWidth={!compact && unamunoStage === 1 ? "4" : "2.5"}
            />
            <text x="200" y="102" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Yazar (Miguel de Unamuno)
            </text>
            <rect x="115" y="128" width="170" height="96" rx="10" fill="#f3eee2" stroke="#c7b898" strokeWidth="2" />
            <text x="200" y="166" textAnchor="middle" fill="#385447" fontSize="14" fontWeight="700">
              “Sen benim kurgumda
            </text>
            <text x="200" y="188" textAnchor="middle" fill="#385447" fontSize="14" fontWeight="700">
              yaşayan bir karaktersin.”
            </text>
            <text x="200" y="264" textAnchor="middle" fill="#6b7771" fontSize="13">
              Anlatıcı / Yaratıcı Otorite
            </text>

            {/* Character Revolt Frame */}
            <rect
              x="465"
              y="68"
              width="270"
              height="242"
              rx="14"
              fill={!compact && unamunoStage >= 2 ? "#eaf3ee" : "#fffdf8"}
              stroke={!compact && unamunoStage >= 2 ? "#24463c" : "#8d9b8f"}
              strokeWidth={!compact && unamunoStage >= 2 ? "4" : "2.5"}
            />
            <text x="600" y="102" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Karakter (Augusto Pérez)
            </text>
            <rect x="515" y="128" width="170" height="96" rx="10" fill="#24463c" />
            <text x="600" y="166" textAnchor="middle" fill="#fffdf8" fontSize="14" fontWeight="700">
              “Ya siz de bir başkasının
            </text>
            <text x="600" y="188" textAnchor="middle" fill="#e1c28c" fontSize="14" fontWeight="700">
              düşlediği bir karakterseniz?”
            </text>
            <text x="600" y="264" textAnchor="middle" fill="#6b7771" fontSize="13">
              Üstkurmaca ve Varoluş Sorusu
            </text>

            <path d="M342 182 H458" stroke="#9a7841" strokeWidth="4" strokeDasharray="7 5" />
            <circle cx="400" cy="182" r="24" fill="#9a7841" />
            <text x="400" y="188" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
              31. Böl.
            </text>

            <text x="400" y="368" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">
              {!compact && unamunoStage === 1
                ? "Augusto, yazgısı yazar tarafından belirlenen bir kurgu karakteridir"
                : !compact && unamunoStage === 2
                  ? "Bölüm 31: Karakter kendi varoluşu için yazarıyla tartışır"
                  : "Edebiyat, gerçeklik ve özgür irade sorularını somutlaştırır"}
            </text>
          </>
        )}

        {kind === "sisyphus-boulder" && (
          <>
            {/* Mountain Slope */}
            <path d="M60 315 L440 85 L740 315 Z" fill="#dcd6c6" stroke="#9a7841" strokeWidth="3" />
            {/* Boulder */}
            <circle
              cx={!compact && camusStage === 1 ? 375 : !compact && camusStage === 2 ? 435 : 220}
              cy={!compact && camusStage === 1 ? 124 : !compact && camusStage === 2 ? 96 : 230}
              r="34"
              fill="#6d6456"
              stroke="#3b362e"
              strokeWidth="3"
            />
            {/* Sisyphus figure */}
            <g
              transform={`translate(${!compact && camusStage === 1 ? 315 : !compact && camusStage === 2 ? 320 : 280} ${!compact && camusStage === 1 ? 132 : !compact && camusStage === 2 ? 125 : 190})`}
            >
              <circle cx="0" cy="-16" r="13" fill="#24463c" />
              <path d="M0 -3 V32 M0 10 L18 2 M0 32 L-10 52 M0 32 L12 52" stroke="#24463c" strokeWidth="7" strokeLinecap="round" />
            </g>

            {/* Stage Badges */}
            <rect
              x="510"
              y="62"
              width="245"
              height="182"
              rx="14"
              fill="#fffdf8"
              stroke="#b58a45"
              strokeWidth="2.5"
            />
            <text x="632" y="96" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Absürd Gerilim (Camus)
            </text>
            <text x="632" y="132" textAnchor="middle" fill="#385447" fontSize="14" fontWeight="700">
              İnsanın Anlam Arayışı
            </text>
            <text x="632" y="158" textAnchor="middle" fill="#9a7841" fontSize="18" fontWeight="700">
              ↕
            </text>
            <text x="632" y="182" textAnchor="middle" fill="#385447" fontSize="14" fontWeight="700">
              Dünyanın Sessizliği
            </text>
            <text x="632" y="218" textAnchor="middle" fill="#5b6962" fontSize="12">
              Anlam verili değil, bilinçli
            </text>
            <text x="632" y="234" textAnchor="middle" fill="#5b6962" fontSize="12">
              duruşla kurulur
            </text>

            <text x="400" y="372" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">
              {!compact && camusStage === 1
                ? "1. Zirveye itilen kaya her seferinde aşağı yuvarlanır"
                : !compact && camusStage === 2
                  ? "2. Yokuş aşağı iniş anı: Bilinçli farkındalık ve kaderi tanıma"
                  : "3. Sonuca değil, yaşamın kendisine sahip çıkan özgür duruş"}
            </text>
          </>
        )}

        {kind === "achilles-tortoise" && (
          <>
            {/* Column 1: Premises A & B */}
            <rect
              x="54"
              y="62"
              width="225"
              height="245"
              rx="14"
              fill={!compact && carrollStage === 1 ? "#f9f1df" : "#fffdf8"}
              stroke={!compact && carrollStage === 1 ? "#b58a45" : "#8d9b8f"}
              strokeWidth={!compact && carrollStage === 1 ? "4" : "2.5"}
            />
            <text x="166" y="96" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Kabul Edilen Öncüller
            </text>
            <rect x="74" y="114" width="185" height="72" rx="9" fill="#f3eee2" stroke="#c7b898" />
            <text x="166" y="142" textAnchor="middle" fill="#24463c" fontSize="14" fontWeight="700">
              (A) Aynı şeye eşit olanlar
            </text>
            <text x="166" y="164" textAnchor="middle" fill="#5b6962" fontSize="13">
              birbirine eşittir
            </text>
            <rect x="74" y="200" width="185" height="76" rx="9" fill="#f3eee2" stroke="#c7b898" />
            <text x="166" y="230" textAnchor="middle" fill="#24463c" fontSize="14" fontWeight="700">
              (B) Bu iki kenar aynı
            </text>
            <text x="166" y="252" textAnchor="middle" fill="#5b6962" fontSize="13">
              doğruya eşittir
            </text>

            {/* Column 2: Infinite Conditional Regress */}
            <rect
              x="312"
              y="62"
              width="210"
              height="245"
              rx="14"
              fill={!compact && carrollStage === 2 ? "#f9efe9" : "#fffdf8"}
              stroke={!compact && carrollStage === 2 ? "#a34b37" : "#8d9b8f"}
              strokeWidth={!compact && carrollStage === 2 ? "4" : "2.5"}
            />
            <text x="417" y="96" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Ara Koşul Tuzağı
            </text>
            {[
              "(C) Eğer A ve B ise Z",
              "(D) Eğer A, B, C ise Z",
              "(E) Eğer A..D ise Z",
              "⋮ Sonsuz Gerileme",
            ].map((step, i) => (
              <g key={step}>
                <rect x="330" y={114 + i * 44} width="174" height="34" rx="8" fill={i === 3 ? "#f5e3de" : "#faf7ef"} stroke="#d5c6b0" />
                <text x="417" y={136 + i * 44} textAnchor="middle" fill={i === 3 ? "#9c3f2e" : "#385447"} fontSize="12.5" fontWeight="700">
                  {step}
                </text>
              </g>
            ))}

            {/* Column 3: Conclusion Z & Rule of Inference */}
            <rect
              x="554"
              y="62"
              width="192"
              height="245"
              rx="14"
              fill={!compact && carrollStage === 3 ? "#eaf3ee" : "#fffdf8"}
              stroke={!compact && carrollStage === 3 ? "#24463c" : "#8d9b8f"}
              strokeWidth={!compact && carrollStage === 3 ? "4" : "2.5"}
            />
            <text x="650" y="96" textAnchor="middle" fill="#24463c" fontSize="16" fontWeight="700">
              Sonuç ve Kural
            </text>
            <rect x="572" y="118" width="156" height="84" rx="10" fill="#24463c" />
            <text x="650" y="148" textAnchor="middle" fill="#e1c28c" fontSize="14" fontWeight="700">
              (Z) Zorunlu Sonuç
            </text>
            <text x="650" y="172" textAnchor="middle" fill="#ffffff" fontSize="12.5">
              İki kenar birbirine eşittir
            </text>
            <rect x="572" y="216" width="156" height="72" rx="10" fill="#edf5f1" stroke="#3d7360" />
            <text x="650" y="244" textAnchor="middle" fill="#24463c" fontSize="13" fontWeight="700">
              Çıkarım Kuralı
            </text>
            <text x="650" y="266" textAnchor="middle" fill="#5b6962" fontSize="12">
              Öncül değil, akıl yürütme adımı
            </text>

            <path
              d="M282 186 H308 M525 186 H550"
              stroke="#9a7841"
              strokeWidth="4"
              markerEnd={`url(#visual-arrow-${kind}-${compact ? "c" : "f"})`}
            />

            <text x="400" y="368" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">
              {!compact && carrollStage === 1
                ? "1. Kaplumbağa A ve B öncüllerini kabul eder ama Z sonucunu kabul etmez"
                : !compact && carrollStage === 2
                  ? "2. Her kuralı yeni bir öncüle çevirmek sonuca ulaşmayı imkânsız kılar"
                  : "3. Geçerli argüman için öncül yanında çıkarım kuralını uygulamak gerekir"}
            </text>
          </>
        )}
      </svg>

      {!compact && (
        <div className="thought-visual-controls" role="region" aria-label="Görsel etkileşim denetimleri">
          <div className="thought-visual-controls-head">
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Sınıf içi etkileşimli şema</span>
          </div>

          {kind === "beetle-box" && (
            <div className="thought-visual-btn-row">
              <button
                type="button"
                className={!beetleRevealed ? "is-active" : ""}
                aria-pressed={!beetleRevealed}
                onClick={() => setBeetleRevealed(false)}
              >
                Kutular Kapalı (Ortak Sözcük)
              </button>
              <button
                type="button"
                className={beetleRevealed ? "is-active" : ""}
                aria-pressed={beetleRevealed}
                onClick={() => setBeetleRevealed(true)}
              >
                Özel İçerikleri Varsay
              </button>
            </div>
          )}

          {kind === "theseus-ship" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((step) => (
                <button
                  key={step}
                  type="button"
                  className={theseusStep === step ? "is-active" : ""}
                  aria-pressed={theseusStep === step}
                  onClick={() => setTheseusStep(step)}
                >
                  {step === 1
                    ? "1. Başlangıç Gemisi"
                    : step === 2
                      ? "2. Parçalar Yenilenir"
                      : "3. Eski Parçalardan 2. Gemi"}
                </button>
              ))}
            </div>
          )}

          {kind === "plato-cave" && (
            <>
              <div className="thought-visual-btn-row">
                {(
                  [
                    { id: "all", label: "Tüm Alegori" },
                    { id: "shadows", label: "Gölgeler ve Mahkûmlar" },
                    { id: "fire", label: "Ateş ve Nesneler" },
                    { id: "exit", label: "Çıkış ve Güneş" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={platoFocus === item.id ? "is-active" : ""}
                    aria-pressed={platoFocus === item.id}
                    onClick={() => setPlatoFocus(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="thought-visual-hint">{platoHint[platoFocus]}</p>
            </>
          )}

          {kind === "trolley-dilemma" && (
            <div className="thought-visual-btn-row">
              <button
                type="button"
                className={trolleyVariant === "switch" ? "is-active" : ""}
                aria-pressed={trolleyVariant === "switch"}
                onClick={() => setTrolleyVariant("switch")}
              >
                Makas Kolu (1967–1976)
              </button>
              <button
                type="button"
                className={trolleyVariant === "bridge" ? "is-active" : ""}
                aria-pressed={trolleyVariant === "bridge"}
                onClick={() => {
                  setTrolleyVariant("bridge");
                  setTrolleyTrack("neutral");
                }}
              >
                Üst Geçit Varyantı (1976)
              </button>
              {trolleyVariant === "switch" && (
                <>
                  <button
                    type="button"
                    className={trolleyTrack === "intervene" ? "is-active" : ""}
                    aria-pressed={trolleyTrack === "intervene"}
                    onClick={() => setTrolleyTrack(trolleyTrack === "intervene" ? "neutral" : "intervene")}
                  >
                    Yön Değiştir (1)
                  </button>
                  <button
                    type="button"
                    className={trolleyTrack === "stay" ? "is-active" : ""}
                    aria-pressed={trolleyTrack === "stay"}
                    onClick={() => setTrolleyTrack(trolleyTrack === "stay" ? "neutral" : "stay")}
                  >
                    Müdahale Etme (5)
                  </button>
                </>
              )}
            </div>
          )}

          {kind === "last-human" && (
            <div className="thought-visual-btn-row">
              <button
                type="button"
                className={!lastHumanAfter ? "is-active" : ""}
                aria-pressed={!lastHumanAfter}
                onClick={() => setLastHumanAfter(false)}
              >
                Son İnsan Mevcut
              </button>
              <button
                type="button"
                className={lastHumanAfter ? "is-active" : ""}
                aria-pressed={lastHumanAfter}
                onClick={() => setLastHumanAfter(true)}
              >
                İnsan Sonrası Ekosistem
              </button>
            </div>
          )}

          {kind === "chinese-room" && (
            <div className="thought-visual-btn-row">
              {(
                [
                  { step: 1, label: "1. Sembol Girdisi" },
                  { step: 2, label: "2. Kural Kitabı" },
                  { step: 3, label: "3. Çıktı Üret" },
                ] as const
              ).map((item) => (
                <button
                  key={item.step}
                  type="button"
                  className={chineseStep === item.step ? "is-active" : ""}
                  aria-pressed={chineseStep === item.step}
                  onClick={() => setChineseStep(item.step)}
                >
                  {item.label}
                </button>
              ))}
              {chineseStep > 0 && (
                <button type="button" onClick={() => setChineseStep(0)}>
                  <RotateCcw size={13} aria-hidden="true" /> Sıfırla
                </button>
              )}
            </div>
          )}

          {kind === "pascals-wager" && (
            <>
              <div className="thought-visual-btn-row">
                {[
                  { id: "believe-true", label: "İnanmak · Varsayım Doğru" },
                  { id: "believe-false", label: "İnanmak · Varsayım Yanlış" },
                  { id: "doubt-true", label: "İnanmamak · Varsayım Doğru" },
                  { id: "doubt-false", label: "İnanmamak · Varsayım Yanlış" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={pascalCell === item.id ? "is-active" : ""}
                    aria-pressed={pascalCell === item.id}
                    onClick={() => setPascalCell(pascalCell === item.id ? null : item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {pascalCell && <p className="thought-visual-hint">{pascalDetails[pascalCell]}</p>}
            </>
          )}

          {kind === "antigone" && (
            <>
              <div className="thought-visual-btn-row">
                {(
                  [
                    { id: "conflict", label: "Çatışma Genel Görünüm" },
                    { id: "antigone", label: "Antigone Perspektifi" },
                    { id: "creon", label: "Kreon Perspektifi" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={antigoneFocus === item.id ? "is-active" : ""}
                    aria-pressed={antigoneFocus === item.id}
                    onClick={() => setAntigoneFocus(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="thought-visual-hint">{antigoneHint[antigoneFocus]}</p>
            </>
          )}

          {kind === "veil-of-ignorance" && (
            <>
              <div className="thought-visual-btn-row">
                {(
                  [
                    { stage: 1, label: "1. Peçe Arkası (Gizlenenler)" },
                    { stage: 2, label: "2. Tarafsız Karar (Maximin)" },
                    { stage: 3, label: "3. Peçe Kalkınca" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.stage}
                    type="button"
                    className={rawlsStage === item.stage ? "is-active" : ""}
                    aria-pressed={rawlsStage === item.stage}
                    onClick={() => setRawlsStage(item.stage)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="thought-visual-hint">
                {rawlsStage === 1
                  ? "Taraflar sınıf, servet, yetenek ve kişisel iyi anlayışını bilmez; yalnızca toplumların genel işleyişini bilir."
                  : rawlsStage === 2
                    ? "En kötü konuma düşme ihtimaline karşı herkes temel hakları ve en dezavantajlı kesimi koruyan ilkeleri seçer."
                    : "Peçe kalkıp roller belli olduğunda üzerinde uzlaşılan adalet ilkeleri tüm toplum için geçerli kalır."}
              </p>
            </>
          )}

          {kind === "circle-enlargement" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={russellStage === stage ? "is-active" : ""}
                  aria-pressed={russellStage === stage}
                  onClick={() => setRussellStage(stage)}
                >
                  {stage === 1
                    ? "1. Dar Çıkar Çemberi"
                    : stage === 2
                      ? "2. Merak ve Şüphe"
                      : "3. Büyüyen Düşünce Ufku"}
                </button>
              ))}
            </div>
          )}

          {kind === "brillo-boxes" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={dantoStage === stage ? "is-active" : ""}
                  aria-pressed={dantoStage === stage}
                  onClick={() => setDantoStage(stage)}
                >
                  {stage === 1
                    ? "1. Algısal Özdeşlik"
                    : stage === 2
                      ? "2. Sanat Dünyası"
                      : "3. Estetik Yargı"}
                </button>
              ))}
            </div>
          )}

          {kind === "euthyphro-dilemma" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={euthyphroStage === stage ? "is-active" : ""}
                  aria-pressed={euthyphroStage === stage}
                  onClick={() => setEuthyphroStage(stage)}
                >
                  {stage === 1
                    ? "1. İkilemin Kökü (10a)"
                    : stage === 2
                      ? "2. İlk Boynuz"
                      : "3. İkinci Boynuz"}
                </button>
              ))}
            </div>
          )}

          {kind === "black-swan" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={popperStage === stage ? "is-active" : ""}
                  aria-pressed={popperStage === stage}
                  onClick={() => setPopperStage(stage)}
                >
                  {stage === 1
                    ? "1. Beyaz Kuğular (Tümevarım)"
                    : stage === 2
                      ? "2. Tek Siyah Kuğu"
                      : "3. Bilim / Sözdebilim Sınırı"}
                </button>
              ))}
            </div>
          )}

          {kind === "niebla-mist" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={unamunoStage === stage ? "is-active" : ""}
                  aria-pressed={unamunoStage === stage}
                  onClick={() => setUnamunoStage(stage)}
                >
                  {stage === 1
                    ? "1. Kurgu Karakteri"
                    : stage === 2
                      ? "2. Yazar ile Yüzleşme"
                      : "3. Gerçeklik ve Okur"}
                </button>
              ))}
            </div>
          )}

          {kind === "sisyphus-boulder" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={camusStage === stage ? "is-active" : ""}
                  aria-pressed={camusStage === stage}
                  onClick={() => setCamusStage(stage)}
                >
                  {stage === 1
                    ? "1. Sonsuz Tekrar"
                    : stage === 2
                      ? "2. İniş Anı ve Bilinç"
                      : "3. Özgür Duruş"}
                </button>
              ))}
            </div>
          )}

          {kind === "achilles-tortoise" && (
            <div className="thought-visual-btn-row">
              {([1, 2, 3] as const).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={carrollStage === stage ? "is-active" : ""}
                  aria-pressed={carrollStage === stage}
                  onClick={() => setCarrollStage(stage)}
                >
                  {stage === 1
                    ? "1. Öncüller (A ve B)"
                    : stage === 2
                      ? "2. Sonsuz Gerileme (C, D...)"
                      : "3. Çıkarım Kuralı Ayrımı"}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <figcaption>{title}</figcaption>
    </figure>
  );
}
