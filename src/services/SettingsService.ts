import { getCustomRepository, Repository } from "typeorm"
import { Setting } from "../entities/Setting"
import { SettingsRepository } from "../repositories/SettingsRepository"

interface ISettings {
    chat: boolean;
    username: string;
}

export class SettingsService {
    private settingsRepository: Repository<Setting>;
    constructor() {
        this.settingsRepository = getCustomRepository(SettingsRepository)
    }
    async create({ chat, username }: ISettings) {
        const userAlreadyExists = await this.settingsRepository.findOne({
            username
        })

        if (userAlreadyExists) {
            throw new Error('User already exists!')
        }

        const newSetting = this.settingsRepository.create({
            chat,
            username
        })

        await this.settingsRepository.save(newSetting)
        return newSetting;
    }

    async findByUserName(username: string) {
        const settings = await this.settingsRepository.findOne({
            username
        })
        return settings
    }

    async update({ chat, username }: ISettings) {
        await this.settingsRepository
            .createQueryBuilder()
            .update(Setting)
            .set({ chat })
            .where('username = :username', { username })
            .execute()
    }
}
