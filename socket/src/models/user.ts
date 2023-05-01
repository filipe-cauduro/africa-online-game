import { pick } from "lodash"
import { Socket } from "socket.io"
import { v4 } from "uuid"

export type User = {
  id: string
  name: string
  socket: Socket
}

export type CreateUserProps = Partial<Pick<User, "id">> &
  Pick<User, "name" | "socket">

export const createUser = ({ id, name, socket }: CreateUserProps): User => ({
  id: id ?? v4(),
  name,
  socket,
})

export const sanitizeUser = (user: User) => pick(user, ["id", "name"])
