const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://service-review-system-client.vercel.app" // ❌ No trailing slash here
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkwhsex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const ServiceDB = client.db("ServiceDB").collection("service");
    const ReviewDB = client.db("ReviewDB").collection("review");

    // POST service
    app.post("/allSrvices", async (req, res) => {
      const Servicedata = req.body;
      const result = await ServiceDB.insertOne(Servicedata);
      res.send(result);
    });

    // GET limited services
    app.get("/allService", async (req, res) => {
      const result = await ServiceDB.find().limit(6).toArray();
      res.send(result);
    });

    // GET all services
    app.get("/Services", async (req, res) => {
      const result = await ServiceDB.find().toArray();
      res.send(result);
    });

    // GET services by email
    app.get("/services/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await ServiceDB.find(query).toArray();
      res.send(result);
    });

    // DELETE service
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ServiceDB.deleteOne(query);
      res.send(result);
    });

    // GET service by id
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ServiceDB.findOne(query);
      res.send(result);
    });

    // UPDATE service
    app.put("/updateservice/:id", async (req, res) => {
      const id = req.params.id;
      const servicedata = req.body;
      const updated = { $set: servicedata };
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await ServiceDB.updateOne(query, updated, options);
      res.send(result);
    });

    // POST review
    app.post("/allreview", async (req, res) => {
      const reviewdata = req.body;
      const result = await ReviewDB.insertOne(reviewdata);
      res.send(result);
    });

    // GET all reviews
    app.get("/reviews", async (req, res) => {
      const result = await ReviewDB.find().toArray();
      res.send(result);
    });

    // GET reviews by email
    app.get("/reviews/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "user.email": email };
      const result = await ReviewDB.find(query).toArray();
      res.send(result);
    });

    // GET review by id
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ReviewDB.findOne(query);
      res.send(result);
    });

    // UPDATE review
    app.put("/updatereview/:id", async (req, res) => {
      const id = req.params.id;
      const reviewdata = req.body;
      const updated = { $set: reviewdata };
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await ReviewDB.updateOne(query, updated, options);
      res.send(result);
    });

    // DELETE review
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ReviewDB.deleteOne(query);
      res.send(result);
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Do not close MongoDB connection if using in serverless environment like Vercel
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
