import { pick } from "lodash"
import { Socket } from "socket.io"
import { v4 } from "uuid"

export type User = {
  id: string
  name: string
  socket: Socket
}

export const createUser = ({
  id,
  name,
  socket,
}: Pick<User, "name" | "socket"> & Partial<Pick<User, "id">>): User => ({
  id: id ?? v4(),
  name,
  socket,
})

export const sanitizeUser = (user: User) => pick(user, ["id", "name"])
