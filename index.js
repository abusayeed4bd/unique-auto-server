const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        // product api
        app.get('/products', async (req, res) => {
            const q = req.query;
            const cursor = productCollection.find(q);
            const products = await cursor.toArray();

            res.send(products);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const q = { _id: ObjectId(id) };
            const cursor = await productCollection.findOne(q);

            res.send(cursor);
        })

        // reviews api
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