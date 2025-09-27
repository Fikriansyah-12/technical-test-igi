export type TUser = {
  id: number;
  username: string;
  email: string;
  password: string
}

export type TCart = {
  id:number;
  userId: number;
  product: TProduct // ini dari product
}

export type TProduct = {
  id:number;
  title: string;
  price: string;
  description: string;
  category: string;
  iamge: string;
}