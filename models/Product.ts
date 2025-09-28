import type { TProduct } from "~/types/apiResponse";

export type Product = {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  image: string;
};

export function mapJsonToProduct(json: TProduct): Product {
  return {
    id: json.id,
    title: json.title,
    price: json.price,
    description: json.description,
    category: json.category,
    image: json.image,
  };
}
