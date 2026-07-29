"use client";

import { ArrowRight, BarChart3, Bell, BookOpen, Bot, CalendarDays, ClipboardCheck, FileText, GraduationCap, ListChecks, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useState } from "react";
import type { AppView } from "../navigation/AppNavigation";
import type { ResourceSection } from "../../modules/resource-center/ResourceCenterModule";

const cards:[AppView,string,string,typeof Sparkles][]=[
  ["studio","Ders Tasarım Stüdyosu","Müfredattan 80 dakikalık pedagojik akış üretin.",Sparkles],
  ["daily","Günlük Plan","Resmî günlük planınızı tek akışta hazırlayın.",FileText],
  ["annual","Yıllık Plan","Üniteleri öğretim yılına güvenle dağıtın.",CalendarDays],
  ["meeting","Zümre","Gündem, görüşme ve kararları belgeleyin.",UsersRound],
  ["exam","Sınav","Standart veya BEP uyarlamalı sınav oluşturun.",ClipboardCheck],
  ["rosters","Öğrenci Listeleri","Sınıf listelerini güvenli oturum bağlamında yönetin.",ListChecks],
  ["analysis","Sınav Analizi","Sınav sonuçlarını pedagojik kanıta dönüştürün.",BarChart3],
  ["ai","FOPOS AI","Kimliksiz sınav kanıtından gerekçeli müdahale önerileri alın.",Bot],
  ["performance","Öğrenci Performansı","Kanıta dayalı gelişimi izleyip destek planlayın.",GraduationCap],
  ["resources","Kaynak Merkezi","Müfredat ve öğrenme çıktılarını arayın.",BookOpen],
  ["privacy","Gizlilik Merkezi","Öğrenci verisinin yaşam döngüsünü ve silme sınırlarını görün.",ShieldCheck],
];

const quickLinks=[{label:"Müfredat",ready:true},{label:"Öğrenme Çıktıları",ready:true},{label:"BEP",ready:true},{label:"Örnek Belgeler",ready:true},{label:"Değerler",ready:false},{label:"Okuryazarlık",ready:false}];

function currentWelcome(){
  const now=new Date();
  const hour=now.getHours();
  return {
    date:new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"long",year:"numeric"}).format(now),
    greeting:hour<12?"Günaydın":hour<18?"İyi günler":"İyi akşamlar",
  };
}

export function Dashboard({
  onOpen,
  teacherDisplayName,
  isAuthenticated,
}: {
  onOpen: (view: AppView, resourceSection?: ResourceSection) => void;
  teacherDisplayName: string;
  isAuthenticated: boolean;
}){
  const [welcome]=useState(currentWelcome);
  const visibleCards = isAuthenticated
    ? cards
    : cards.filter(([key]) => !["rosters", "analysis", "performance"].includes(key));
  const showNotifications=()=>document.getElementById("dashboard-notifications")?.scrollIntoView({behavior:"smooth",block:"center"});
  return <div className="dashboard" id="top">
    <header className="dashboard-top"><div><span suppressHydrationWarning>{welcome.date}</span><h1 suppressHydrationWarning>{welcome.greeting}, {teacherDisplayName}.</h1></div><button aria-label="Bildirimlere git" aria-controls="dashboard-notifications" onClick={showNotifications}><Bell size={19}/><i/></button></header>
    <section className="dashboard-hero">
      <div><span className="eyebrow"><Sparkles size={14}/> FOPOS v47 Professional Edition</span><h2>Pedagojik kararlarınız için<br/><em>akıllı çalışma alanı.</em></h2><p>Türkiye Yüzyılı Maarif Modeli ile uyumlu ders tasarımı, planlama, ölçme ve değerlendirme süreçlerini tek merkezden yönetin.</p><button onClick={()=>onOpen("studio")}>Yeni ders tasarımı <ArrowRight size={17}/></button></div>
      <div className="hero-art" aria-hidden="true"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><BookOpen size={70}/><i>φ</i></div>
    </section>
    <section className="dashboard-section"><div className="section-title"><div><span>Çalışma alanı</span><h2>Modüller</h2></div><small>{visibleCards.length} etkin modül</small></div><div className="module-grid">{visibleCards.map(([key,title,copy,Icon])=><article key={key}><span><Icon size={21}/></span><h3>{title}</h3><p>{copy}</p><button onClick={()=>onOpen(key,key==="resources"?"curriculum":undefined)}>Başlat <ArrowRight size={15}/></button></article>)}</div></section>
    <section className="dashboard-columns"><div className="quick-panel"><div className="section-title"><div><span>Kaynaklar</span><h2>Hızlı erişim</h2></div><small>Kaynak Merkezi</small></div><div className="quick-links">{quickLinks.map(item=><button key={item.label} disabled={!item.ready} title={item.ready?`${item.label} bölümünü aç`:`${item.label} yakında kullanıma açılacak`} onClick={()=>item.ready&&onOpen("resources",item.label==="BEP"?"bep":item.label==="Örnek Belgeler"?"documents":"curriculum")}><BookOpen size={16}/>{item.label}<small>{item.ready?"Aç":"Yakında"}</small></button>)}</div></div><div className="notice-panel" id="dashboard-notifications"><div className="section-title"><div><span>Güncel</span><h2>Bildirimler</h2></div></div><div className="notice"><i/><div><strong>FOPOS v47 çalışma alanı</strong><p>On bir etkin modül profesyonel arayüzde hazır.</p></div><time>Güncel</time></div><div className="notice"><i/><div><strong>FOPOS AI ve Gizlilik Merkezi</strong><p>Kimliksiz karar desteği ve veri yaşam döngüsü denetimi eklendi.</p></div><time>Yeni</time></div></div></section>
  </div>;
}
