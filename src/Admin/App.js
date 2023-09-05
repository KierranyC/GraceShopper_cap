import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express from 'express';
import Connect from 'connect-pg-simple';
import session from 'express-session';
import Plugin from '@adminjs/express';

const PORT = 3001;

AdminJS.registerAdapter({
    Database,
    Resource,
  });

const start = async () => {
    const app = express();

    const db = await new Adapter('postgresql', {
        connectionString: 'postgresql://postgres@localhost:5432/grace_shopper_db',
        database: 'grace_shopper_db',
    }).init();
};

const ADMIN = {
  email,
  password,
};

const authenticate = async (email, password) => {
  if (email === ADMIN.email && password === ADMIN.password) {
    return Promise.resolve(ADMIN)
  }
  return null
};

const admin = new AdminJS({
    resources: [{
        resource: db.table('users'),
        resource: db.table('products'),
        resource: db.table('orders'),
        resource: db.table('reviews'),
        options: {
            properties: {
                role: {
                    availableValues: [
                        { label: 'Admin', value: 'ADMIN' },
                        { label: 'Client', value: 'CLIENT' },
                    ],
                },
            },
        },
    }],
});
admin.watch();

const ConnectSession = Connect(session)
const sessionStore = new ConnectSession({
  conObject: {
    connectionString: 'postgres://adminjs:@localhost:3001/grace_shopper_db',
    ssl: process.env.NODE_ENV === 'production',
  },
    tableName: 'session',
    createTableIfMissing: true,
});

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  );
  const router = Plugin.buildRouter(admin);
  app.use(admin.options.rootPath, router);

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  });


start();