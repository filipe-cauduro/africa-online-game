import { config } from "dotenv"

config()

export const API_PORT = (process.env.API_PORT || 3000) as number
export const TOKEN_SECRET = (process.env.TOKEN_SECRET || "any_token") as string
