import { config } from "dotenv"

config()

export const API_PORT = (process.env.API_PORT || 3000) as number
