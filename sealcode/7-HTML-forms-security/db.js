const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "myProject";

let db_connection;

async function get_db_connection() {
  if (!db_connection) {
    db_connection = client.connect().then(async (connectedClient) => {
      const db = connectedClient.db(dbName);
      await db
        .collection("users")
        .createIndex({ username: 1 }, { unique: true });
      return connectedClient;
    });
  }
  return db_connection;
}

module.exports = { get_db_connection, dbName };
