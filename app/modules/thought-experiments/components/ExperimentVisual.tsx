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
};

export default function ExperimentVisual({ kind, compact = false }: Props) {
  const title = labels[kind];
  return (
    <figure className={`thought-visual thought-visual-${kind}${compact ? " is-compact" : ""}`} role="img" aria-label={title}>
      <svg viewBox="0 0 800 420" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`visual-paper-${kind}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8f5ed"/><stop offset="1" stopColor="#e8eee8"/></linearGradient>
          <linearGradient id={`visual-night-${kind}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1c342e"/><stop offset="1" stopColor="#47685a"/></linearGradient>
          <marker id={`visual-arrow-${kind}`} markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0 0 L0 6 L8 3 z" fill="#9a7841"/></marker>
        </defs>
        <rect x="0" y="0" width="800" height="420" rx="24" fill="url(#visual-paper-${kind})"/>
        {kind === "beetle-box" && <>
          {[0,1,2,3].map((n)=><g key={n} transform={`translate(${82+n*170} 120)`}>
            <rect x="0" y="25" width="125" height="145" rx="12" fill="#fffdf8" stroke="#8d9b8f" strokeWidth="4"/>
            <path d="M-5 25 L62 -5 L132 25" fill="#d9c9a7" stroke="#8d7650" strokeWidth="4"/>
            <path d="M20 92 Q62 62 105 92" fill="none" stroke="#c5cfc7" strokeWidth="3" strokeDasharray="5 7"/>
            <text x="62" y="205" textAnchor="middle" fill="#40594c" fontSize="17" fontWeight="700">Kutu {n+1}</text>
          </g>)}
          <text x="400" y="355" textAnchor="middle" fill="#385447" fontSize="22" fontWeight="700">İçerik özel · Sözcük ortak</text>
        </>}
        {kind === "theseus-ship" && <>
          {[0,1,2].map((n)=><g key={n} transform={`translate(${80+n*245} 112)`}>
            <path d="M0 95 L185 95 L155 150 L35 150 Z" fill={n===1?"#b58a45":"#55786a"} stroke="#29483d" strokeWidth="5"/>
            {[0,1,2,3,4].map((p)=><path key={p} d={`M${28+p*29} 98 v48`} stroke="#e8ddc7" strokeWidth="3"/>)}
            <path d="M90 90 V5 L150 90 Z" fill={n===1?"#d9bd87":"#e6e2d5"} stroke="#405b4e" strokeWidth="4"/>
            <text x="92" y="195" textAnchor="middle" fill="#40594c" fontSize="17" fontWeight="700">{["Başlangıç","Parçalar yenilenir","Eski parçalar"][n]}</text>
          </g>)}
          <path d="M260 190 H305 M505 190 H550" stroke="#9a7841" strokeWidth="4" markerEnd="url(#visual-arrow-${kind})"/>
          <text x="400" y="355" textAnchor="middle" fill="#385447" fontSize="22" fontWeight="700">Aynılık hangi ölçüte dayanır?</text>
        </>}
        {kind === "plato-cave" && <>
          <path d="M35 325 V170 Q45 55 205 45 H595 Q755 55 765 170 V325" fill="#29483d"/>
          <path d="M65 310 V180 Q85 85 220 75 H580 Q715 85 735 180 V310" fill="#45685a"/>
          <circle cx="180" cy="180" r="34" fill="#e2bd75"/>
          <path d="M180 220 L260 300 L100 300 Z" fill="#d9bd87" opacity=".5"/>
          {[0,1,2].map(n=><g key={n}><circle cx={360+n*75} cy="235" r="13" fill="#d9d5c8"/><path d={`M${360+n*75} 250 v45`} stroke="#d9d5c8" strokeWidth="9"/><path d={`M${360+n*75-20} 260 l-15 25 M${360+n*75+20} 260 l15 25`} stroke="#d9d5c8" strokeWidth="7"/></g>)}
          <path d="M650 75 Q700 10 750 75" stroke="#e2bd75" strokeWidth="8" fill="none"/>
          <circle cx="690" cy="55" r="28" fill="#f0cf8b"/>
          <text x="400" y="375" textAnchor="middle" fill="#fff8e9" fontSize="22" fontWeight="700">Gölgeden ışığa · Sanıdan bilgiye</text>
        </>}
        {kind === "trolley-dilemma" && <>
          <path d="M400 70 V175 M400 175 L210 300 M400 175 L620 300" stroke="#536b5d" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <rect x="330" y="45" width="140" height="65" rx="12" fill="#d9bd87" stroke="#8c7043" strokeWidth="4"/>
          <circle cx="355" cy="115" r="12" fill="#344d41"/><circle cx="445" cy="115" r="12" fill="#344d41"/>
          <rect x="130" y="290" width="165" height="60" rx="12" fill="#fffdf8" stroke="#8c9b8e" strokeWidth="3"/>
          <rect x="535" y="290" width="165" height="60" rx="12" fill="#fffdf8" stroke="#8c9b8e" strokeWidth="3"/>
          <text x="212" y="327" textAnchor="middle" fill="#40594c" fontSize="18" fontWeight="700">Müdahale et</text>
          <text x="617" y="327" textAnchor="middle" fill="#40594c" fontSize="18" fontWeight="700">Müdahale etme</text>
          <text x="400" y="390" textAnchor="middle" fill="#385447" fontSize="19" fontWeight="700">Seçim · Sonuç · Sorumluluk</text>
        </>}
        {kind === "last-human" && <>
          <rect x="0" y="0" width="800" height="420" rx="24" fill="url(#visual-night-${kind})"/>
          <circle cx="650" cy="90" r="42" fill="#e3c58c"/>
          {[90,210,560,690].map((x,i)=><g key={x}><path d={`M${x} 300 V${120+(i%2)*40}`} stroke="#b7c8ae" strokeWidth="15"/><circle cx={x} cy={130+(i%2)*40} r="63" fill="#8eaa8e"/><circle cx={x-28} cy={145+(i%2)*40} r="38" fill="#6f947b"/></g>)}
          <path d="M390 310 v-95 M390 240 l-38 -45 M390 240 l40 -45" stroke="#e6d6b8" strokeWidth="12" strokeLinecap="round"/>
          <circle cx="390" cy="190" r="19" fill="#e6d6b8"/>
          <path d="M330 330 Q390 300 450 330" stroke="#d7bd8b" strokeWidth="5" fill="none"/>
          <text x="400" y="385" textAnchor="middle" fill="#f4f1e7" fontSize="21" fontWeight="700">İnsan olmasa da doğanın değeri var mı?</text>
        </>}
        {kind === "chinese-room" && <>
          <rect x="60" y="105" width="170" height="150" rx="16" fill="#fffdf8" stroke="#8b9b8e" strokeWidth="4"/>
          <rect x="315" y="75" width="190" height="210" rx="16" fill="#e7ddc7" stroke="#9a7841" strokeWidth="4"/>
          <rect x="590" y="105" width="150" height="150" rx="16" fill="#fffdf8" stroke="#8b9b8e" strokeWidth="4"/>
          <text x="145" y="165" textAnchor="middle" fill="#40594c" fontSize="22" fontWeight="700">符号</text>
          <text x="145" y="205" textAnchor="middle" fill="#68776e" fontSize="16">Girdi</text>
          <text x="410" y="145" textAnchor="middle" fill="#6f542b" fontSize="19" fontWeight="700">Kural kitabı</text>
          <path d="M365 175 h90 M365 200 h90 M365 225 h90" stroke="#9a7841" strokeWidth="5" strokeLinecap="round"/>
          <text x="665" y="165" textAnchor="middle" fill="#40594c" fontSize="22" fontWeight="700">符号</text>
          <text x="665" y="205" textAnchor="middle" fill="#68776e" fontSize="16">Çıktı</text>
          <path d="M235 180 H300 M510 180 H575" stroke="#9a7841" strokeWidth="5" markerEnd="url(#visual-arrow)"/>
          <text x="400" y="350" textAnchor="middle" fill="#385447" fontSize="22" fontWeight="700">Sembol işlemek ≠ anlamak</text>
        </>}
        {kind === "pascals-wager" && <>
          <rect x="300" y="35" width="200" height="60" rx="12" fill="#29483d"/>
          <text x="400" y="73" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">Tercih</text>
          <path d="M400 95 V145 M400 145 L210 210 M400 145 L590 210" stroke="#9a7841" strokeWidth="4" fill="none"/>
          {["İnanmak","İnanmamak"].map((v,i)=><g key={v}><rect x={105+i*380} y="210" width="210" height="58" rx="12" fill="#e1d2b2" stroke="#9a7841" strokeWidth="3"/><text x={210+i*380} y="246" textAnchor="middle" fill="#4a594f" fontSize="19" fontWeight="700">{v}</text></g>)}
          <path d="M210 268 V305 M590 268 V305" stroke="#9a7841" strokeWidth="3"/>
          <text x="210" y="335" textAnchor="middle" fill="#40594c" fontSize="16">Olası sonuçlar</text><text x="590" y="335" textAnchor="middle" fill="#40594c" fontSize="16">Olası sonuçlar</text>
          <text x="400" y="390" textAnchor="middle" fill="#385447" fontSize="18" fontWeight="700">Pratik tercih, doğruluk kanıtı değildir</text>
        </>}
        {kind === "antigone" && <>
          <rect x="0" y="0" width="800" height="420" rx="24" fill="#efe8da"/>
          <path d="M75 315 V125 H725 V315" stroke="#8d7650" strokeWidth="12" fill="none"/>
          {[150,250,350,450,550,650].map(x=><path key={x} d={`M${x} 130 V315`} stroke="#c4b493" strokeWidth="17"/>)}
          <path d="M85 125 L400 40 L715 125" fill="#d8c7a6" stroke="#8d7650" strokeWidth="8"/>
          <circle cx="290" cy="220" r="28" fill="#9c7354"/><path d="M290 250 v90 M290 270 l-35 45 M290 270 l35 45" stroke="#526d5b" strokeWidth="17" strokeLinecap="round"/>
          <circle cx="520" cy="220" r="28" fill="#6d604e"/><path d="M520 250 v90 M520 270 l-35 45 M520 270 l35 45" stroke="#394c42" strokeWidth="17" strokeLinecap="round"/>
          <text x="290" y="370" textAnchor="middle" fill="#40594c" fontSize="18" fontWeight="700">Antigone · Vicdan</text>
          <text x="520" y="370" textAnchor="middle" fill="#40594c" fontSize="18" fontWeight="700">Kreon · Buyruk</text>
        </>}
      </svg>
      <figcaption>{title}</figcaption>
    </figure>
  );
}
