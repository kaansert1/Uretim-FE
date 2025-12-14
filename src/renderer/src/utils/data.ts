import { FireType } from "./enums/FireType";

export const fireIssues = [
  { id: 1, value: "Eksik" },
  { id: 2, value: "Çapak" },
  { id: 3, value: "Delik" },
  { id: 4, value: "Renk" },
  { id: 5, value: "Leke" },
  { id: 6, value: "Boyut Kontrolü" },
  { id: 7, value: "Paso-Kilit" },
  { id: 8, value: "Gaz Kirilma" },
  { id: 9, value: "Yirtma" },
  { id: 10, value: "Logo-Görsellik" },
  { id: 11, value: "Montaj Kontrol" },
  { id: 12, value: "Baski Sonrasi" },
  { id: 13, value: "Sizdirmazlik" },
  { id: 14, value: "Gramaj" },
  { id: 15, value: "Açma-Kapama" },
  { id: 16, value: "Çekme-Basma" },
  { id: 17, value: "Vakum Kontrol" },
] as { id: number; value: string }[];

export const fireTypes = [
  {
    title: "Mamul",
    type: FireType.Mamul,
  },
  {
    title: "Alt",
    type: FireType.Alt,
  },
  {
    title: "Üst",
    type: FireType.Ust,
  },
] as { title: string; type: FireType }[];
