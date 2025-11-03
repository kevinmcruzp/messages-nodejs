import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";
import { asyncHandler } from "../utils/asyncHandler";

class AuthenticateUserController {
  handle = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;

    const service = new AuthenticateUserService();

    const result = await service.execute(code);
    
    return res.json(result);
  });
}

export { AuthenticateUserController };
