"use client";

import { useEffect, useState, useRef } from "react";
import type { ClassWorkspaceContext } from "../../core/class-workspace";
import type { StudentRosterTransfer } from "../../core/student-roster-transfer";
import type { Unit } from "../../data/curriculum";

const HOMEWORK_APP_URL = "https://felsefe-grubu-odev-takip-cloudflare.aytigin.workers.dev";

export default function HomeworkTrackingModule({
  classContext,
  subjectName,
  baseMeta,
  units,
  incomingRoster,
  onResolveRoster,
}: {
  classContext: ClassWorkspaceContext;
  subjectName: string;
  baseMeta: { school: string; academicYear: string; teacher: string; principal: string };
  units: Unit[];
  incomingRoster: StudentRosterTransfer | null;
  onResolveRoster: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearConfirmed, setClearConfirmed] = useState(false);

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
    setError("Ödev takip uygulamas\u0131 y\u00fcklenemedi. L\u00fctfen daha sonra tekrar deneyin.");
  };

  const getIframeSrc = () => {
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
            Uygulamay\u0131 yeni sekmede a\u00e7
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="module-container homework-tracking-module" data-sensitive-session={incomingRoster !== null ? "active" : "inactive"}>
      <div className="module-header">
        <h2>Ödev Takibi</h2>
        <p>
          {classContext.grade}. s\u0131n\u0131f {classContext.branchCode} - {subjectName}
        </p>
        <p className="subtitle">
          {baseMeta.academicYear} \u00f6\u011fretim y\u0131l\u0131
        </p>
      </div>
      
      <div className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            <p>Ödev takip uygulamas\u0131 y\u00fckleniyor...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={getIframeSrc()}
          title="Ödev Takip Uygulamas\u0131"
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
            Bu uygulama FOPOS sistemine g\u00f6m\u00fcl\u00fcl olarak \u00e7al\u0131\u015fmaktad\u0131r. 
            Tam ekran modu i\u00e7in yukar\u0131daki ba\u011flant\u0131y\u0131 kullanabilirsiniz.
          </small>
        </p>
      </div>
    </div>
  );
}
