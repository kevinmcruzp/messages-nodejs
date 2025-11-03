import { Request, Response } from "express";
import { ProfileUserService } from "../services/ProfileUserService";
import { asyncHandler } from "../utils/asyncHandler";

class ProfileUserController {
  handle = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req;

    const service = new ProfileUserService();

    const result = await service.execute(user_id);

    return res.json(result);
  });
}

export { ProfileUserController };
