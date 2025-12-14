export interface IMaterial {
  id: number;
  serialNo: string;
  quantity: number;
  remaining: number;
}

export interface IMaterialBody {
  description: string;
  data: IMaterial[];
}

export interface IAssemblyMaterial {
  bodyMaterials: IMaterialBody;
  topMaterials: IMaterialBody;
}

export interface IRemainingMaterial {
  total: number;
  spent: number;
  remaining: number;
}
