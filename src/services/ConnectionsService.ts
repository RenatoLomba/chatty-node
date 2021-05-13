import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
    admin_id?: string;
    socket_id: string;
    user_id: string;
    id?: string;
}

interface IConnectionsList {
    admin_id?: string;
    user_id?: string;
    withoutAdmin?: boolean;
    socket_id?: string;
}

interface IConnectionUpdate {
    user_id: string;
    admin_id: string;
}

export class ConnectionsService {
    private connectionsRepository: Repository<Connection>;
    constructor() {
        this.connectionsRepository = getCustomRepository(ConnectionsRepository)
    }

    async create(connection: IConnectionCreate) {
        const connectionAlreadyExists = await this.connectionsRepository.findOne({
            user_id: connection.user_id
        })

        if (connectionAlreadyExists) {
            connectionAlreadyExists.socket_id = connection.socket_id
        }

        const newConnection = this.connectionsRepository
            .create(connectionAlreadyExists || connection)

        await this.connectionsRepository.save(newConnection)

        return newConnection
    }

    async list({ admin_id, user_id, withoutAdmin = false }: IConnectionsList) {
        let where = {}

        if (withoutAdmin) where = { ...where, admin_id: null }

        if (!withoutAdmin && user_id) where = { ...where, user_id }

        if (!withoutAdmin && admin_id) where = { ...where, admin_id }

        const connections = await this.connectionsRepository.find({
            where,
            relations: ['user']
        })

        return connections
    }

    async find({ admin_id, user_id, socket_id }: IConnectionsList) {
        let where = {}

        if (user_id) where = { ...where, user_id }

        if (admin_id) where = { ...where, admin_id }

        if (socket_id) where = { ...where, socket_id }

        const connection = await this.connectionsRepository.findOne({
            where,
            relations: ['user']
        })

        return connection
    }

    async update({ admin_id, user_id }: IConnectionUpdate) {
        await this.connectionsRepository
            .createQueryBuilder()
            .update(Connection)
            .set({ admin_id })
            .where('user_id = :user_id', { user_id })
            .execute()
    }
}
