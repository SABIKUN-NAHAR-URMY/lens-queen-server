const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho0d8c2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);

async function run() {
    const servicesCollection = client.db('lensQueen').collection('services');

    app.get('/servicesAll', async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    })
    app.get('/servicesLimit', async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query).limit(3);
        const services = await cursor.toArray();
        res.send(services);
    })

    app.get('/servicesAll/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.send(service);
    })

}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Lens-Queen server running!')
})

app.listen(port, () => {
    console.log(`Lens-Queen server listening on port ${port}`)
})