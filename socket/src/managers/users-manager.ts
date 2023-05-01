import { pick, remove } from "lodash"
import { Socket } from "socket.io"
import { CreateUserProps, User, createUser } from "../models/user"
import { generateToken, validateToken } from "./auth-manager"

const users: User[] = []

export type UserClientEventTypes = {
  authMe: (name: string, token?: string) => void
}

export const findUser = (userId: User["id"]) =>
  users.find(({ id }) => id === userId)

const makeUser = (socket: Socket, name: string, token?: string) => {
  if (token) {
    const payload = validateToken(token)

    if (!findUser(payload.id))
      return createUser({
        ...(pick(payload, ["id", "name"]) as CreateUserProps),
        socket,
      })

    return createUser({ name: payload.name, socket })
  }

  return createUser({ name, socket })
}

export const makeAuthMe = (
  socket: Socket
): [string, UserClientEventTypes["authMe"]] => {
  return [
    "authMe",
    (name: string, token?: string) => {
      const newUser = makeUser(socket, name, token)
      users.push(newUser)

      const refreshedToken = generateToken(newUser)
      socket.send("refreshToken", refreshedToken)

      socket.on("disconnect", () => {
        remove(users, (user) => user.id === newUser.id)
      })
    },
  ]
}
