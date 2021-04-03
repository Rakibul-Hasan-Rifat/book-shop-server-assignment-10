const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const port = 5500;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f70tg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client
    .db(process.env.DB_NAME)
    .collection("bookShopCollection");

  app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
  });

  app.post("/allData", (req, res) => {
      console.log('fetch and send')
    let data = req.body;
    console.log(data);
    collection.insertOne(data);
    res.send();
  });

  app.get("/mongoDocs", (req, res) => {
      console.log('data sending')
    collection.find().toArray((err, docs) => {
      if (err) {
        console.log(err);
      } else {
        res.send(docs);
      }
    });
  });

  app.get('/mongoDocs/:id', (req, res) => {
    console.log(req.params.id);
    collection.findOne({_id: ObjectId(req.params.id)})
    .then(res => res.json())
    .then(data => {
      res.send(data);
    })
  })
 
  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)}) 
    .then((result) => {
      console.log('result', result);
    })    
  })
});
app.listen(process.env.PORT || port);
