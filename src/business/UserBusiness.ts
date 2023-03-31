import { UserDatabase } from "../database/UserDatabase";
import {
  LoginInput,
  LoginOutput,
  SignupInputDTO,
  SignupOutput,
} from "../dtos/userDTOS";
import { BadRequestError } from "../Error/BadRequestError";
import { NotFoundError } from "../Error/NotFoundError";
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

  
  public findUserById = async (id: string): Promise<User> => {
    if (!id) {
      throw new BadRequestError("Id não enviado!");
    }

    const userDB = await this.userDatabase.findUserById(id);

    if (!userDB) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    return user;
  }

  public login = async (input: LoginInput): Promise<LoginOutput> => {
    const { email, password } = input;

    if (typeof email !== "string") {
      throw new BadRequestError("'email' deve ser string");
    }

    if (typeof password !== "string") {
      throw new BadRequestError("'senha' deve ser string");
    }

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new NotFoundError("'email' não encontrado");
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

  public signup = async (input: SignupInputDTO): Promise<SignupOutput> => {
    const { name, email, password } = input;

    if (typeof name !== "string") {
      throw new BadRequestError("'name' deve ser string");
    }

    if (typeof email !== "string") {
      throw new BadRequestError("'email' deve ser string");
    }

    if (typeof password !== "string") {
      throw new BadRequestError("'password' deve ser string");
    }

    // nao pode se cadastrar com o mesmo email
    const existingEmail = await this.userDatabase.findUserByEmail(email);
    if (existingEmail) {
      throw new BadRequestError("Endereço de email já existe");
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
