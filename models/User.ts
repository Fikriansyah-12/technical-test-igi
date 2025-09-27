import type { TUser } from "~/types/apiResponse"

export type User = {
  id: number,
  username: string,
  email: string,
  password: string
}

export function mapJsonToUser(json: TUser): User {
  return {
    id: json.id,
    username: json.username,
    email: json.email,
    password: json.password
  }
}
