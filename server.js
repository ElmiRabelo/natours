const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

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
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//This is a comment