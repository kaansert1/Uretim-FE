export interface IRpYardimLog {
  id: number;
  isEmriNo: string;
  personelID: string;
  machineCode?: string; // Yeni eklenen makine kodu
  yardımTarihi: string;
  cevapTarihi?: string;
  cevapPersonel?: string;
  cözümTarihi?: string;
  hata?: string;
  cevap?: string; // Seçilen arızalar JSON string olarak tutulacak
}

export interface IRpYardimLogUpdateDto {
  CevapTarihi?: string;
  CevapPersonel?: string;
  CözümTarihi?: string;
  Cevap?: string; // Seçilen arızalar JSON string olarak
}

export interface IRpYardimLogCreateDto {
  isEmriNo: string;
  personelID: string;
  machineCode?: string; // Yeni eklenen makine kodu
}
