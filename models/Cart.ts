import type { TCart } from "~/types/apiResponse";
import { mapJsonToProduct, type Product } from "./Product";

export type Cart = {
  id: number;
  userId: number;
  products: Product | null;
};

export function mapJsonToCart(json: TCart): Cart {
  return {
    id: json.id,
    userId: json.userId,
    products: json.products ? mapJsonToProduct(json.products) : null,
  };
}
