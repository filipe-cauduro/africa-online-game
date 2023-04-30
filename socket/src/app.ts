import express from "express"
import { createServer } from "http"
import { values } from "lodash"
import { Server, Socket } from "socket.io"
import {
  ClientToServerEvents,
  ServerToClientEvents,
  clientToServerEvents,
} from "./event-types"

export const app = express()
export const server = createServer(app)
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(server)

// Client to server events
io.on("connection", (socket: Socket) => {
  values(clientToServerEvents).forEach((makeFn) => {
    const [key, callback] = makeFn(socket)
    socket.on(key, callback)
  })
})
