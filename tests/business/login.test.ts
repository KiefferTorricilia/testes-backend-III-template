import { ZodError } from "zod"
import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginSchema } from "../../src/dtos/user/login.dto"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import { NotFoundError } from "../../src/errors/NotFoundError"

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar um token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "fulano123"
    })

    const output = await userBusiness.login(input)

    expect(output).toEqual({
      message: "Login realizado com sucesso",
      token: "token-mock-fulano"
    })
  })

  test("ZodError - email deve ser string", async () => {
    expect.assertions(1)
    try {
      const input = LoginSchema.parse({
        email: 12354,
        password: "fulano123"
      })
  
      await userBusiness.login(input)
    } catch (error) {
      console.log(error);
      if(error instanceof ZodError) {
        expect(error.issues[0].message).toBe("Expected string, received number")
      }
    }
    })

    test("Error - email não foi encontrado", async () => {
      expect.assertions(2)
      try {
        const input = LoginSchema.parse({
          email: "kieffer@gmail.com",
          password: "123456"
        })
    
        await userBusiness.login(input)
      } catch (error) {
        if(error instanceof NotFoundError) {
          expect(error.message).toBe("'email' não encontrado")
          expect(error.statusCode).toBe(404)
        }
      }
      })
})
