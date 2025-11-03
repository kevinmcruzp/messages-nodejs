import { Request, Response } from "express";
import { CreateMessageService } from "../services/CreateMessageService";
import { asyncHandler } from "../utils/asyncHandler";

class CreateMessageController {
  handle = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;
    const { user_id } = req;

    const service = new CreateMessageService();

    const result = await service.execute(message, user_id);

    return res.json(result);
  });
}

export { CreateMessageController };
