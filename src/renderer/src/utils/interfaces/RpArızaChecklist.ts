export interface IRpArızaChecklist {
  id: number;
  checkCode?: string;
  arıza: string;
}

export interface IArızaChecklistItem {
  id: number;
  arıza: string;
  selected: boolean;
}
