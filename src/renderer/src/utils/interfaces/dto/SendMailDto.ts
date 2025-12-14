export interface ISendMailDto {
  subject: string;
  body: string;
}

export interface ISendMailDtoV2 {
  subject: string;
  body: string;
  serialDetail: {
    isemrino: string;
    urunTip: boolean;
    koliAdeti: number;
  } | null;
}
