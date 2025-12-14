export interface INumune {
  adet: number;
  tarih: string;
  seriNo: string;
  lotNo: string;
  makId: number;
}

export interface INumuneSchedule {
  baslangic: string;
  maxTolerans: string;
}

export interface INumuneScheduleResponse {
  numune: INumune | null;
  numuneSaatleri: INumuneSchedule[];
}
