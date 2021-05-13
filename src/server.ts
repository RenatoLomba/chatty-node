import { http } from "./http"
import './websocket/client'
import './websocket/admin'

const port = 3333
const url = `http://localhost:${3333}`

http.listen(port, () => console.log(`Server is running on ${url}`))
