import { UserBusiness } from "../../src/business/UserBusiness"
import { User } from "../../src/models/User"
import { USER_ROLES } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("findUserById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("Retornar um usuário com seu id", async () => {
        const id = "id-mock"
        const response = await userBusiness.findUserById(id)
        const user = new User(
            "id-mock",
            "Caio",
            "normal@email.com",
            "hash-teste123",
            USER_ROLES.NORMAL,
            expect.any(String)
        )
        expect(response).toEqual(user)

    })
})