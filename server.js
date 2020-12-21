const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const { env } = process;

const DB = env.DATABASE.replace('<PASSWORD>', env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database conection established'));

const port = env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// unhadle rejection handle
process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION Shutting down...');
  console.log(err.name, err.message);

  // it's a more smoth way, first closing the server and then exiting the process.
  server.close(() => {
    process.exit(1);
  });
});
