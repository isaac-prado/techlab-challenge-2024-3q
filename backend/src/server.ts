import { app } from "./app.js";
import { APP_PORT } from "./constants/env.js";
import { profiles } from "./constants/profiles.js";
import { Consumer } from "./entities/Consumer.js";
import { Conversation } from "./entities/Conversation.js";
import { ConversationMessage, ConversationMessageBy } from "./entities/ConversationMessage.js";
import { User } from "./entities/User.js";
import { database } from "./services/database.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt"

await database.initialize()

app.listen(APP_PORT, () => {
  console.log(`server is running on port ${APP_PORT}`)
})

/* POPULANDO A TABELA USER ( ERRO NO BCRYPT )

const userRepository = database.getRepository(User)

async function createRandomUser(): Promise<Partial<User>> {
  const saltRounds = 10;
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: await bcrypt.hash(faker.internet.password(), saltRounds),
    profile: faker.helpers.arrayElement(Object.keys(profiles)) as keyof typeof profiles,
  };
}

const users: Partial<User>[] = [];
for (let i=0; i<30; i++) {
  users.push(await createRandomUser());
}

await userRepository.save(users);

console.log("Dados de USER inseridos com sucesso!");

/* POPULANDO A TABELA Consumers
const consumerRepository = database.getRepository(Consumer)

function createRandomConsumer(): Partial<Consumer> {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    document: faker.string.numeric(11),
    birthDate: faker.date.birthdate(),
  };
}

const consumers: Partial<Consumer>[] = [];
for (let i=0; i<50; i++) {
  consumers.push(createRandomConsumer());
}

await consumerRepository.save(consumers);

console.log("Dados de CONSUMER inseridos com sucesso!");
*/

/* POPULANDO AS TABELAS Conversation e ConversationMessage
const usersToPopulateConv = await database.manager.find(User);
const consumersToPopulateConv = await database.manager.find(Consumer);

for (let i=0; i<15; i++) {
  const conversation = database.manager.create(Conversation, {
    subject: faker.lorem.sentence(),
    consumer: faker.helpers.arrayElement(consumersToPopulateConv),
    user: faker.helpers.arrayElement(usersToPopulateConv),
  });
  await database.manager.save(conversation)

  const numMessages = faker.number.int({ min: 3, max: 10 });
  for (let i=0; i < numMessages; i++) {
    const messageOwner = faker.helpers.arrayElement([
      ConversationMessageBy.User,
      ConversationMessageBy.Consumer,
      ConversationMessageBy.System,
    ]);

    const message = database.manager.create(ConversationMessage, {
      content: faker.lorem.paragraph(),
      by: messageOwner,
      conversation: conversation,
      user: messageOwner === ConversationMessageBy.User ? conversation.user : null,
    });

    await database.manager.save(message)
  }
}

console.log("Dados de Mensagem inseridos com")
*/