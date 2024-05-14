/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    isAdmin: { type: 'boolean' }
  });

  pgm.createTable('guests', {
    id: { type: 'serial', primaryKey: true },
    sessionId: { type: 'uuid', unique: true }
  });

  pgm.createTable('products', {
    id: { type: 'serial', primaryKey: true },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    price: { type: 'decimal(10, 2)', notNull: true },
    quantity: { type: 'integer', notNull: true },
    category: { type: 'varchar(255)' },
    photo: { type: 'varchar(255)' },
    featured: { type: 'boolean', default: true }
  });

  pgm.createTable('orders', {
    id: { type: 'serial', primaryKey: true },
    userId: { type: 'integer', references: 'users(id)' },
    guestId: { type: 'integer', references: 'guests(id)' },
    date: { type: 'timestamptz', default: pgm.func('current_timestamp') },
    totalAmount: { type: 'integer' },
    orderStatus: { type: 'varchar(50)' }
  });

  pgm.createTable('orderItems', {
    id: { type: 'serial', primaryKey: true },
    orderId: { type: 'integer', references: 'orders(id)' },
    productId: { type: 'integer', references: 'products(id)' },
    quantity: { type: 'integer' },
    price: { type: 'integer' }
  });

  pgm.createTable('reviews', {
    id: { type: 'serial', primaryKey: true },
    userId: { type: 'integer', references: 'users(id)' },
    guestId: { type: 'integer', references: 'guests(id)' },
    productId: { type: 'integer', references: 'products(id)' },
    body: { type: 'text', notNull: true }
  });

  pgm.createTable('cartItems', {
    id: { type: 'serial', primaryKey: true },
    userId: { type: 'integer', references: 'users(id)' },
    guestId: { type: 'uuid', references: 'guests("sessionId")' },
    productId: { type: 'integer', references: 'products(id)' },
    quantity: { type: 'integer', default: 0 }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropTable('guests');
  pgm.dropTable('products');
  pgm.dropTable('orders');
  pgm.dropTable('orderItems');
  pgm.dropTable('reviews');
  pgm.dropTable('cartItems');
};
