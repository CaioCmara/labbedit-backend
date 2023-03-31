import { Request, Response } from "express";
import { LoginInput } from "../dtos/userDTOS";
import { SignupInputDTO } from "../dtos/userDTOS";
import { UserBusiness } from "../business/UserBusiness";
import { BaseError } from "../Error/BaseError";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public findUserById = async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const output = await this.userBusiness.findUserById(id)

        res.status(200).send(output)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof BaseError) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
  }
  public login = async (req: Request, res: Response) => {
    try {
      const input: LoginInput = {
        email: req.body.email,
        password: req.body.password,
      };

      const output = await this.userBusiness.login(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof BaseError) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };
  public signup = async (req: Request, res: Response) => {
    try {
      const input: SignupInputDTO = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      const output = await this.userBusiness.signup(input);

      //  await userDatabase.insertUser(newUserDB)

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof BaseError) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  };
}
