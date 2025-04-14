/* eslint-disable @typescript-eslint/no-misused-promises */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('###########################################################');

  for (let i = 1; i < 11; i++) {
    const gender = i % 2 == 0 ? 'male' : 'female';
    const role = i % 2 == 0 ? 'admin' : 'user';
    const hashedPassword = await argon.hash('test@123');
    await prisma.user.create({
      data: {
        email: `${i}${faker.internet.email()}`,
        password: hashedPassword,
        fullname: faker.person.fullName(),
        username: faker.internet.username(),
        gender: gender,
        dob: faker.date.birthdate(),
        phoneNumber: faker.phone.number(),
        role: role,
        isVerified: faker.datatype.boolean(),
      },
    });
  }
  console.log('person seeds completed');
  console.log('######################################################');

  for (let i = 1; i < 11; i++) {
    await prisma.category.create({
      data: {
        name: `${i}${faker.airline.aircraftType()}`,
      },
    });
  }

  console.log('category seeds completed');
  console.log('#############################################################');

  for (let i = 1; i < 21; i++) {
    await prisma.opportunity.create({
      data: {
        title: faker.book.title(),
        //slug: faker.helpers.slugify(faker.book.series()),
        userId: faker.number.int({ min: 1, max: 10 }),
        location: faker.location.city(),
        description: faker.lorem.paragraph(),
        status: 'open',
        deadline: faker.date.future(),
        categoryId: faker.number.int({ min: 1, max: 10 }),
      },
    });
  }

  console.log('property seeds completed');
  console.log('########################## seeding ##########################');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
