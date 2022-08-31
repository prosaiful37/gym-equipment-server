const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o5hd5z1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
    try{
        await client.connect();
        const inventoriesCollection = client.db('gym_equipments').collection('inventories');




        //get all inventoy items
        app.get('/inventories', async(req, res) => {
            const query = {};
            const cursor = inventoriesCollection.find(query)
            const inventory = await cursor.toArray()
            res.send(inventory);
        })

        // get inventoy item
        app.get('/inventories/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const inventory = await inventoriesCollection.findOne(query);
            res.send(inventory);

        })


        // update inventory items
        app.put('/inventories/:id', async(req, res) =>{
            const id = req.params.id;
            
            const quentityUpdate = req.body;
            const filter = { _id:ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set : {
                  quantity: quentityUpdate.totalQuentity,               
                }
            }
            const result = await inventoriesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
            
        })


        //post invenotry item
        app.post('/inventories', async(req, res) => {
          const invenotry = req.body;
          const result = await inventoriesCollection.insertOne(invenotry);
          res.send(result);
        })


        // delete inventory item
        app.delete('/inventories/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await inventoriesCollection.deleteOne(query);
          res.send(result);
        })



    }
    finally{

    }





}

run().catch(console.dir);















app.get("/", (req, res) => {
  res.send("Hello from gym-equipment !");
});

app.listen(port, () => {
  console.log(`Example app gym equipment listening on port  ${port}`);
});
