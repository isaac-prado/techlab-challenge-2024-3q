import { app } from "./app.js";
import { APP_PORT } from "./constants/env.js";
import { profiles } from "./constants/profiles.js";
import { Consumer } from "./entities/Consumer.js";
import { User } from "./entities/User.js";
import { database } from "./services/database.js";
import { faker } from "@faker-js/faker";

await database.initialize()

app.listen(APP_PORT, () => {
  console.log(`server is running on port ${APP_PORT}`)
})

/* POPULANDO A TABELA Users

const userRepository = database.getRepository(User)

function createRandomUser(): Partial<User> {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profile: faker.helpers.arrayElement(Object.keys(profiles)) as keyof typeof profiles,
  };
}

const users: Partial<User>[] = [];
for (let i=0; i<30; i++) {
  users.push(createRandomUser());
}

await userRepository.save(users);

console.log("Dados de USER inseridos com sucesso!");
*/

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