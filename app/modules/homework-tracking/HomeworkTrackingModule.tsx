"use client";

import { useEffect, useState, useRef } from "react";
import type { ClassWorkspaceContext } from "../../core/class-workspace";
import type { StudentRosterTransfer } from "../../core/student-roster-transfer";

const HOMEWORK_APP_URL = "https://felsefe-grubu-odev-takip-cloudflare.aytigin.workers.dev";

export default function HomeworkTrackingModule({
  classContext,
  subjectName,
  baseMeta,
  // units: Array<{ code: string; name: string; grade: number; outcomes: Array<{ code: string; short: string }> }>;
  incomingRoster,
  onResolveRoster,
}: {
  classContext: ClassWorkspaceContext;
  subjectName: string;
  baseMeta: { school: string; academicYear: string; teacher: string; principal: string };
  // units parameter reserved for future use
  incomingRoster: StudentRosterTransfer | null;
  onResolveRoster: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (incomingRoster) {
      onResolveRoster();
    }
  }, [incomingRoster, onResolveRoster]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError("Ödev takip uygulaması yüklenemedi. Lütfen daha sonra tekrar deneyin.");
  };

  // Build query parameters to pass context to the embedded app
  const getIframeSrc = () => {
    const params = new URLSearchParams({
      grade: classContext.grade.toString(),
      branch: classContext.branchCode,
      subject: subjectName,
      school: baseMeta.school,
      academicYear: baseMeta.academicYear,
      teacher: baseMeta.teacher,
      // Add embedded mode flag
      embedded: "true",
      // Pass workspace ID if available
      workspaceId: classContext.id,
    });
    return `${HOMEWORK_APP_URL}/?${params.toString()}`;
  };

  if (error) {
    return (
      <div className="module-container homework-tracking-module">
        <div className="error-state">
          <h2>Ödev Takibi</h2>
          <p className="error-message">{error}</p>
          <a 
            href={HOMEWORK_APP_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link-button"
          >
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
        <p>
          {classContext.grade}. sınıf {classContext.branchCode} - {subjectName}
        </p>
        <p className="subtitle">
          {baseMeta.academicYear} öğretim yılı
        </p>
      </div>
      
      <div className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            <p>Ödev takip uygulaması yükleniyor...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={getIframeSrc()}
          title="Ödev Takip Uygulaması"
          className="homework-iframe"
          onLoad={handleLoad}
          onError={handleError}
          allow="clipboard-write; camera; microphone"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
      
      <div className="iframe-footer">
        <p>
          <small>
            Bu uygulama FOPOS sistemine gömülü olarak çalışmaktadır. 
            Tam ekran modu için yukarıdaki bağlantıyı kullanabilirsiniz.
          </small>
        </p>
      </div>
    </div>
  );
}
