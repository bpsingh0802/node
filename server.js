import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// ✅ MongoDB connect function
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://root:root@cluster0.brefgsw.mongodb.net/mydb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};

// ✅ User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
});

const User = mongoose.model('User', userSchema);

// ✅ Function to ensure users collection exists
const verifyCollectionExists = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionNames = collections.map((col) => col.name);

  if (collectionNames.includes('users')) {
    console.log('✅ "users" collection already exists');
  } else {
    console.log('ℹ️ "users" collection does not exist. Creating now...');
    try {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
      });
      await user.save();
      console.log('✅ "users" collection created with test user');
    } catch (err) {
      console.error('❌ Error creating test user:', err.message);
    }
  }
};

// ✅ Routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Start the server
const startServer = async () => {
  await connectDB();
  await verifyCollectionExists();

  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
};

startServer();
