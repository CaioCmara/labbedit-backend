import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";

import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { UserBusiness } from "../../src/business/UserBusiness";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { SignupInputDTO } from "../../src/dtos/userDTOS";
import { BadRequestError } from "../../src/Error/BadRequestError";

describe("signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("cadastro feito com sucesso = retorna token", async () => {
    const input: SignupInputDTO = {
      email: "emailteste@email.com",
      name: "Example Mock",
      password: "bananinha",
    };

    const response = await userBusiness.signup(input);
    expect(response.token).toBe("token-mock-normal");
  });

  test("Name não foi preenchido", async () => {
    expect.assertions(1);

    const input: SignupInputDTO = {
      name: null,
      email: "normal@email.com",
      password: "hash-bananinha",
    };

    try {
      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("'name' deve ser string");
      }
    }
  });

  test("Email diferente de string", async () => {
    expect.assertions(1);

    const input: SignupInputDTO = {
      name: "Normal Mock",
      email: 3123,
      password: "hash-bananinha",
    };

    try {
      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("'email' deve ser string");
      }
    }
  });

  test("Password diferente de estring", async () => {
    expect.assertions(1);

    const input: SignupInputDTO = {
      name: "Normal Mock",
      email: "normal@email.com",
      password: 34134,
    };

    try {
      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("'password' deve ser string");
      }
    }
  });

  test("Email já existe", async () => {
    const input: SignupInputDTO = {
      name: "Normal Mock",
      email: "normal@email.com",
      password: "hash-bananinha",
    };

    expect(async () => {
      await userBusiness.signup(input);
    }).rejects.toThrow("Endereço de email já existe");
  });

 
});
