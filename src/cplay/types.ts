export type CPlayProduct = {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  base_price: number | null;
  active: boolean;
  display_order: number;
  color: string | null;
};

export type CPlayLeadSource = {
  id: number;
  name: string;
  active: boolean;
  display_order: number;
};
