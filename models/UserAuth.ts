import { mapJsonToUser, type User } from './User';
import type { TUserAuth } from "~/types/apiResponse";

export type UserAuth = {
  token: string | null;
  user: User | null;
};

export function mapJsonToUserAuth(json: TUserAuth): UserAuth {
  return {
    token: json.token,
    user: mapJsonToUser(json.user)
  };
}
