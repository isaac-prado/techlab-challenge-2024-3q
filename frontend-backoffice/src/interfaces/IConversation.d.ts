import { IConsumer } from "./IConsumer.js"
import { IUser } from "./IUser.js"

export interface IConversation {
  id: string
  subject: string
  consumer: IConsumer
  IUser: IUser
}
