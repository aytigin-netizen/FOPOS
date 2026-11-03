"use client";

import { useState } from "react";
import type { ClassWorkspaceContext } from "../../core/class-workspace";

const HOMEWORK_APP_URL = "https://felsefe-grubu-odev-takip-cloudflare.aytigin.workers.dev";

export default function HomeworkTrackingModule({
  classContext,
  subjectName,
  baseMeta,
}: {
  classContext: ClassWorkspaceContext;
  subjectName: string;
  baseMeta: { school: string; academicYear: string; teacher: string; principal: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams({
    grade: classContext.grade.toString(),
    branch: classContext.branchCode,
    subject: subjectName,
    school: baseMeta.school,
    academicYear: baseMeta.academicYear,
    teacher: baseMeta.teacher,
    embedded: "true",
    workspaceId: classContext.id,
  });
  const iframeSrc = `${HOMEWORK_APP_URL}/?${params.toString()}`;

  if (error) {
    return (
      <div className="module-container homework-tracking-module">
        <div className="error-state">
          <h2>Ödev Takibi</h2>
          <p className="error-message">{error}</p>
          <a href={HOMEWORK_APP_URL} target="_blank" rel="noopener noreferrer" className="external-link-button">
            Uygulamayı yeni sekmede aç
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="module-container homework-tracking-module">
      <div className="module-header">
        <h2>Ödev Takibi</h2>
        <p>{classContext.grade}. sınıf {classContext.branchCode} - {subjectName}</p>
        <p className="subtitle">{baseMeta.academicYear} öğretim yılı</p>
        <p className="subtitle">Öğrenci listeleri ve ödev kayıtları Cloudflare Ödev Takip uygulamasında yönetilir.</p>
      </div>
      <div className="iframe-container">
        {isLoading && <div className="loading-overlay"><p>Ödev takip uygulaması yükleniyor...</p></div>}
        <iframe
          src={iframeSrc}
          title="Ödev Takip Uygulaması"
          className="homework-iframe"
          onLoad={() => { setIsLoading(false); setError(null); }}
          onError={() => { setIsLoading(false); setError("Ödev takip uygulaması yüklenemedi. Lütfen daha sonra tekrar deneyin."); }}
          allow="clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
      <div className="iframe-footer">
        <p><small>Öğrenci listeleri bu bağımsız uygulamanın kendi hesabında saklanır. FOPOS öğrenci listeleriyle otomatik aktarım veya eşitleme yapılmaz. Tam ekran kullanım için uygulamayı yeni sekmede açabilirsiniz.</small></p>
        <a href={HOMEWORK_APP_URL} target="_blank" rel="noopener noreferrer">Ödev Takip uygulamasını yeni sekmede aç</a>
      </div>
    </div>
  );
}
