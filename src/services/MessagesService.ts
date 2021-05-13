import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";
import { UsersRepository } from "../repositories/UsersRepository";

interface IMessageCreate {
    admin_id?: string;
    text: string;
    user_id: string;
}

interface IMessageGet {
    admin_id?: string;
    user_id?: string;
}

export class MessagesService {
    private messagesRepository: Repository<Message>;

    constructor() {
        this.messagesRepository = getCustomRepository(MessagesRepository)
    }

    async create({ admin_id, text, user_id }: IMessageCreate) {
        const usersRepository = getCustomRepository(UsersRepository)

        const userExist = await usersRepository.findOne({ id: user_id })

        if (!userExist) {
            throw new Error('User not found')
        }

        const newMessage = this.messagesRepository.create({
            admin_id,
            text,
            user_id
        })

        await this.messagesRepository.save(newMessage)

        return newMessage
    }

    async list({ user_id, admin_id }: IMessageGet) {
        let where = {}

        if (user_id) where = { ...where, user_id }

        if (admin_id) where = { ...where, admin_id }

        const messages = await this.messagesRepository.find({
            where,
            relations: ['user']
        })

        return messages
    }
}
