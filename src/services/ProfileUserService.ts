import prismaClient from "../prisma";
import { AppError } from "../errors/AppError";

class ProfileUserService {
  async execute(user_id: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return user;
  }
}

export { ProfileUserService };
