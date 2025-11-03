import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
import { AppError } from "../errors/AppError";

/*
  Receber code(string)
  Recuperar o access_token no github
  Recuperar infos do user no github
  Verificar se o usuario existe no DB
  ----- SIM = Gera um token
  ----- NAO = Cria no DB, gera um token
  Retornar o token com as infos do user
*/
interface IAcessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    if (!code) {
      throw new AppError("Código de autenticação não informado", 400);
    }

    const url = "https://github.com/login/oauth/access_token";

    try {
      const { data: accessTokenResponse } = await axios.post<IAcessTokenResponse>(
        url,
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!accessTokenResponse.access_token) {
        throw new AppError("Falha ao obter token do GitHub", 401);
      }

      const response = await axios.get<IUserResponse>(
        "https://api.github.com/user",
        {
          headers: {
            authorization: `Bearer ${accessTokenResponse.access_token}`,
          },
        }
      );

      const { login, id, avatar_url, name } = response.data;

      let user = await prismaClient.user.findFirst({
        where: {
          github_id: id,
        },
      });

      if (!user) {
        user = await prismaClient.user.create({
          data: {
            github_id: id,
            login,
            avatar_url,
            name,
          },
        });
      }

      const token = sign(
        {
          user: {
            name: user.name,
            avatar_url: user.avatar_url,
            id: user.id,
          },
        },
        process.env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: "1d",
        }
      );

      return {token, user};
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error("Erro ao autenticar usuário:", error);
      throw new AppError("Erro ao autenticar com GitHub", 502);
    }
  }
}

export { AuthenticateUserService };
