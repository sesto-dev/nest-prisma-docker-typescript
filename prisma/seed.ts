import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Seed Users with Roles
async function seedUsers() {
  const users: any[] = [];
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: await bcrypt.hash('password', 10),
        phone: faker.phone.number(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatar: faker.image.avatar(),
        roles: ['USER'],
      },
    });
    users.push(user);
  }
  return users;
}

// Seed Artists
async function seedArtists(users: any[]) {
  const artists: any[] = [];
  for (const user of users.slice(0, 5)) {
    const artist = await prisma.artistProfile.create({
      data: {
        bio: faker.lorem.paragraph(),
        website: faker.internet.url(),
        user: { connect: { id: user.id } },
        isVerified: faker.datatype.boolean(),
      },
    });
    artists.push(artist);
  }
  return artists;
}

// Seed Galleries
async function seedGalleries(users: any[]) {
  const galleries: any[] = [];
  for (const user of users.slice(5, 10)) {
    const gallery = await prisma.galleryProfile.create({
      data: {
        name: faker.company.name(),
        bio: faker.lorem.paragraph(),
        website: faker.internet.url(),
        location: faker.location.city(),
        user: { connect: { id: user.id } },
        isVerified: faker.datatype.boolean(),
      },
    });
    galleries.push(gallery);
  }
  return galleries;
}

// Seed Collectors
async function seedCollectors(users: any[]) {
  const collectors: any[] = [];
  for (const user of users.slice(10, 15)) {
    const collector = await prisma.collectorProfile.create({
      data: {
        bio: faker.lorem.paragraph(),
        website: faker.internet.url(),
        user: { connect: { id: user.id } },
        isVerified: faker.datatype.boolean(),
      },
    });
    collectors.push(collector);
  }
  return collectors;
}

// Seed Artworks
async function seedArtworks(artists: any[], galleries: any[]) {
  const artworks: any[] = [];
  for (let i = 0; i < 10; i++) {
    const artwork = await prisma.artwork.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        tags: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
        type: ['DIGITAL', 'PHYSICAL'],
        location: faker.location.city(),
        weight: faker.number.float({ min: 1, max: 100 }),
        height: faker.number.float({ min: 10, max: 100 }),
        width: faker.number.float({ min: 10, max: 100 }),
        depth: faker.number.float({ min: 1, max: 10 }),
        artists: { connect: { id: artists[i % artists.length].id } },
        galleries: { connect: { id: galleries[i % galleries.length].id } },
      },
    });
    artworks.push(artwork);
  }
  return artworks;
}

// Seed Auctions
async function seedAuctions(artworks: any[]) {
  const auctions: any[] = [];
  for (const artwork of artworks) {
    const auction = await prisma.auction.create({
      data: {
        artwork: { connect: { id: artwork.id } },
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        startingBid: faker.number.float({ min: 100, max: 1000 }),
        status: 'UPCOMING',
      },
    });
    auctions.push(auction);
  }
  return auctions;
}

// Seed Bids
async function seedBids(auctions: any[], collectors: any[]) {
  const bids: any[] = [];
  for (const auction of auctions) {
    for (let i = 0; i < 3; i++) {
      const bid = await prisma.bid.create({
        data: {
          amount: faker.number.float({
            min: auction.startingBid,
            max: auction.startingBid * 2,
          }),
          bidder: { connect: { id: collectors[i % collectors.length].id } },
          auction: { connect: { id: auction.id } },
        },
      });
      bids.push(bid);
    }
  }
  return bids;
}

// Seed Payments
async function seedPayments(artworks: any[], collectors: any[]) {
  const payments: any[] = [];
  for (const artwork of artworks.slice(0, 5)) {
    const payment = await prisma.payment.create({
      data: {
        status: 'PAID',
        refId: faker.string.uuid(),
        isSuccessful: true,
        amount: faker.number.float({ min: 100, max: 1000 }),
        commissionAmount: faker.number.float({ min: 10, max: 100 }),
        curatorCommission: faker.number.float({ min: 5, max: 50 }),
        artwork: { connect: { id: artwork.id } },
        collector: { connect: { id: collectors[0].id } },
      },
    });
    payments.push(payment);
  }
  return payments;
}

// Main Seed Function
async function main() {
  console.log('Seeding database...');

  // Seed Users
  const users = await seedUsers();
  console.log(`Seeded ${users.length} users.`);

  // Seed Artists
  const artists = await seedArtists(users);
  console.log(`Seeded ${artists.length} artists.`);

  // Seed Galleries
  const galleries = await seedGalleries(users);
  console.log(`Seeded ${galleries.length} galleries.`);

  // Seed Collectors
  const collectors = await seedCollectors(users);
  console.log(`Seeded ${collectors.length} collectors.`);

  // Seed Artworks
  const artworks = await seedArtworks(artists, galleries);
  console.log(`Seeded ${artworks.length} artworks.`);

  // Seed Auctions
  const auctions = await seedAuctions(artworks);
  console.log(`Seeded ${auctions.length} auctions.`);

  // Seed Bids
  const bids = await seedBids(auctions, collectors);
  console.log(`Seeded ${bids.length} bids.`);

  // Seed Payments
  const payments = await seedPayments(artworks, collectors);
  console.log(`Seeded ${payments.length} payments.`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
