const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', function () {
  console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});

// TODO mongodb+srv://Admin:<password>@cluster0.2xrq3.mongodb.net/<dbname>?retryWrites=true&w=majority
// process.env.DATABASE_URL