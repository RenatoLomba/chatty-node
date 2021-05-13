import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

export class UsersService {
    private usersRepository: Repository<User>;
    constructor() {
        this.usersRepository = getCustomRepository(UsersRepository)
    }
    async create(email: string) {
        const userAlreadyExists = await this.usersRepository.findOne({ email })

        if (userAlreadyExists) return userAlreadyExists

        const newUser = this.usersRepository.create({ email })
        await this.usersRepository.save(newUser)

        return newUser
    }
}
