export type TUser = {
  id: number;
  username: string;
  email: string;
  password: string
}

export type TCart = {
  id:number;
  userId: number;
  products: TProduct 
}

export type TProduct = {
  id:number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type TUserAuth = {
  token: string;
  user: TUser;
}