const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())



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
    //  await client.connect();
    const database = client.db("touristSpotDB")
    const spotCollection = database.collection('spots')
    const countries = database.collection('countries')


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
//get methode for specific user's 
    app.get('/myList/:email', async(req, res)=>{
    console.log(req.params);
      const result = await spotCollection.find({email: req.params.email}).toArray();
      res.send(result)
    })
//delete method for the specific spot
    app.delete('/myList/:email', async(req, res)=>{
      const id = req.params.email;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result);
    })

    //update method for the specific spot
    app.patch('/myList/:email', async(req, res)=>{
      
      const spot = req.body;
      console.log(spot);
      const filter = {email: spot.email}
      const options = {upsert : true}
      const updateSpot = {
        $set: {
          spotName: spot.spotName,
          imageURL: spot.imageURL,
          country: spot.country,
          location: spot.location,
          avgCost: spot.avgCost,
          seasonality: spot.seasonality,
          travelTime: spot.travelTime,
          totalVisitors: spot.totalVisitors,
          shortDescription: spot.shortDescription
        }
      }
      const result = await spotCollection.updateOne(filter, updateSpot, options)
      res.send(result);
    })

    // country collection from database
    app.get('/countries',async(req, res)=>{
      const cursor = countries.find()
        const result = await cursor.toArray()
        res.send(result)
    } )
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
  res.send('country is comming soon')
})
app.listen(port, ()=>{
    console.log(`The server is running from ${port}`);
})