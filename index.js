const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//touristSpot
//uFaO8Czxuhk0eWhh
app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('country is comming soon')
})



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.goboxhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("touristSpotDB")
    const spotCollection = database.collection('spots')


    app.post('/spots', async(req, res)=>{
        const spots = req.body;
        console.log("spots are added", spots);
        const result = await spotCollection.insertOne(spots)
        res.send(result)
    })

    app.get('/spots', async(req, res)=>{
        const cursor = spotCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/myList/:email', async(req, res)=>{
    console.log(req.params);
      const result = await spotCollection.find({email: req.params.email}).toArray();
      res.send(result)
    })

    app.delete('/myList/:email', async(req, res)=>{
      const id = req.params.email;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`The server is running from ${port}`);
})