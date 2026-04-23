import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ✅ USERS (realistas)
  const usersData = [
    { name: "Alice Johnson", email: "alice@library.com" },
    { name: "Bob Smith", email: "bob@library.com" },
    { name: "Carol Williams", email: "carol@library.com" },
    { name: "David Brown", email: "david@library.com" },
    { name: "Emma Davis", email: "emma@library.com" },
    { name: "Frank Miller", email: "frank@library.com" },
    { name: "Grace Wilson", email: "grace@library.com" },
    { name: "Henry Moore", email: "henry@library.com" },
    { name: "Isabella Taylor", email: "isabella@library.com" },
    { name: "Jack Anderson", email: "jack@library.com" },
  ];

  const users = await Promise.all(
    usersData.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      }),
    ),
  );

  // ✅ BOOKS (reales, no fake)
  const booksData = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      description: "A story of decadence and excess set in the Jazz Age.",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "9780061120084",
      description: "A novel about racial injustice in the Deep South.",
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      description: "A dystopian novel about surveillance and control.",
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      isbn: "9780060850524",
      description:
        "A futuristic society driven by technology and conditioning.",
    },
    {
      title: "Moby Dick",
      author: "Herman Melville",
      isbn: "9781503280786",
      description: "The quest for the white whale.",
    },
    {
      title: "War and Peace",
      author: "Leo Tolstoy",
      isbn: "9780199232765",
      description: "A historical novel set during the Napoleonic wars.",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "9780141439518",
      description: "A romantic novel about manners and marriage.",
    },
    {
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      isbn: "9780140449136",
      description: "A psychological novel about guilt and redemption.",
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9780547928227",
      description: "A fantasy adventure preceding LOTR.",
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      isbn: "9780618640157",
      description: "An epic fantasy trilogy.",
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      isbn: "9780439708180",
      description: "A young wizard begins his journey.",
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      isbn: "9780316769174",
      description: "Teenage alienation and rebellion.",
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      isbn: "9780062315007",
      description: "A journey of self-discovery.",
    },
    {
      title: "The Book Thief",
      author: "Markus Zusak",
      isbn: "9780375842207",
      description: "A story set in Nazi Germany.",
    },
    {
      title: "The Hunger Games",
      author: "Suzanne Collins",
      isbn: "9780439023481",
      description: "A dystopian survival competition.",
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441172719",
      description: "A science fiction epic on desert planet Arrakis.",
    },
    {
      title: "The Road",
      author: "Cormac McCarthy",
      isbn: "9780307387899",
      description: "A post-apocalyptic journey.",
    },
    {
      title: "The Shining",
      author: "Stephen King",
      isbn: "9780307743657",
      description: "A horror story in an isolated hotel.",
    },
    {
      title: "Dracula",
      author: "Bram Stoker",
      isbn: "9780486411095",
      description: "The classic vampire tale.",
    },
    {
      title: "Frankenstein",
      author: "Mary Shelley",
      isbn: "9780486282114",
      description: "A scientist creates life.",
    },
    {
      title: "The Odyssey",
      author: "Homer",
      isbn: "9780140268867",
      description: "Epic journey of Odysseus.",
    },
    {
      title: "The Iliad",
      author: "Homer",
      isbn: "9780140275360",
      description: "The Trojan War story.",
    },
    {
      title: "Don Quixote",
      author: "Miguel de Cervantes",
      isbn: "9780060934347",
      description: "A knight’s delusional adventures.",
    },
    {
      title: "Les Misérables",
      author: "Victor Hugo",
      isbn: "9780451419439",
      description: "Justice, love, and redemption.",
    },
    {
      title: "Anna Karenina",
      author: "Leo Tolstoy",
      isbn: "9780143035008",
      description: "A tragic love story.",
    },
    {
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      isbn: "9781594631931",
      description: "Friendship and redemption in Afghanistan.",
    },
    {
      title: "Life of Pi",
      author: "Yann Martel",
      isbn: "9780156027328",
      description: "A survival story at sea.",
    },
    {
      title: "The Fault in Our Stars",
      author: "John Green",
      isbn: "9780142424179",
      description: "A love story of two teens with cancer.",
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      isbn: "9780307588371",
      description: "A psychological thriller.",
    },
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      isbn: "9780307474278",
      description: "A mystery involving secret societies.",
    },
  ];

  const books = await Promise.all(
    booksData.map((book) =>
      prisma.book.upsert({
        where: { isbn: book.isbn },
        update: {},
        create: {
          ...book,
          coverUrl: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
        },
      }),
    ),
  );

  console.log(`Created ${users.length} users and ${books.length} books`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
