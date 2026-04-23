import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@library.com' },
      update: {},
      create: { name: 'Alice Johnson', email: 'alice@library.com' },
    }),
    prisma.user.upsert({
      where: { email: 'bob@library.com' },
      update: {},
      create: { name: 'Bob Smith', email: 'bob@library.com' },
    }),
    prisma.user.upsert({
      where: { email: 'carol@library.com' },
      update: {},
      create: { name: 'Carol Williams', email: 'carol@library.com' },
    }),
  ]);

  const books = await Promise.all([
    prisma.book.upsert({
      where: { isbn: '9780743273565' },
      update: {},
      create: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        description: 'A story of decadence and excess set in the Jazz Age.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9780061120084' },
      update: {},
      create: {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        description: "A novel about racial injustice and moral growth in Alabama's Deep South.",
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9780451524935' },
      update: {},
      create: {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        description: 'A dystopian novel set in a totalitarian society.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9780316769174' },
      update: {},
      create: {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '9780316769174',
        description: 'The story of Holden Caulfield, a disenchanted teenager.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg',
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9780062315007' },
      update: {},
      create: {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        isbn: '9780062315007',
        description: "A philosophical novel about a shepherd's journey.",
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9780385490818' },
      update: {},
      create: {
        title: 'The Handmaid\'s Tale',
        author: 'Margaret Atwood',
        isbn: '9780385490818',
        description: 'A dystopian novel set in the Republic of Gilead.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg',
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9780439708180' },
      update: {},
      create: {
        title: "Harry Potter and the Sorcerer's Stone",
        author: 'J.K. Rowling',
        isbn: '9780439708180',
        description: 'The first book in the Harry Potter series.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
      },
    }),
    prisma.book.upsert({
      where: { isbn: '9780618346257' },
      update: {},
      create: {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        isbn: '9780618346257',
        description: 'An epic high-fantasy novel.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780618346257-L.jpg',
      },
    }),
  ]);

  console.log(`Created ${users.length} users and ${books.length} books`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
