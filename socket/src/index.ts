import { app } from "./app"
import { API_PORT } from "./envs"

app.listen(API_PORT, () => {
  console.log(`=> Socket API is running on port ${API_PORT}`)
})
