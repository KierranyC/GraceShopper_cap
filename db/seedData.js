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
        "sessionId" UUID UNIQUE
      );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        category VARCHAR(255),
        photo VARCHAR(255),
        featured BOOLEAN DEFAULT true
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
        "guestId" UUID REFERENCES guests("sessionId"),
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
    DROP TABLE IF EXISTS "cartItems" CASCADE;
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
    // const newProducts = [
    //   {
    //     id: 1,
    //     title: "Argan Oil",
    //     description:
    //       "Premium moroccan argan oil that brings shine back to dull hair!",
    //     price: 24,
    //     quantity: 5000,
    //     category: "Moisturizing Oils",
    //     photo: "placeholder",
    //     stripe_id: 'prod_OXKv7hjNtNC4ka'
    //   },
    //   {
    //     id: 2,
    //     title: "Coconut and Tea Tree Oil",
    //     description: "Premium scalp oil!",
    //     price: 24,
    //     quantity: 5000,
    //     category: "Scalp Oils",
    //     photo: 'placeholder',
    //     stripe_id: 'prod_OXL1j7T4DhRqy0'
    //   },
    //   {
    //     id: 3,
    //     title: "Vegan and Non-GMO Oil",
    //     description: "Premium vegan and non-GMO oil!",
    //     price: 24,
    //     quantity: 5000,
    //     category: "Vegan Oils",
    //     photo: 'placeholder!',
    //     stripe_id: 'prod_OXL3pGIPAv6ozY'
    //   }
    // ]

    const newProducts = [
      {
        title: "Argan Oil",
        description:
          "Premium moroccan argan oil that brings shine back to dull hair!",
        price: 24,
        quantity: 5000,
        category: "Moisturizing Oils",
        photo:
          "https://media.istockphoto.com/id/1284541685/photo/hair-care-routine-oil-for-head-girl-holding-dropper.jpg?s=612x612&w=0&k=20&c=YTKFT2zyLZcVEEj5TZDUfftDfo1kD4CQE3MUrYx-vI4=",
        featured: true,
      },
      {
        title: "Coconut and Tea Tree Oil",
        description: "Premium scalp oil!",
        price: 24,
        quantity: 5000,
        category: "Scalp Oils",
        photo:
          "https://media.istockphoto.com/id/1277418311/photo/coconut-oil-and-fresh-coconuts-on-the-wooden-table.jpg?s=612x612&w=0&k=20&c=l09vIHLwPsySZt3lKBprefSwnO8hFT-ijwG-GkfGyDw=",
      },
      {
        title: "Vegan and Non-GMO Oil",
        description: "Premium vegan and non-GMO oil!",
        price: 24,
        quantity: 5000,
        category: "Vegan Oils",
        photo:
          "https://media.istockphoto.com/id/1297167045/photo/natural-cosmetics-for-beauty-of-face-and-body-on-green-background-from-plants.jpg?s=612x612&w=0&k=20&c=CYIp0qVk3-Lsm3qdTuJ6dpRFUrSdUORywHIpH8ImhGk=",
      },
      {
        title: "Silky Smooth Shampoo",
        description:
          "Revitalize and strengthen your hair with our silky smooth shampoo.",
        price: 12,
        quantity: 2500,
        category: "Shampoo",
        photo:
          "https://img.freepik.com/premium-photo/shampoo-hair-mask-comb-with-fresh-green-leaves-natural-hair-care-cosmetics-with-copy-space_541595-73.jpg",
      },
      {
        title: "Hydrating Conditioner",
        description:
          "Deeply hydrate and nourish your hair with our premium conditioner.",
        price: 14,
        quantity: 2000,
        category: "Conditioner",
        photo:
          "https://static.vecteezy.com/system/resources/thumbnails/015/955/167/small/close-up-wooden-combs-hair-combs-with-conditioner-for-hair-and-personal-care-on-background-hair-treatment-concept-photo.jpg",
        featured: true,
      },
      {
        title: "Curl Enhancing Cream",
        description:
          "Define and enhance your natural curls with our specialized cream.",
        price: 18,
        quantity: 1800,
        category: "Styling Products",
        photo:
          "https://media.istockphoto.com/id/535406446/photo/woman-holding-a-bowl-with-nourishing-mask.jpg?s=612x612&w=0&k=20&c=X_NdEfgpwHjtITJ_m7krRPB704Ytx3tFoZZkR-Lq9sE=",
      },
      {
        title: "Heat Protectant Spray",
        description:
          "Shield your hair from heat damage with our effective heat protectant spray.",
        price: 16,
        quantity: 2200,
        category: "Styling Products",
        photo:
          "https://plus.unsplash.com/premium_photo-1661455940147-069a3c8b2feb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8&w=1000&q=80",
      },
      {
        title: "Color Care Shampoo",
        description:
          "Extend the life of your hair color with our color care shampoo.",
        price: 13,
        quantity: 2100,
        category: "Shampoo",
        photo:
          "https://cdn.pixabay.com/photo/2018/06/28/01/49/blue-hair-3503011_640.jpg",
      },
      {
        title: "Repairing Hair Mask",
        description:
          "Repair and restore damaged hair with our rejuvenating hair mask.",
        price: 20,
        quantity: 1700,
        category: "Hair Masks",
        photo:
          "https://media.istockphoto.com/id/975941870/photo/natural-hair-treatment-with-coconut.jpg?s=612x612&w=0&k=20&c=hNhIFgYFVb6nETjeq86el7SmhIMUIAZyC3kbWLzRymU=",
        featured: true,
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
