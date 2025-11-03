import { io } from "../app";
import prismaClient from "../prisma";
import { AppError } from "../errors/AppError";

class CreateMessageService {
  async execute(text: string, user_id: string) {
    if (!text || text.trim().length === 0) {
      throw new AppError("Mensagem não pode estar vazia", 400);
    }

    if (text.length > 500) {
      throw new AppError("Mensagem muito longa. Máximo de 500 caracteres", 400);
    }

    const message = await prismaClient.message.create({
      data: {
        text,
        user_id,
      },
      include: {
        user: true,
      },
    });

    const infoWS = {
      id: message.id,
      text: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url,
      },
    };

    io.emit("new_message", infoWS);

    return message;
  }
}

export { CreateMessageService };
