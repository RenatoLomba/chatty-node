import { Request, Response } from "express";
import { MessagesService } from "../services/MessagesService";

export class MessagesController {
    async create(req: Request, res: Response) {
        const { admin_id, text, user_id } = req.body
        const service = new MessagesService()

        try {
            const message = await service.create({
                admin_id,
                text,
                user_id
            })

            return res.status(201).json(message)
        } catch (err) {
            const error = err as Error
            return res.status(400).json({ error: error.message })
        }
    }

    async show(req: Request, res: Response) {
        const { userId, adminId } = req.query

        const service = new MessagesService()

        try {
            const messages = await service.list({
                admin_id: adminId ? String(adminId) : undefined,
                user_id: userId ? String(userId) : undefined
            })

            return res.status(201).json(messages)
        } catch (err) {
            const error = err as Error
            return res.status(500).json({ error: error.message })
        }
    }
}
