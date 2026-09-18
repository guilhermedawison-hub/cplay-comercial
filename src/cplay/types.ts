import type { Identifier } from "ra-core";

export type CPlayProduct = {
  id: Identifier;
  name: string;
  category: string | null;
  description: string | null;
  base_price: number | null;
  active: boolean;
  display_order: number;
  color: string | null;
};

export type CPlayLeadSource = {
  id: Identifier;
  name: string;
  active: boolean;
  display_order: number;
};
