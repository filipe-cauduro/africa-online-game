import { pick } from "lodash"
import { v4 } from "uuid"
import { Game } from "./game"
import { User, sanitizeUser } from "./user"

export type Room = {
  id: string
  name: string
  password?: string
  users: User[]
  owner: User
  game?: Game
}

export const createRoom = (
  owner: User,
  name?: string,
  password?: string
): Room => ({
  id: v4(),
  name: name ?? `Sala de ${owner.name}`,
  owner,
  password,
  users: [owner],
})

export const sanitizeRoom = ({ owner, users, ...room }: Room) => ({
  ...pick(room, ["id", "name"]),
  owner: sanitizeUser(owner),
  users: users.map((user) => sanitizeUser(user)),
})
