import type { CPlayProduct } from "@/cplay/types";
import { ProductCreate } from "./ProductCreate";
import { ProductEdit } from "./ProductEdit";
import { ProductList } from "./ProductList";

export default {
  list: ProductList,
  create: ProductCreate,
  edit: ProductEdit,
  recordRepresentation: (record: CPlayProduct) => record.name,
};
