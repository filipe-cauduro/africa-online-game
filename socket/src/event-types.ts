import {
  RoomClientEventTypes,
  RoomServerEventTypes,
  makeCreateRoom,
  makeJoinRoom,
  makeLeaveRoom,
} from "./managers/rooms-manger"
import { UserClientEventTypes, makeAuthMe } from "./managers/users-manager"

export type ClientToServerEvents = UserClientEventTypes & RoomClientEventTypes
export const clientToServerEvents = {
  makeAuthMe,
  makeCreateRoom,
  makeJoinRoom,
  makeLeaveRoom,
}

export type ServerToClientEvents = RoomServerEventTypes
