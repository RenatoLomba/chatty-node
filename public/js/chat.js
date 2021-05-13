let socket_admin_id = null

document.querySelector("#start_chat").addEventListener("click", (event) => {
    const socket = io()

    const chat_help = document.getElementById('chat_help')
    chat_help.style.display = 'none'

    const chat_in_support = document.getElementById('chat_in_support')
    chat_in_support.style.display = 'block'

    const email = document.getElementById('email').value
    const text = document.getElementById('txt_help').value

    socket.on('connect', () => {
        const params = { email, text }
        socket.emit('client_first_access', params, (callback, error) => {
            if (error) {
                console.log(error)
            } else {
                console.log(callback)
            }
        })
    })

    socket.on('client_list_all_messages', messages => {
        const template_client = document
            .querySelector('#message-user-template')
            .innerHTML
        
        const template_admin = document
            .querySelector('#admin-template')
            .innerHTML
        
        const messagesList = [...messages]

        messagesList.forEach(message => {
            const rendered = Mustache.render(message['admin_id'] === null
                ? template_client : template_admin,
                {
                    message: message.text,
                    message_admin: message.text,
                    email: message.user.email
                })

            document.querySelector('#messages').innerHTML += rendered
        })
    })

    socket.on('admin_send_to_client', message => {
        socket_admin_id = message.socket_id

        const template_admin = document
            .querySelector('#admin-template')
            .innerHTML

        const rendered = Mustache.render(template_admin,
            {
                message_admin: message.text
            })

        document.querySelector('#messages').innerHTML += rendered
    })

    document.querySelector('#send_message_button').addEventListener('click', () => {
        const textUser = document.querySelector('#message_user')

        const params = {
            text: textUser.value,
            socket_admin_id
        }

        socket.emit('client_send_to_admin', params)

        const template_client = document
            .querySelector('#message-user-template')
            .innerHTML
        
        const rendered = Mustache.render(template_client,
            {
                message: textUser.value,
                email
            })
        
        document.querySelector('#messages').innerHTML += rendered

        textUser.value = ''
        textUser.focus()
    })

});
