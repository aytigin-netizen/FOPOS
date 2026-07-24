import Link from "next/link";
import { project } from "@/core/project";
import { philosophyCurricula } from "@/curriculum";
import { moduleCatalog } from "@/modules/module-catalog";

export default function Home() {
  const readyCount = moduleCatalog.filter((item) => item.status === "ready").length;
  const unitCount = Object.values(philosophyCurricula).reduce(
    (total, curriculum) => total + curriculum.units.length,
    0,
  );
  const outcomeCount = Object.values(philosophyCurricula).reduce(
    (total, curriculum) =>
      total +
      curriculum.units.reduce(
        (gradeTotal, unit) => gradeTotal + unit.outcomes.length,
        0,
      ),
    0,
  );

  return (
    <main>
      <header className="hero">
        <span className="eyebrow">OPUS Core alan uygulaması</span>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <div className="summary">
          <span>{project.grades.join(". ve ")}. sınıflar</span>
          <span>{unitCount} ünite</span>
          <span>{outcomeCount} öğrenme çıktısı</span>
          <span>{readyCount} hazır temel</span>
        </div>
      </header>

      <section aria-labelledby="modules-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Modüler ürün mimarisi</span>
            <h2 id="modules-heading">FOPOS çalışma alanları</h2>
          </div>
          <p>İlk iskelet, modülleri ortak OPUS ilkeleri etrafında bağımsız geliştirmeye hazırlar.</p>
        </div>

        <div className="grid">
          {moduleCatalog.map((item) => {
            const content = (
              <>
              <div className="card-topline">
                <span>{item.order.toString().padStart(2, "0")}</span>
                <span className={`status status-${item.status}`}>
                  {item.status === "ready" ? "Temel hazır" : "Planlandı"}
                </span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              {item.status === "ready" && <span className="card-link">Çalışma alanını aç →</span>}
              </>
            );

            const href = item.id === "lesson-studio"
              ? "/studio"
              : item.id === "daily-plan"
                ? "/daily-plan"
                : item.id === "annual-plan"
                  ? "/annual-plan"
                  : item.id === "department-minutes"
                    ? "/department-minutes"
                    : item.id === "exam"
                      ? "/exam-generator"
                      : item.id === "exam-analysis"
                        ? "/exam-analysis"
                        : item.id === "fopos-ai"
                          ? "/fopos-ai"
                          : null;
            return href ? (
              <Link className="card card-clickable" href={href} key={item.id}>
                {content}
              </Link>
            ) : (
              <article className="card" key={item.id}>{content}</article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
