const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho0d8c2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    const servicesCollection = client.db('lensQueen').collection('services');
    
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
  res.send('Lens-Queen server running!')
})

app.listen(port, () => {
  console.log(`Lens-Queen server listening on port ${port}`)
})