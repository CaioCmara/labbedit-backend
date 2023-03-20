import { UserDatabase } from "../database/UserDatabase";
import {
  LoginInput,
  LoginOutput,
  SignupInput,
  SignupOutput,
} from "../dtos/userDTOS";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, USER_ROLES } from "../types";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}
  public login = async (input: LoginInput): Promise<LoginOutput> => {
    const { email, password } = input;

    if (typeof email !== "string") {
      throw new Error("'email' deve ser string");
    }

    if (typeof password !== "string") {
      throw new Error("'senha' deve ser string");
    }

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new Error("'email' não encontrado");
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    const rightPassword = await this.hashManager.compare(
      password,
      userDB.password
    );

    if (!rightPassword) {
      throw new Error("Senha incorreta");
    }
    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: LoginOutput = {
      message: "Login feito com sucesso",
      token,
    };

    return output;
  };

  public signup = async (input: SignupInput): Promise<SignupOutput> => {
    const { name, email, password } = input;

    if (typeof name !== "string") {
      throw new Error("'name' deve ser string");
    }

    if (typeof email !== "string") {
      throw new Error("'email' deve ser string");
    }

    if (typeof password !== "string") {
      throw new Error("'password' deve ser string");
    }

    // nao pode se cadastrar com o mesmo email
    const existingEmail = await this.userDatabase.findUserByEmail(email);
    if (existingEmail) {
      throw new Error("E-mail já cadastrado");
    }
    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(
      this.idGenerator.generate(),
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const newUserDB = newUser.toDBModel();
    await this.userDatabase.insertUser(newUserDB);

    const tokenPayload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(tokenPayload);

    const output: SignupOutput = {
      message: "Cadastro feito com sucesoso",
      token,
    };

    return output;
  };
}
