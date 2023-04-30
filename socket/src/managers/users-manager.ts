import { remove } from "lodash"
import { Socket } from "socket.io"
import { User, createUser } from "../models/user"

const users: User[] = []

export type UserClientEventTypes = {
  authMe: (name: string, token?: string) => void
}

export const findUser = (userId: User["id"]) =>
  users.find(({ id }) => id === userId)

const makeUser = (socket: Socket, name: string, token?: string) => {
  //TODO: handle validate token
  if (token) {
    // TODO: handle extract token to user object
    const userProps = {} as User
    return createUser(userProps)
  } else {
    return createUser({ name, socket })
  }
}

export const makeAuthMe = (
  socket: Socket
): [string, UserClientEventTypes["authMe"]] => {
  return [
    "authMe",
    (name: string, token?: string) => {
      const newUser = makeUser(socket, name, token)
      users.push(newUser)

      if (!token) {
        // TODO: create token for user reconnection
        const refreshedToken = ""
        // socket.send("refreshToken", refreshedToken)
      }

      socket.on("disconnect", () => {
        remove(users, (user) => user.id === newUser.id)
      })
    },
  ]
}
