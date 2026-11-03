"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { ClassWorkspaceContext } from "../../core/class-workspace";
import type { StudentRosterTransfer } from "../../core/student-roster-transfer";

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
  units: Array<{ code: string; name: string; grade: number; outcomes: Array<{ code: string; short: string }> }>;
  incomingRoster: StudentRosterTransfer | null;
  onResolveRoster: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (incomingRoster) {
      onResolveRoster();
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [incomingRoster, onResolveRoster]);

  if (isLoading) {
    return (
      <div className="module-container">
        <div className="loading-state">
          <p>Ödev Takip uygulaması yükleniyor...</p>
        </div>
      </div>
    );
  }

  const gradeUnits = units.filter(u => u.grade === classContext.grade);
  const unitNames = gradeUnits.map(u => u.name).join(", ");

  return (
    <div className="module-container homework-tracking-module">
      <div className="module-header">
        <h2>Ödev ve Değerlendirme</h2>
        <p>
          {classContext.grade}. sınıf {classContext.branchCode} - {subjectName}
        </p>
        {unitNames && <p className="subtitle">Üniteler: {unitNames}</p>}
        <p className="subtitle">
          {baseMeta.academicYear} öğretim yılı - {baseMeta.school}
        </p>
      </div>
      
      <div className="external-app-container">
        <div className="info-box">
          <h3>⚠️ Entegrasyon Sürecinde</h3>
          <p>
            Ödev takip uygulaması, FOPOS sistemine tam olarak entegre edilmektedir. 
            Şu anda uygulama, dış bir bağlantı olarak erişilebilir durumdadır.
          </p>
        </div>
        
        <a 
          href="https://felsefe-odev-takibi.aytigin.chatgpt.site" 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link-button primary-button"
        >
          Ödev Takip Uygulamasını Aç <ExternalLink size={16} />
        </a>
        
        <div className="features-list">
          <h4>Uygulama Özellikleri:</h4>
          <ul>
            <li>Ödev ve etkinlik takibi</li>
            <li>Öğrenci performans değerlendirmesi</li>
            <li>Felsefe, Psikoloji, Mantık ve Sosyoloji dersleri için özel tasarım</li>
            <li>10. ve 11. sınıf müfredatına uygun</li>
          </ul>
        </div>
        
        <div className="note">
          <p>
            <strong>Not:</strong> Bu modül, FOPOS v47 ile entegre edilme sürecindedir. 
            Yakında tam entegrasyon sağlanacaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
