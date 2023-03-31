import { BaseDatabase } from "../../src/database/BaseDatabase";
import { UserDB, USER_ROLES } from "../../src/types";

export class UserDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "users";

  public findUserById = async (id: string): Promise<UserDB | undefined> => {
    if (id === "id-mock") {
      return {
        id: "id-mock",
        name: "Caio",
        email: "normal@email.com",
        password: "hash-teste123",
        role: USER_ROLES.NORMAL,
        created_at: expect.any(String),
      };
    } else {
      return undefined;
    }
  };

  public findUserByEmail = async (email: string): Promise<UserDB> => {
    switch (email) {
      case "normal@email.com":
        return {
          id: "id-mock",
          name: "Normal",
          email: "normal@email.com",
          password: "hash-teste123",
          role: USER_ROLES.NORMAL,
          created_at: expect.any(String),
        };
      case "admin@email.com":
        return {
          id: "id-mock",
          name: "Admin",
          email: "dmin@email.com",
          password: "hash-teste123",
          role: USER_ROLES.ADMIN,
          created_at: expect.any(String),
        };
      default:
        throw new Error("Usuário não encontrado");
    }
  };

  public insertUser = async (userDB: UserDB): Promise<void> => {};
}
