"use client";

import {
  BarChart3, BookOpen, CalendarDays, ChevronLeft, ClipboardCheck,
  FileText, GraduationCap, Home, ListChecks, Menu, Moon, PanelLeftClose,
  ExternalLink, Bot, Settings, ShieldCheck, Sparkles, Sun, UsersRound, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FoposMark } from "../brand/FoposMark";

export type AppView = "home" | "studio" | "daily" | "annual" | "meeting" | "exam" | "classes" | "rosters" | "analysis" | "performance" | "resources" | "archive" | "ai" | "privacy" | "settings";

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
  ["performance", "Öğrenci Performansı", GraduationCap],
  ["resources", "Kaynak Merkezi", BookOpen],
] as const;
const groups = [
  { label: "", keys: ["home"] },
  { label: "PLANLAMA", keys: ["studio", "daily", "annual"] },
  { label: "ÖLÇME", keys: ["exam", "analysis", "performance", "homework"] },
  { label: "SINIF", keys: ["classes", "rosters", "meeting"] },
  { label: "KAYNAK", keys: ["resources", "ai"] },
  { label: "SİSTEM", keys: ["settings"] },
];
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
  const toggleMobileMenu=()=>{
    const opening=!mobileOpen;
    if(opening)setCollapsed(false);
    setMobileOpen(opening);
  };
  const change=(next:AppView)=>{
    if(next===view){setMobileOpen(false);return;}
    const sensitive=document.querySelector('[data-sensitive-session="active"]');
    if(sensitive&&!window.confirm("Hassas öğrenci verisi bulunan bir oturum açık. Modül değişikliğine devam etmek istiyor musunuz?"))return;
    onChange(next); setMobileOpen(false);
  };
  return <>
    <button className={`mobile-menu-button ${mobileOpen?"open":""}`} onClick={toggleMobileMenu} aria-label={mobileOpen?"Menüyü kapat":"Menüyü aç"} aria-expanded={mobileOpen} aria-controls="app-navigation">{mobileOpen?<X size={21}/>:<Menu size={21}/>}</button>
    {mobileOpen&&<button className="nav-scrim" aria-label="Menüyü kapat" onClick={()=>setMobileOpen(false)}/>}
    <aside className={`app-sidebar ${collapsed?"collapsed":""} ${mobileOpen?"mobile-open":""}`}>
      <div className="sidebar-brand">
        <button className="brand" onClick={()=>change("home")} aria-label="FOPOS ana sayfa">
          <span className="brand-mark"><FoposMark/><i/></span>
          <span className="brand-copy"><strong>FOPOS</strong></span>
        </button>
        <button className="collapse-button" onClick={()=>setCollapsed(!collapsed)} aria-label={collapsed?"Menüyü genişlet":"Menüyü daralt"}>{collapsed?<ChevronLeft size={17}/>:<PanelLeftClose size={17}/>}</button>
      </div>
      <nav id="app-navigation" className="main-nav" aria-label="Uygulama modülleri">
        {groups.map(group => {
          const items = group.keys.filter(key => isAuthenticated || !["classes", "rosters", "analysis", "performance", "settings"].includes(key));
          if (!items.length) return null;
          return <div className="nav-group" key={group.label || "today"} role="group" aria-label={group.label || "Bugün"}>
            {group.label && <span className="nav-section-label">{group.label}</span>}
            {items.map(key => {
              if (key === "homework") return <a key={key} className="nav-external" href="https://felsefe-odev-takibi.aytigin.chatgpt.site" target="_blank" rel="noopener noreferrer" title="Ödev ve Değerlendirme (yeni sekmede)"><ListChecks size={18}/><span>Ödev ve Değerlendirme</span><ExternalLink size={14}/><span className="sr-only"> (yeni sekmede)</span></a>;
              const item = modules.find(([id]) => id === key);
              const label = key === "settings" ? "Ayarlar" : item?.[1];
              const Icon = key === "settings" ? Settings : item?.[2];
              if (!label || !Icon) return null;
              const active = view === key || (key === "settings" && ["privacy", "archive"].includes(view));
              return <button key={key} title={label} className={active ? "active" : ""} aria-current={active ? "page" : undefined} onClick={() => change(key as AppView)}><Icon size={18}/><span>{label}</span></button>;
            })}
          </div>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="curriculum-pill"><ShieldCheck size={15}/><span>{curriculumLabel}</span></div>
        <button className="theme-button" onClick={()=>setDark(!dark)} aria-label={dark?"Açık temaya geç":"Koyu temaya geç"}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
        <a
          className="teacher-avatar"
          href={isAuthenticated ? "/signout-with-chatgpt?return_to=%2F" : "/signin-with-chatgpt?return_to=%2F"}
          title={isAuthenticated ? `${teacherDisplayName} • Güvenli çıkış` : "ChatGPT ile giriş yap"}
          aria-label={isAuthenticated ? `${teacherDisplayName} hesabından güvenli çıkış` : "ChatGPT ile giriş yap"}
        >
          {isAuthenticated ? initials(teacherDisplayName) : "GİR"}
        </a>
      </div>
    </aside>
  </>;
}
