import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";

export class UsersController {
    async create(req: Request, res: Response): Promise<Response> {
        const { email } = req.body

        const service = new UsersService()

        try {
            const user = await service.create(email)
            return res.status(201).json(user)
        } catch (err) {
            const error = err as Error
            return res.status(500).json({ error: error.message })
        }
    }
}
