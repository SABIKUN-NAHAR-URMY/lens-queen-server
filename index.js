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
    const reviewsCollection = client.db('lensQueen').collection('reviews');

    let sortPattern = {dateAndTime : -1};

    app.get('/servicesAll', async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    })

    app.post('/servicesAll', async(req, res)=>{
        const service = req.body;
        const result = await servicesCollection.insertOne(service);
        res.send(result);
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


    app.get('/reviews', async (req, res) => {
        let query = {};
        if(req.query.serviceName){
            query = {
                serviceName: req.query.serviceName
            }
        }
        else if(req.query.email){
            query = {
                email: req.query.email
            }
        }
        const cursor = reviewsCollection.find(query).sort(sortPattern);
        const reviews = await cursor.toArray();
        res.send(reviews);
    })

    app.post('/reviews', async(req, res)=>{
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
    })

    app.patch('/reviews/:id', async(req, res)=>{
        const id = req.params.id;
        const rating = req.body.rating;
        const query = {_id : ObjectId(id)};
        const updateDoc = {
            $set:{
                rating : rating + 1
            }
        }
        const result = await reviewsCollection.updateOne(query, updateDoc);
        res.send(result);

    })

    app.delete('/reviews/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await reviewsCollection.deleteOne(query);
        res.send(result);

    })

}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Lens-Queen server running!')
})

app.listen(port, () => {
    console.log(`Lens-Queen server listening on port ${port}`)
})