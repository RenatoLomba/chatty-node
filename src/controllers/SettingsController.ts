import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

export class SettingsController {
    async create(req: Request, res: Response) {
        const { chat, username } = req.body

        const service = new SettingsService();

        try {
            const newSetting = await service.create({ chat, username })
            return res.status(201).json(newSetting)
        } catch (error) {
            const er = error as Error
            return res.status(400).json({ error: er.message })
        }
    }

    async findByUserName(req: Request, res: Response) {
        const { username } = req.params

        const service = new SettingsService();

        const settings = await service.findByUserName(username)

        return res.status(200).json(settings)
    }

    async update(req: Request, res: Response) {
        const { username } = req.params
        const { chat } = req.body

        const service = new SettingsService();

        await service.update({ chat, username })

        return res.status(200).json()
    }
}
