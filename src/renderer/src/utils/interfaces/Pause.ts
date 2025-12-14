export interface CreatePauseDto {
  personelId: number;
  baslangic: string;
  isemrino: string;
}

export interface ChangePausePersonelDto {
  isemrino: string;
  vekilId: number;
}

export interface ResumePauseDto {
  isemrino: string;
  bitis: string;
}

export interface MachinePauseDto {
  isemrino: string;
  personelId: number;
  durusNedeni: string;
  baslangicTarihi: string;
}

export interface MachineResumeDto {
  isemrino: string;
  bitisTarihi: string;
}

export interface PauseActiveDto {
  isActive: boolean;
  reason?: string;
  tarih?: string;
}

export interface MachineStatusDto {
  durus: PauseActiveDto;
  mola: PauseActiveDto;
}
