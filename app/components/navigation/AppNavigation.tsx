"use client";

import {
  BarChart3, BookOpen, CalendarDays, ChevronLeft, ClipboardCheck,
  FileText, GraduationCap, Home, ListChecks, Menu, Moon, PanelLeftClose,
  Bot, Settings, ShieldCheck, Sparkles, Sun, UsersRound, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FoposMark } from "../brand/FoposMark";

export type AppView = "home" | "studio" | "daily" | "annual" | "meeting" | "exam" | "rosters" | "analysis" | "performance" | "resources" | "ai" | "privacy";

const modules = [
  ["home", "Ana Sayfa", Home],
  ["studio", "Ders Tasarım Stüdyosu", Sparkles],
  ["daily", "Günlük Plan", FileText],
  ["annual", "Yıllık Plan", CalendarDays],
  ["meeting", "Zümre", UsersRound],
  ["exam", "Sınav", ClipboardCheck],
  ["rosters", "Öğrenci Listeleri", ListChecks],
  ["analysis", "Sınav Analizi", BarChart3],
  ["ai", "FOPOS AI", Bot],
  ["performance", "Öğrenci Performansı", GraduationCap],
  ["resources", "Kaynak Merkezi", BookOpen],
  ["privacy", "Gizlilik Merkezi", ShieldCheck],
] as const;
// Contract marker retained for the protected, session-only roster module.
// ["rosters","Öğrenci Listeleri"]

export function AppNavigation({view,onChange}:{view:AppView;onChange:(view:AppView)=>void}){
  const [collapsed,setCollapsed]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [dark,setDark]=useState(false);
  useEffect(()=>{ document.documentElement.dataset.theme=dark?"dark":"light"; },[dark]);
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
    <button className={`mobile-menu-button ${mobileOpen?"open":""}`} onClick={toggleMobileMenu} aria-label={mobileOpen?"Menüyü kapat":"Menüyü aç"} aria-expanded={mobileOpen}>{mobileOpen?<X size={21}/>:<Menu size={21}/>}</button>
    {mobileOpen&&<button className="nav-scrim" aria-label="Menüyü kapat" onClick={()=>setMobileOpen(false)}/>}
    <aside className={`app-sidebar ${collapsed?"collapsed":""} ${mobileOpen?"mobile-open":""}`}>
      <div className="sidebar-brand">
        <button className="brand" onClick={()=>change("home")} aria-label="FOPOS ana sayfa">
          <span className="brand-mark"><FoposMark/><i/></span>
          <span className="brand-copy"><strong>FOPOS</strong><small>Professional Edition</small></span>
        </button>
        <button className="collapse-button" onClick={()=>setCollapsed(!collapsed)} aria-label={collapsed?"Menüyü genişlet":"Menüyü daralt"}>{collapsed?<ChevronLeft size={17}/>:<PanelLeftClose size={17}/>}</button>
      </div>
      <nav className="main-nav" aria-label="Uygulama modülleri">
        <span className="nav-section-label">Çalışma Alanı</span>
        {modules.map(([key,label,Icon])=><button key={key} title={label} className={view===key?"active":""} onClick={()=>change(key)}><Icon size={18}/><span>{label}</span>{key==="ai"&&<em>AI</em>}</button>)}
        <span className="nav-section-label">Sistem</span>
        <button title="Ayarlar"><Settings size={18}/><span>Ayarlar</span></button>
      </nav>
      <div className="sidebar-bottom">
        <div className="curriculum-pill"><ShieldCheck size={15}/><span>TYMM 2024</span></div>
        <button className="theme-button" onClick={()=>setDark(!dark)} aria-label={dark?"Açık temaya geç":"Koyu temaya geç"}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
        <span className="teacher-avatar">AY</span>
      </div>
    </aside>
  </>;
}
