// Ders-bağımsız BEP sunum uyarlaması: içerik değişmez, yalnızca sunum biçimi uyarlanır.
// Sosyoloji ve Felsefe üreticileri aynı uyarlamayı kullanır; böylece BEP davranışı derslerde ayrışmaz.
export type ExamBepPresentation = { passage: string; text: string; fontSize: number };

export function applyExamBepPresentation(
  mode: string,
  profile: string,
  base: ExamBepPresentation,
  concepts: string,
): ExamBepPresentation {
  let { passage, text, fontSize } = base;
  if (mode !== 'bep') return { passage, text, fontSize };
  switch (profile) {
    case 'reading':
      passage = passage.replaceAll('. ', '.\n\n');
      text = text.replaceAll('. ', '.\n');
      text = `${text}\n1. Örneği bölüm bölüm okuyunuz.\n2. Odağı izleyip yanıtınızı veriniz.`;
      break;
    case 'writing':
      text += '\nYanıtınızı maddelerle veya öğretmeninizin kaydettiği sözlü anlatımla verebilirsiniz. Cümle başlatıcı: Bu örnekte … çünkü …';
      break;
    case 'attention':
      text += '\nÖnce örneği inceleyiniz. Ardından yalnız bu soruya yanıt veriniz. Gerektiğinde öğretmeninizle kısa ara planlayınız.';
      break;
    case 'cognitive':
      text += `\nKavram desteği: ${concepts}. Önce ilgili kavramı seçiniz; ardından örnekle bağlantısını kurunuz.`;
      break;
    case 'visual':
      fontSize = 32;
      break;
    default:
      throw new Error('Geçersiz BEP sunum profili.');
  }
  return { passage, text, fontSize };
}
