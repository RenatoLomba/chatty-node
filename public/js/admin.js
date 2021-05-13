const socket = io()

let connectionsList = []

socket.on('admin_list_users', connections => {
    connectionsList = connections
    document.querySelector('#list_users').innerHTML = ''

    let template = document.querySelector('#template').innerHTML

    connections.forEach(connection => {
        const rendered = Mustache.render(template, {
            email: connection.user.email,
            id: connection.socket_id
        })

        document.querySelector('#list_users').innerHTML += rendered
    })
})

function call(id) {
    const connection = connectionsList.find(connection => connection.socket_id === id)

    const template = document.querySelector('#admin_template').innerHTML

    const rendered = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user_id
    })

    document.querySelector('#supports').innerHTML += rendered

    const params = {
        user_id: connection.user_id
    }

    socket.emit('admin_list_messages_by_user', params, messages => {
        const divMessages = document
            .querySelector(`#allMessages${connection.user_id}`)
        
        messages.forEach(message => {
            const createDiv = document.createElement('div')

            createDiv.className = message.admin_id === null
                ? 'admin_message_client'
                : 'admin_message_admin'

            createDiv.innerHTML = `<span style="font-weight: bold;letter-spacing: 1px;">
                ${message.admin_id === null ? connection.user.email : 'Atendente'}: 
            </span>`
            
            createDiv.innerHTML += `<span>${message.text}</span>`
            
            createDiv.innerHTML += `<span class="admin_date">
                ${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}
            </span>`
            
            divMessages.appendChild(createDiv)
        })
    })
}

function sendMessage(id) {
    const text = document.querySelector(`#send_message_${id}`)

    const params = {
        text: text.value,
        user_id: id
    }

    socket.emit('admin_send_message', params)

    const divMessages = document.querySelector(`#allMessages${id}`)

    const createDiv = document.createElement('div')

    createDiv.className = 'admin_message_admin'

    createDiv.innerHTML = `<span style="font-weight: bold;letter-spacing: 1px;">
        Atendente
    </span>`
    
    createDiv.innerHTML += `<span>${text.value}</span>`
    
    createDiv.innerHTML += `<span class="admin_date">
        ${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}
    </span>`

    divMessages.appendChild(createDiv)

    text.value = ''
    text.focus()
}

socket.on('admin_receive_message', params => {
    const connection = connectionsList.find(conn => conn.socket_id == params.socket_id)

    const divMessages = document.querySelector(`#allMessages${connection.user_id}`)

    const createDiv = document.createElement('div')

    createDiv.className = 'admin_message_client'

    createDiv.innerHTML = `<span style="font-weight: bold;letter-spacing: 1px;">
        ${connection.user.email}
    </span>`

    // console.log(params)
    
    createDiv.innerHTML += `<span>${params.message.text}</span>`
    
    createDiv.innerHTML += `<span class="admin_date">
        ${dayjs(params.message.created_at).format('DD/MM/YYYY HH:mm:ss')}
    </span>`

    divMessages.appendChild(createDiv)
})
