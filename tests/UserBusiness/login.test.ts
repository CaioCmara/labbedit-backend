import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";

import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { UserBusiness } from "../../src/business/UserBusiness";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { LoginInput } from "../../src/dtos/userDTOS";
describe("login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Login feito com sucesso = retorna token", async () => {
    const input: LoginInput = {
      email: "normal@email.com",
      password: "hash-teste123",
    };

    const response = await userBusiness.login(input);
    expect(response.token).toBe("token-mock-normal");
  });

  test("Erro caso email seja incorreto", () => {
    const input: LoginInput = {
      email: "@email.com",
      password: "littlebanana",
    };

    expect(async () => {
      await userBusiness.login(input);
    }).rejects.toThrow("Usuário não encontrado");
  });

  test("Erro caso senha seja incorreta", () => {
    const input: LoginInput = {
      email: "normal@email.com",
      password: "littlebanana",
    };

    expect(async () => {
      await userBusiness.login(input);
    }).rejects.toThrow("Senha incorreta");
  });
});
