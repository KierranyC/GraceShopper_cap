import client from "./client.js";
import { createUser, getAllUsers } from "./models/user.js";
import { createProduct, getAllProducts } from "./models/products.js";
import { createOrder } from "./models/orders.js";

export async function createTables() {
  console.log("Starting to build tables...");
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        "isAdmin" BOOLEAN
      );
      CREATE TABLE guests (
        id SERIAL PRIMARY KEY,
        "sessionId" UUID
      );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        category VARCHAR(255) NOT NULL,
        photo BYTEA
      );
       CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),  
        "guestId" INTEGER REFERENCES guests(id),      
        date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "totalAmount" INTEGER,
        "orderStatus" VARCHAR(50)
      );
      CREATE TABLE "orderItems" (
        id SERIAL PRIMARY KEY,
        "orderId" INTEGER REFERENCES orders(id),
        "productId" INTEGER REFERENCES products(id),
        quantity INTEGER,
        price INTEGER
      );
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "guestId" INTEGER REFERENCES guests(id),
        "productId" INTEGER REFERENCES products(id),
        body TEXT NOT NULL
      );
      CREATE TABLE "cartItems" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "guestId" INTEGER REFERENCES guests(id),
        "productId" INTEGER REFERENCES products(id),
        quantity INTEGER DEFAULT 0 
      );
    `);
    console.log("Tables Created!");
  } catch (error) {
    console.log("Error creating tables");
    throw error;
  }
}

export async function dropTables() {
  console.log("Dropping All Tables...");
  try {
    await client.query(`
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS "orderItems" CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS guests CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log("Tables Dropped!");
  } catch (error) {
    console.log("Error droping tables");
    throw error;
  }
}

export async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const newUsers = [
      {
        email: "sheryl123@gmail.com",
        username: "sheryl",
        password: "badgyalsheryl1",
        isAdmin: false,
      },
      {
        email: "lani@gmail.com",
        username: "lani",
        password: "banana246",
        isAdmin: false,
      },
      {
        email: "roberto1@gmail.com",
        username: "roberto",
        password: "iluvicecream",
        isAdmin: false,
      },
    ];

    const users = await Promise.all(newUsers.map(createUser));

    const newAdmin = [
      {
        email: "jimmy1@gmail.com",
        username: "jimmy",
        password: "jimmyjam",
        isAdmin: true,
      },
      {
        email: "danny234@gmail.com",
        username: "danny",
        password: "dan2kool",
        isAdmin: true,
      },
      {
        email: "tony24@gmail.com",
        username: "tony",
        password: "tonydaboss",
        isAdmin: true,
      },
    ];

    const adminUsers = await Promise.all(newAdmin.map(createUser));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
    console.log("Admin users created:");
    console.log(adminUsers);
    console.log("Finished creating admin users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

export async function getInitialUsers() {
  console.log("Starting to get initial users...");
  try {
    const allUsers = await getAllUsers();

    console.log("All users:");
    console.log(allUsers);
    console.log("Finished getting all users!");
  } catch (error) {
    console.error("Error getting users!");
  }
}

export async function createInitialProducts() {
  console.log("Starting to create products...");
  try {
    const newProducts = [
      {
        id: 1,
        title: "Argan Oil",
        description:
          "Premium moroccan argan oil that brings shine back to dull hair!",
        price: 24,
        quantity: 5000,
        category: "Moisturizing Oils",
        photo: "placeholder",
      },
      {
        id: 2,
        title: "Coconut and Tea Tree Oil",
        description: "Premium scalp oil!",
        price: 24,
        quantity: 5000,
        category: "Scalp Oils",
        photo: "placeholder",
      },
      {
        id: 3,
        title: "Vegan and Non-GMO Oil",
        description: "Premium vegan and non-GMO oil!",
        price: 24,
        quantity: 5000,
        category: "Vegan Oils",
        photo: "placeholder!",
      },
      {
        title: "Silky Smooth Shampoo",
        description:
          "Revitalize and strengthen your hair with our silky smooth shampoo.",
        price: 12,
        quantity: 2500,
        category: "Shampoo",
        photo: "placeholder",
      },
      {
        title: "Hydrating Conditioner",
        description:
          "Deeply hydrate and nourish your hair with our premium conditioner.",
        price: 14,
        quantity: 2000,
        category: "Conditioner",
        photo: "placeholder",
      },
      {
        title: "Curl Enhancing Cream",
        description:
          "Define and enhance your natural curls with our specialized cream.",
        price: 18,
        quantity: 1800,
        category: "Styling Products",
        photo: "placeholder",
      },
      {
        title: "Heat Protectant Spray",
        description:
          "Shield your hair from heat damage with our effective heat protectant spray.",
        price: 16,
        quantity: 2200,
        category: "Styling Products",
        photo: "placeholder",
      },
      {
        title: "Color Care Shampoo",
        description:
          "Extend the life of your hair color with our color care shampoo.",
        price: 13,
        quantity: 2100,
        category: "Shampoo",
        photo: "placeholder",
      },
      {
        title: "Repairing Hair Mask",
        description:
          "Repair and restore damaged hair with our rejuvenating hair mask.",
        price: 20,
        quantity: 1700,
        category: "Hair Masks",
        photo: "placeholder",
      },
    ];

    const products = await Promise.all(newProducts.map(createProduct));
    console.log("Products:");
    console.log(products);
    console.log("Finished creating products!");
  } catch (error) {
    console.error("Error creating products!");
  }
}

export async function getInitialProducts() {
  console.log("Starting to get initial products...");
  try {
    const allProducts = await getAllProducts();

    console.log("All products:", allProducts);
    console.log("Finished getting all products!");
  } catch (error) {
    console.error("Error getting products!");
  }
}

export async function createInitialOrders() {
  console.log("Starting to create orders...");
  try {
    const newOrders = [
      {
        userId: 1,
        productId: 3,
        totalAmount: 2,
        orderStatus: "In Transit",
      },
      {
        userId: 2,
        productId: 3,
        totalAmount: 2,
        orderStatus: "In Transit",
      },
      {
        userId: 3,
        productId: 3,
        totalAmount: 2,
        orderStatus: "In Transit",
      },
      {
        userId: 4,
        productId: 3,
        totalAmount: 2,
        orderStatus: "In Transit",
      },
      {
        userId: 5,
        productId: 3,
        totalAmount: 2,
        orderStatus: "In Transit",
      },
      {
        userId: 6,
        productId: 3,
        totalAmount: 2,
        orderStatus: "In Transit",
      },
    ];

    const orders = await Promise.all(newOrders.map(createOrder));
    console.log("Orders:");
    console.log(orders);
    console.log("Finished creating orders!");
  } catch (error) {
    console.error("Error creating orders!");
  }
}

export async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    //add in create intial stuff for testing when avalible
    await createInitialUsers();
    await getInitialUsers();
    await createInitialProducts();
    await getInitialProducts();
    await createInitialOrders();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}
