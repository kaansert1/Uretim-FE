export interface IIncorrectProductDto {
	employeeId: number;
	eyeNumber: string;
	errorDesc: string;
	workOrder: string;
	eksik: boolean;
	capak: boolean;
	delik: boolean;
	renk: boolean;
	leke: boolean;
	boyutKontrol: boolean;
	vakumKontrol: boolean;
	gazKirilmaKontrol: boolean;
	yirtmaKontrol: boolean;
	logoKontrol: boolean;
	montajKontrol: boolean;
	baskiSilinmeKontrol: boolean;
	sizdirmazlik: boolean;
	gramaj: boolean;
	acmaKapatma: boolean;
	cekmeBasma: boolean;
	ciid: string;
	pasoKilitUygunluk: boolean;
	program: string;
}
