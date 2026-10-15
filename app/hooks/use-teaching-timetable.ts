"use client";
import { useEffect, useState } from "react";
import { emptyTimetable, parseTimetable, timetableKey, type TeachingTimetable } from "../core/teaching-timetable";

export function useTeachingTimetable(accountKey: string, academicYear: string) {
  const key = timetableKey(accountKey, academicYear);
  const [loadedKey, setLoadedKey] = useState("");
  const [timetable, setTimetable] = useState<TeachingTimetable>(emptyTimetable);
  const [storageMessage, setStorageMessage] = useState("");
  useEffect(() => {
    const load = () => {
      try {
        const text = window.localStorage.getItem(key);
        setTimetable(text ? parseTimetable(text) : emptyTimetable());
        setStorageMessage("");
      } catch {
        setTimetable(emptyTimetable());
        setStorageMessage("Ders programı okunamadı. Tarayıcı depolamasını kontrol edin; mevcut kayıt otomatik olarak değiştirilmedi.");
      }
      setLoadedKey(key);
    };
    load();
    const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);
  function saveTimetable(next: TeachingTimetable) {
    try {
      const safe = parseTimetable(JSON.stringify(next));
      window.localStorage.setItem(key, JSON.stringify(safe));
      setTimetable(safe);
      setStorageMessage("");
      return true;
    } catch {
      setStorageMessage("Program kaydedilemedi. Depolama iznini ve tarayıcınızdaki boş alanı kontrol edin.");
      return false;
    }
  }
  return { timetable:loadedKey === key ? timetable : emptyTimetable(), ready:loadedKey === key, storageMessage, saveTimetable };
}
