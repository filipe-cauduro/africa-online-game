import { Chance } from "chance"
import { remove } from "lodash"
import { Socket } from "socket.io"
import { Room, createRoom, sanitizeRoom } from "../models/room"
import { User } from "../models/user"
import { findUser } from "./users-manager"

const rooms: Room[] = []

const A_MINUTE_IN_MILISSECONDS = 60000

export type RoomClientEventTypes = {
  createRoom: (ownerId: User["id"], name: string) => void
  joinRoom: (roomId: Room["id"], userId: User["id"]) => void
  leaveRoom: (roomId: Room["id"], userId: User["id"]) => void
}

export type RoomServerEventTypes = {
  roomCreated: (id: Room["id"]) => void
}

const findRoom = (roomId: Room["id"]) =>
  rooms.find((room) => room.id === roomId)

const endRoom = (roomId: Room["id"]) => remove(rooms, ({ id }) => id === roomId)

export const makeCreateRoom = (
  socket: Socket
): [string, RoomClientEventTypes["createRoom"]] => {
  return [
    "createRoom",
    (...[ownerId, name]: Parameters<RoomClientEventTypes["createRoom"]>) => {
      const owner = findUser(ownerId)
      if (!owner) return
      const room = createRoom(owner, name ?? `Sala do ${owner.name}`)
      rooms.push(room)
      socket.emit("roomCreated", room.id)
      setTimeout(() => {
        if (!room.users.find((u) => u.id === room.owner.id))
          remove(rooms, (r) => r.id === room.id)
      }, A_MINUTE_IN_MILISSECONDS)
    },
  ]
}

export const makeJoinRoom = (
  socket: Socket
): [string, RoomClientEventTypes["joinRoom"]] => {
  return [
    "joinRoom",
    (...[roomId, userId]: Parameters<RoomClientEventTypes["joinRoom"]>) => {
      const user = findUser(userId)
      const room = findRoom(roomId)

      if (!user || !room || !!room.game) return

      room.users.push(user)
      socket.join(room.id)

      socket.emit("joinedRoom", sanitizeRoom(room))
    },
  ]
}

export const makeLeaveRoom = (
  socket: Socket
): [string, RoomClientEventTypes["leaveRoom"]] => {
  return [
    "leaveRoom",
    (...[roomId, userId]: Parameters<RoomClientEventTypes["leaveRoom"]>) => {
      const room = findRoom(roomId)

      if (!room) return

      remove(room.users, ({ id }) => id === userId)
      socket.leave(room.id)

      // If the user wasn't the owner of the room don't continue
      if (room.owner.id !== userId) return

      if (room.users.length === 0) return endRoom(roomId)

      const chance = new Chance()
      const user = chance.pickone(room.users)
      room.owner = user
      user.socket.emit("ownerChange")
    },
  ]
}
