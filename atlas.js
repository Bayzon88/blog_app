const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://bayzon88:alvaro88@bayzon88.aujbcr3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function connectDB() {
  client.connect((err) => {
    console.log("Connected to database");
  });
}

const dbSource = "blogApp";
const collectionSource = "posts";

async function getData() {
  try {
    const db = client.db(dbSource);
    const collection = db.collection(collectionSource);
    //Await because data retrieval may take some time
    const result = await collection.find({}).toArray(); //Needs to be converted to an array

    // await client.close();
    return result;
  } catch (e) {
    console.log(e);
  }
}

async function postData(data) {
  const db = client.db(dbSource);
  const collection = db.collection(collectionSource);

  //insert a new registry
  let { postTitle, postText, id, url } = data;
  await collection.insertOne({
    title: postTitle,
    text: postText,
    id: id,
    url: url,
  });
}

module.exports = { getData: getData, postData: postData, connectDB: connectDB };
