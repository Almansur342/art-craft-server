const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}

// middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skihu85.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("craftDB");
    const productCollection = database.collection("craftProduct");

    const categoryDatabase = client.db("categoryCraftDB");
    const categoryProduct = categoryDatabase.collection("categoryCraftProduct");


    app.get('/craftItem', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get('/sixCraftItem', async (req, res) => {
      const cursor = productCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/addProduct', async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      // console.log(result)
      res.send(result);
    });

    app.get('/myCraftProduct/:email', async (req, res) => {
      console.log(req.params.email)
      // console.log(email);
      const result = await productCollection.find({ email: req.params.email }).toArray();
      // console.log(result);
      res.send(result);
    });
    app.get('/relatedProduct/:subcategory_name', async (req, res) => {
      // console.log(req.params.subcategory_name)
      console.log(req.params.subcategory_name);
      const result = await productCollection.find({ subcategory_name: req.params.subcategory_name }).toArray();
      console.log(result);
      res.send(result);
    });

    app.get('/singleItem/:id', async (req, res) => {
      // console.log(req.params.id)
      // console.log(email);
      const result = await productCollection.findOne({ _id: new ObjectId(req.params.id) });
      // console.log(result);
      res.send(result);
    });

    app.put('/updateProduct/:id', async (req, res) => {
      console.log(req.params.id);
      console.log(req.body);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          image: req.body.image,
          item_name: req.body.item_name,
          subcategory_name: req.body.subcategory_name,
          short_description: req.body.short_description,
          price: req.body.price,
          rating: req.body.price,
          customization: req.body.customization,
          processing_time: req.body.processing_time,
          stock_status: req.body.stock_status
        }
      }
      const result = await productCollection.updateOne(query, data);
      console.log(result);
      res.send(result)
    });

    app.delete('/delete/:id', async (req, res) => {
      const result = await productCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      console.log(result)
      res.send(result)
    });

    app.get('/categoryCraftItem', async (req, res) => {
      const cursor = categoryProduct.find();
      const result = await cursor.toArray();
      res.send(result);
    });



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('hello from art and craft server')
});

app.listen(port, () => {
  console.log(`server is running on the port: ${port}`)
});