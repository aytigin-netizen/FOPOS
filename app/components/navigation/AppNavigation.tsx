"use client";

import {
  BarChart3, BookOpen, CalendarDays, ChevronLeft, ClipboardCheck, Lightbulb,
  FileText, GraduationCap, Home, ListChecks, Menu, Moon, PanelLeftClose,
  Bot, ChevronDown, Settings, ShieldCheck, Sparkles, Sun, UsersRound, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FoposMark } from "../brand/FoposMark";

export type AppView = "home" | "studio" | "daily" | "annual" | "meeting" | "exam" | "classes" | "rosters" | "analysis" | "performance" | "resources" | "thought-experiments" | "archive" | "ai" | "privacy" | "settings";

const modules = [
  ["home", "Bugün", Home],
  ["studio", "Ders Tasarım Stüdyosu", Sparkles],
  ["daily", "Günlük Plan", FileText],
  ["annual", "Yıllık Plan", CalendarDays],
  ["meeting", "Zümre", UsersRound],
  ["exam", "Sınav", ClipboardCheck],
  ["classes", "Sınıf ve Şubeler", GraduationCap],
  ["rosters", "Öğrenci Listeleri", ListChecks],
  ["analysis", "Sınav Analizi", BarChart3],
  ["ai", "FOPOS AI", Bot],
  ["performance", "Ödev Takibi", ListChecks],
  ["resources", "Kaynak Merkezi", BookOpen],
  ["thought-experiments", "Düşünce Deneyleri", Lightbulb],
] as const;
const groups = [
  { label: "", keys: ["home"] },
  { label: "PLANLAMA", keys: ["studio", "daily", "annual"] },
  { label: "ÖLÇME", keys: ["exam", "analysis", "performance"] },
  { label: "SINIF", keys: ["classes", "rosters", "meeting"] },
  { label: "KAYNAK", keys: ["resources", "thought-experiments", "ai"] },
  { label: "SİSTEM", keys: ["settings"] },
];
// Açılır menü öğelerinin kısa açıklamaları (yalnız arayüz metni).
const descriptions: Record<string, string> = {
  home: "Bugünün dersleri ve hazırlıkların",
  studio: "Müfredattan 80 dakikalık ders akışı",
  daily: "Günlük ders planını hazırla",
  annual: "Yıllık planı ünite ve haftalara göre aç",
  exam: "A/B kitapçıklı sınav oluştur",
  analysis: "Sınav sonuçlarını çözümle",
  performance: "Ödev ve değerlendirme takibi",
  classes: "Sınıf ve şubelerini yönet",
  rosters: "Öğrenci listelerini düzenle",
  meeting: "Zümre toplantı tutanağı hazırla",
  resources: "Müfredat ve kaynak dosyaları",
  "thought-experiments": "Derste kullanılacak düşünce deneyleri",
  ai: "FOPOS AI yardımcısı",
  settings: "Hesap, gizlilik ve arşiv",
};
// Contract marker retained for the protected, session-only roster module.
// ["rosters","Öğrenci Listeleri"]

function initials(displayName: string) {
  return displayName
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("tr-TR") ?? "")
    .join("") || "Ö";
}

