const express = require('express')
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Unique auto parts")
})

app.listen(port, () => {
    console.log(`Listening unique auto parts port ${port}`)
})



// MONGO DB CONNECT CODE


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.oetir.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();

        const productCollection = client.db('unique-auto').collection('products');

        // product api
        app.get('/products', async (req, res) => {
            const products = await productCollection.find({}).toArray();
            res.send(products);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params;
            filter = { id: (id) };
            product = await productCollection.findOne(filter);
            res.send(product)
        })
    } finally {

    }
}
run().catch(console.dir);
