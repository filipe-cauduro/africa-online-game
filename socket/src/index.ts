import { server } from "./app"
import { API_PORT } from "./envs"

server.listen(API_PORT, () =>
  console.log(`=> Socket API is running on port ${API_PORT}`)
)
