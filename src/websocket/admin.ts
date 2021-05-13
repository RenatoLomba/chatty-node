import { io } from '../http'
import { ConnectionsService } from '../services/ConnectionsService'
import { MessagesService } from '../services/MessagesService'

io.on('connect', async (socket) => {
    const connectionsService = new ConnectionsService()
    const messagesService = new MessagesService()

    const allConnectionsWithoutAdmin = await connectionsService.list({ withoutAdmin: true })

    // IO EMIT O EVENTO PARA TODOS QUE ESTÃO CONECTADOS (GLOBAL)
    io.emit('admin_list_users', allConnectionsWithoutAdmin)

    socket.on('admin_list_messages_by_user', async (params, callback) => {
        const { user_id } = params

        const userMessages = await messagesService.list({ user_id })

        callback(userMessages)
    })

    socket.on('admin_send_message', async (params) => {
        const { text, user_id } = params

        await messagesService.create({
            text,
            user_id,
            admin_id: socket.id
        })

        await connectionsService.update({ user_id, admin_id: socket.id })

        const allUsers = await connectionsService.list({ withoutAdmin: true })

        io.emit('admin_list_users', allUsers)

        const { socket_id } = await connectionsService.find({ user_id })

        // ENVIA A MENSAGEM APENAS PARA O USUÁRIO DA CONEXÃO COM ESTE SOCKET
        io.to(socket_id).emit('admin_send_to_client', {
            text,
            socket_id: socket.id
        })
    })
})
