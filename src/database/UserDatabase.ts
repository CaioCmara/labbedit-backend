import { BaseDatabase } from "./BaseDatabase";
import { UserDB } from "../types";
import { User } from "../models/User"

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  

  public async findUserById(id: string) {
    const [userDB]: UserDB[] | undefined[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ id });

    return userDB;
  }

  public async findUserByEmail (email: string){
    const [userDB]:UserDB[] | undefined = await BaseDatabase
    .connection(UserDatabase.TABLE_USERS)
    .select().where({email})

    return userDB
}
  public async insertUser(newUserDB: UserDB) {
    await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUserDB);
  }
}