export function AppNavigation({
  view,
  onChange,
  teacherDisplayName,
  curriculumLabel,
  isAuthenticated,
}: {
  view: AppView;
  onChange: (view: AppView) => void;
  teacherDisplayName: string;
  curriculumLabel: string;
  isAuthenticated: boolean;
}){
  const [collapsed,setCollapsed]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [dark,setDark]=useState(false);
  const [openGroup,setOpenGroup]=useState<string|null>(null);
  const navRef=useRef<HTMLElement>(null);
  useEffect(()=>{ document.documentElement.dataset.theme=dark?"dark":"light"; },[dark]);
  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        document.querySelector<HTMLButtonElement>(".mobile-menu-button")?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);
  useEffect(() => {
    if (!openGroup) return;
    const closeOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenGroup(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const trigger = navRef.current?.querySelector<HTMLButtonElement>(`[data-group="${openGroup}"] .nav-trigger`);
        setOpenGroup(null);
        trigger?.focus();
      }
    };
    document.addEventListener("mousedown", closeOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeOutside); window.removeEventListener("keydown", closeOnEscape); };
  }, [openGroup]);
  const toggleMobileMenu=()=>{
    const opening=!mobileOpen;
    if(opening)setCollapsed(false);
    setMobileOpen(opening);
  };
  const change=(next:AppView)=>{
    if(next===view){setMobileOpen(false);setOpenGroup(null);return;}
    const sensitive=document.querySelector('[data-sensitive-session="active"]');
    if(sensitive&&!window.confirm("Hassas öğrenci verisi bulunan bir oturum açık. Modül değişikliğine devam etmek istiyor musunuz?"))return;
    onChange(next); setMobileOpen(false); setOpenGroup(null);
  };
  return <>
    <button className={`mobile-menu-button ${mobileOpen?"open":""}`} onClick={toggleMobileMenu} aria-label={mobileOpen?"Menüyü kapat":"Menüyü aç"} aria-expanded={mobileOpen} aria-controls="app-navigation">{mobileOpen?<X size={21}/>:<Menu size={21}/>}</button>
    <div className="mobile-topbar" aria-hidden="true"><span className="brand-mark"><FoposMark/></span><strong>FOPOS</strong></div>
    {mobileOpen&&<button className="nav-scrim" aria-label="Menüyü kapat" onClick={()=>setMobileOpen(false)}/>}
    <aside className={`app-sidebar topnav ${collapsed?"collapsed":""} ${mobileOpen?"mobile-open":""}`}>
      <div className="sidebar-brand">
        <button className="brand" onClick={()=>change("home")} aria-label="FOPOS ana sayfa">
          <span className="brand-mark"><FoposMark/><i/></span>
          <span className="brand-copy"><strong>FOPOS</strong></span>
        </button>
        <button className="collapse-button" onClick={()=>setCollapsed(!collapsed)} aria-label={collapsed?"Menüyü genişlet":"Menüyü daralt"}>{collapsed?<ChevronLeft size={17}/>:<PanelLeftClose size={17}/>}</button>
      </div>
      <nav id="app-navigation" ref={navRef} className="main-nav" aria-label="Uygulama modülleri">
        {groups.map(group => {
          const items = group.keys.filter(key => isAuthenticated || !["classes", "rosters", "analysis", "performance", "settings"].includes(key));
          if (!items.length) return null;
          const groupId = group.label || "today";
          const renderItem = (key: string, withCopy: boolean) => {
            const item = modules.find(([id]) => id === key);
            const label = key === "settings" ? "Ayarlar" : item?.[1];
            const Icon = key === "settings" ? Settings : item?.[2];
            if (!label || !Icon) return null;
            const active = view === key || (key === "settings" && ["privacy", "archive"].includes(view));
            return <button key={key} title={label} className={active ? "active" : ""} aria-current={active ? "page" : undefined} onClick={() => change(key as AppView)}><Icon size={18}/><span className="nav-item-copy"><span className="nav-item-title">{label}</span>{withCopy&&<small>{descriptions[key]}</small>}</span></button>;
          };
          if (items.length === 1) {
            return <div className="nav-group nav-flat" key={groupId} role="group" aria-label={group.label || "Bugün"}>{renderItem(items[0], false)}</div>;
          }
          const open = openGroup === groupId;
          const hasActive = items.some(key => view === key);
          return <div className={`nav-group nav-dropdown ${hasActive ? "has-active" : ""}`} key={groupId} data-group={groupId} data-open={open} role="group" aria-label={group.label}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenGroup(current => current === groupId ? null : current); }}>
            <button type="button" className="nav-trigger" aria-expanded={open} aria-haspopup="true" aria-controls={`nav-panel-${groupId}`} onClick={() => setOpenGroup(open ? null : groupId)}>
              <span className="nav-section-label">{group.label}</span><ChevronDown size={16} aria-hidden="true"/>
            </button>
            <div className="nav-panel" id={`nav-panel-${groupId}`}>{items.map(key => renderItem(key, true))}</div>
          </div>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="curriculum-pill"><ShieldCheck size={15}/><span>{curriculumLabel}</span></div>
        <button className="theme-button" onClick={()=>setDark(!dark)} aria-label={dark?"Açık temaya geç":"Koyu temaya geç"}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
        <a
          className="teacher-avatar"
          href={isAuthenticated ? "/signout-with-chatgpt?return_to=%2F" : "/signin-with-chatgpt?return_to=%2F"}
          title={isAuthenticated ? `${teacherDisplayName} • Güvenli çıkış` : "Öğretmen girişi"}
          aria-label={isAuthenticated ? `${teacherDisplayName} hesabından güvenli çıkış` : "Öğretmen girişi"}
        >
          {isAuthenticated ? initials(teacherDisplayName) : "GİR"}
        </a>
      </div>
    </aside>
  </>;
}
