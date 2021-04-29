import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const chantersGroupName = 'chanters'
  const readersGroupName = 'readers'

  const adminChanterUser = await prisma.user.upsert({
    where: { email: 'bill@example.com' },
    update: {},
    create: {
      firstName: 'Bill',
      lastName: 'Bob',
      email: 'bill@example.com',
      groups: {
        connectOrCreate: [
          {
            where: { name: chantersGroupName },
            create: { name: chantersGroupName }
          }
        ]
      }
    }
  })

  const readerUser = await prisma.user.upsert({
    where: { email: 'foo@bar.com' },
    update: {},
    create: {
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'foo@bar.com',
      groups: {
        connectOrCreate: [
          {
            where: { name: readersGroupName },
            create: { name: readersGroupName }
          }
        ]
      }
    }
  })

  const date = new Date()
  date.setDate(date.getDate() + 7)

  const signupItem1 = await prisma.signupItem.create({
    data: {
      date,
      title: 'Troparion of the Holy Cross',
      description: 'Sung during Matins',
      link: 'https://www.example.com',
      eligibleGroups: {
        connectOrCreate: [
          {
            where: { name: chantersGroupName },
            create: { name: chantersGroupName }
          }
        ]
      },
      assignee: {
        connect: { id: adminChanterUser.id }
      },
      createdBy: {
        connect: { id: adminChanterUser.id }
      }
    }
  })

  const signupItem2 = await prisma.signupItem.create({
    data: {
      date,
      title: 'Psalm 51',
      description: 'Read during Vespers',
      link: 'https://www.example.com',
      eligibleGroups: {
        connectOrCreate: [
          {
            where: { name: readersGroupName },
            create: { name: readersGroupName }
          }
        ]
      },
      assignee: {
        connect: { id: readerUser.id }
      },
      createdBy: {
        connect: { id: readerUser.id }
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
