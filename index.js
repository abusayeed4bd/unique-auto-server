const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());








// MONGO DB CONNECT CODE


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.oetir.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();

        const productCollection = client.db('unique-auto').collection('products');
        const reviewCollection = client.db('unique-auto').collection('reviews');
        const userCollection = client.db('unique-auto').collection('users');

        // product api
        app.get('/products', async (req, res) => {
            const q = req.query;
            const cursor = productCollection.find(q);
            const products = await cursor.toArray();

            res.send(products);
        })
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.send(result);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const q = { _id: ObjectId(id) };
            const cursor = await productCollection.findOne(q);

            res.send(cursor);
        })

        // reviews api

        app.get('/reviews', async (req, res) => {
            const q = req.query;
            const cursor = reviewCollection.find(q);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async (req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.send(result);
        })


        // users
        app.get('/users', async (req, res) => {
            const q = req.query;
            const cursor = userCollection.find(q);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
        });
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Unique auto parts")
})

app.listen(port, () => {
    console.log(`Listening unique auto parts port ${port}`)
})