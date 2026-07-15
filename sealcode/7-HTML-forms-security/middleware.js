const { get_db_connection, dbName } = require("./db");

async function checkAuth(req, res, next) {
  const sessionId = req.cookies.sessionId; // cookie or undefined;
  try {
    const client = await get_db_connection();
    const db = client.db(dbName);
    const sessions = db.collection("sessions");
    const session = await sessions.findOne({ sessionId: sessionId }); // null if dont exist
    if (session) {
      return res.send("You are logged in");
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
}
module.exports = checkAuth;
