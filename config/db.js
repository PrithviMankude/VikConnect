const mongoose = require('mongoose');
const config = require('config');

const db = config.get('MongoURI');

const connectDb = async () => {
  try {
    await mongoose.connect(db);
    console.log('Database Connected');
  } catch (err) {
    console.log('In database connect: failure');
    console.log(err);
    //Exiting the process with fail
    process.exit(1);
  }
};

module.exports = connectDb;
