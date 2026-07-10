const express = require("express");
const app = express();
const port = 3000;
//const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

const middleware = require("./middleware"); //checking if user is logged in

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const ejs = require("ejs");
app.set("view engine", "ejs");
const util = require("util");
const crypto = require("crypto");
const pbkdf2 = util.promisify(crypto.pbkdf2);
const fs = require("fs").promises;

const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "myProject";

let db_connection;

async function get_db_connection() {
  if (!db_connection) {
    db_connection = client.connect().then(async (connectedClient) => {
      const db = connectedClient.db(dbName);
      await db
        .collection("users")
        .createIndex({ username: 1 }, { unique: true }); // unique index
      return connectedClient;
    });
  }
  return db_connection;
}

app.use(express.static("views"));

/* app
  .route("/login")
  .get((req, res) => {
    res.sendFile(__dirname + "/views/login.html");
  })
  .post(async (req, res) => {
    const uuid = crypto.randomUUID();
    try {
      const raw = await fs.readFile(__dirname + "/users.json", "utf8");
      const users = JSON.parse(raw);
      const rawSession = await fs.readFile(
        __dirname + "/sessions.json",
        "utf8",
      );
      const sessions = JSON.parse(rawSession);
      if (!users.hasOwnProperty(req.body.username)) {
        return res.status(422).send("invalid username or password");
      }
      const salt = users[req.body.username].salt;
      const hash = users[req.body.username].hash;
      const userKey = await pbkdf2(
        req.body.password,
        salt,
        100000,
        64,
        "sha512",
      );
      const userHash = userKey.toString("hex");
      if (userHash !== hash) {
        return res.status(422).send("invalid username or password");
      }
      sessions[uuid] = req.body.username;
      const updateSessions = JSON.stringify(sessions);
      await fs.writeFile(__dirname + "/sessions.json", updateSessions);
      res.cookie("id", uuid, { httpOnly: true });
      res.status(200).send("<h1>Logged in</h1>");
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).send(err.message);
    }
  }); */

app
  .route("/login")
  .get(middleware, (req, res) => {
    res.sendFile(__dirname + "/views/login.html");
  })
  .post(middleware, async (req, res) => {
    const uuid = crypto.randomUUID();
    try {
      const client = await get_db_connection();
      const db = client.db(dbName);
      const users = db.collection("users");
      const sessions = db.collection("sessions");
      const user = await users.findOne({ username: req.body.username });
      if (!user) {
        return res.status(422).send("invalid username or password");
      }
      const salt = user.password.salt;
      const hash = user.password.hash;
      const userKey = await pbkdf2(
        req.body.password,
        salt,
        100000,
        64,
        "sha512",
      );
      const userHash = userKey.toString("hex");
      if (userHash !== hash) {
        return res.status(422).send("invalid username or password");
      }
      await sessions.insertOne({
        sessionId: uuid,
        username: req.body.username,
        usersId: user._id,
      });
      res.cookie("sessionId", uuid, { httpOnly: true });
      res.status(200).send("<h1>Logged in</h1>");
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).send(err.message);
    }
  });

/* app
  .route("/register")
  .get((req, res) => {
    res.sendFile(__dirname + "/views/signup.html");
  })
  .post(async (req, res) => {
    if (req.body.password.length < 8) {
      return res.status(422).send("this password is too short");
    }
    const uuid = crypto.randomUUID();
    const salt = crypto.randomBytes(16).toString("hex");
    try {
      const raw = await fs.readFile(__dirname + "/users.json", "utf8");
      const users = JSON.parse(raw);
      const rawSession = await fs.readFile(
        __dirname + "/sessions.json",
        "utf8",
      );
      const sessions = JSON.parse(rawSession);
      if (users.hasOwnProperty(req.body.username)) {
        return res.status(422).send("this username is occupied");
      }
      const key = await pbkdf2(req.body.password, salt, 100000, 64, "sha512");
      const hash = key.toString("hex");
      users[req.body.username] = {};
      users[req.body.username]["salt"] = salt;
      users[req.body.username]["hash"] = hash;
      sessions[uuid] = req.body.username;
      const updateUsers = JSON.stringify(users);
      await fs.writeFile(__dirname + "/users.json", updateUsers);
      const updateSessions = JSON.stringify(sessions);
      await fs.writeFile(__dirname + "/sessions.json", updateSessions);

      res.cookie("id", uuid, { httpOnly: true });
      res.status(200).send("<h1>Registered</h1>");
    } catch (err) {
      console.error("Error:", err.message);
      res.status(500).send(err.message);
    }
  }); */

app
  .route("/register")
  .get(middleware, (req, res) => {
    res.sendFile(__dirname + "/views/signup.html");
  })
  .post(middleware, async (req, res) => {
    if (req.body.password.length < 8) {
      return res.status(422).send("this password is too short");
    }
    const uuid = crypto.randomUUID();
    const salt = crypto.randomBytes(16).toString("hex");
    try {
      const client = await get_db_connection();
      const db = client.db(dbName);
      const users = db.collection("users");
      const sessions = db.collection("sessions");
      const existing = await users.findOne({ username: req.body.username });

      const key = await pbkdf2(req.body.password, salt, 100000, 64, "sha512");
      const hash = key.toString("hex");
      const result = await users.insertOne({
        username: req.body.username,
        password: {
          salt: salt,
          hash: hash,
        },
      });
      await sessions.insertOne({
        sessionId: uuid,
        username: req.body.username,
        usersId: result.insertedId,
      });

      res.cookie("sessionId", uuid, { httpOnly: true });
      res.status(200).send("<h1>Registered</h1>");
    } catch (err) {
      if (err.code === 11000) {
        return res.status(422).send("this username is occupied");
      }
      console.error("Error:", err.message);
      res.status(500).send(err.message);
    }
  });

/* app.get("/logout", async (req, res) => {
  try {
    const raw = await fs.readFile(__dirname + "/sessions.json", "utf8");
    const sessions = JSON.parse(raw);
    const cookie = req.cookies.id;
    if (!cookie || !sessions[cookie]) {
      return res.status(401).send("Nie jesteś zalogowany");
    }
    delete sessions[cookie];
    const updatedSession = JSON.stringify(sessions);
    await fs.writeFile(__dirname + "/sessions.json", updatedSession);
    res.clearCookie("id");
    res.status(200).send("<h1>Logout</h1>");
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}); */

app.get("/logout", async (req, res) => {
  try {
    const client = await get_db_connection();
    const db = client.db(dbName);
    const sessions = db.collection("sessions");
    const cookie = req.cookies.sessionId;
    const session = await sessions.findOne({ sessionId: cookie });
    if (!cookie || !session) {
      return res.status(401).send("Nie jesteś zalogowany");
    }
    await sessions.deleteOne({ sessionId: cookie });
    res.clearCookie("sessionId");
    res.status(200).send("<h1>Logout</h1>");
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

let count = (cookie) => {
  return cookie ? Number(cookie) : 0;
};

app.get("/counter", (req, res) => {
  let counter = count(req.cookies.counter);
  res.render("counter", { counter: counter });
});

app.post("/counter/add", (req, res) => {
  let counter = count(req.cookies.counter);
  counter = Number(counter) + 5;
  res.cookie("counter", counter);
  res.render("counter", { counter: counter });
});

app.post("/counter/multiply", (req, res) => {
  let counter = count(req.cookies.counter);
  counter = Number(counter) * 5;
  res.cookie("counter", counter);
  res.render("counter", { counter: counter });
});

app.get("/start-game", (req, res) => {
  res.sendFile(__dirname + "/views/game.html");
});

function hexArray(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const g = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const b = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    arr.push(`#${r}${g}${b}`);
  }
  return arr;
}

app.post("/game", (req, res) => {
  const n = parseFloat(req.body.n);
  const hexArr = hexArray(n);
  const correctColor = hexArr[Math.floor(Math.random() * n)];
  const colors = hexArr
    .map(
      (
        color,
      ) => `<div style="height: 100px; width: 100px; background: ${color}"><p>${color}</p>
    </div><form action="/check" method="POST">
    <input type="hidden" name="chosenColor" value="${color}">
    <input type="hidden" name="correctColor" value="${correctColor}">
    <input type="hidden" name="hexArr" value="${hexArr}">
    <button type="submit" style="background: ${color}">My choice</button></form>`,
    )
    .join("");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hex</title>
</head>
<body>
<h1>Colors:</h1>
<p>Pick one</p>
    ${colors}
</body>
</html>`);
});

app.post("/check", (req, res) => {
  if (req.body.chosenColor === req.body.correctColor) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hex</title>
</head>
<body>
<h1 style="color: ${req.body.chosenColor}">Congratulations</h1>
</body>
</html>`);
  } else {
    const correctColor = req.body.correctColor;
    const newHexArr = req.body.hexArr
      .split(",")
      .filter((color) => color !== req.body.chosenColor);
    if (newHexArr.length === 1) {
      return res.send("GAME OVER");
    }
    const colors = newHexArr
      .map(
        (
          color,
        ) => `<div style="height: 100px; width: 100px; background: ${color}"><p>${color}</p>
    </div><form action="/check" method="POST">
    <input type="hidden" name="chosenColor" value="${color}">
    <input type="hidden" name="correctColor" value="${correctColor}">
    <input type="hidden" name="hexArr" value="${newHexArr}">
    <button type="submit" style="background: ${color}">My choice</button></form>`,
      )
      .join("");
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hex</title>
</head>
<body>
<h1>Colors:</h1>
<p>Pick one</p>
    ${colors}
</body>
</html>`);
  }
});

app.get("/start", (req, res) => {
  const n = Math.min(parseFloat(req.query.difficulty) || 5, 100);
  const hexArr = hexArray(n);
  const correctColor = hexArr[Math.floor(Math.random() * n)];
  const colors = hexArr
    .map(
      (
        color,
      ) => `<div style="height: 100px; width: 100px; background: ${color}"><p>${color}</p>
    </div><form action="/check" method="POST">
    <input type="hidden" name="chosenColor" value="${color}">
    <input type="hidden" name="correctColor" value="${correctColor}">
    <input type="hidden" name="hexArr" value="${hexArr}">
    <button type="submit" style="background: ${color}">My choice</button></form>`,
    )
    .join("");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hex</title>
</head>
<body>
<h1>Colors:</h1>
<p>Pick one</p>
    ${colors}
</body>
</html>`);
});

/*app
  .route("/set-name")
  .get((req, res) => {
    res.sendFile(__dirname + `/views/set-name.html`);
  })
  .post(async (req, res) => {
    if (req.body.user.length < 5) {
      return res.json({ error: "this username is too short" });
    }
    const uuid = crypto.randomUUID();
    try {
      const raw = await fs.readFile(__dirname + "/sessions.json", "utf8");
      const session = JSON.parse(raw);
      const obj = Object.values(session);
      if (obj.includes(req.body.user)) {
        return res.json({ error: "this username is occupied" });
      }
      session[uuid] = req.body.user;
      const updatedData = JSON.stringify(session);
      await fs.writeFile(__dirname + "/sessions.json", updatedData);
      res.cookie("id", uuid, { httpOnly: true });
      res.redirect("/whoami");
    } catch (err) {
      console.error("Error:", err.message);
      res.json({ error: err.message });
    }
  });*/

app.get("/whoami", async (req, res) => {
  if (!req.cookies.id) {
    return res.json({ error: "no session" });
  }
  try {
    const raw = await fs.readFile(__dirname + "/sessions.json", "utf8");
    const session = JSON.parse(raw);
    const userName = session[req.cookies.id];
    if (!userName) return res.json({ error: "invalid session" });
    return res.send(`You are logged in as ${userName}`);
  } catch (err) {
    console.error("Error:", err.message);
    res.json({ error: err.message });
  }
});

app.get("/start-multiplayer", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.redirect(302, "/login");
  }

  const client = await get_db_connection();
  const db = client.db(dbName);
  const sessions = db.collection("sessions");
  const games = db.collection("games");

  const session = await sessions.findOne({ sessionId: sessionId });

  if (!session) {
    return res.redirect(302, "/login");
  }

  const gameId = crypto.randomUUID();

  await games.insertOne({
    gameId: gameId,
    players: [session.username, null],
    currentTurn: null,
    moves: [],
    winner: null,
    status: "waiting",
  });

  res.send(
    `Game created! Send this link to the other player: /join-multiplayer-game?game_id=${gameId}`,
  );
});

app.get("/join-multiplayer-game", async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.redirect(302, "/login");
  }

  const gameId = req.query.game_id;

  res.send(`
    <h1>Dołączasz do gry: ${gameId}</h1>
    <form method="POST" action="/join-multiplayer-game">
      <input type="hidden" name="game_id" value="${gameId}" />
      <button type="submit">Join this game</button>
    </form>
  `);
});

app.post("/join-multiplayer-game", async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.redirect(302, "/login");
  }

  const client = await get_db_connection();
  const db = client.db(dbName);
  const sessions = db.collection("sessions");
  const games = db.collection("games");

  const session = await sessions.findOne({ sessionId: sessionId });
  if (!session) {
    return res.redirect(302, "/login");
  }

  const gameId = req.body.game_id;
  const username = session.username;

  const game = await games.findOne({ gameId: gameId });

  if (!game) {
    return res.status(404).send("Gra nie istnieje");
  }

  if (game.players.includes(username)) {
    return res.status(422).send("Już jesteś w tej grze");
  }

  const emptySlotIndex = game.players.indexOf(null);
  if (emptySlotIndex === -1) {
    return res.status(422).send("Gra jest już pełna");
  }

  const updatedPlayers = [...game.players];
  updatedPlayers[emptySlotIndex] = username;

  const isGameFull = !updatedPlayers.includes(null);
  const randomFirstPlayer =
    updatedPlayers[Math.floor(Math.random() * updatedPlayers.length)];

  let colors = game.colors;
  let correctColor = game.correctColor;

  if (isGameFull) {
    colors = hexArray(6);
    correctColor = colors[Math.floor(Math.random() * colors.length)];
  }

  await games.updateOne(
    { gameId: gameId },
    {
      $set: {
        players: updatedPlayers,
        status: isGameFull ? "active" : "waiting",
        currentTurn: isGameFull ? randomFirstPlayer : null,
        colors: colors,
        correctColor: correctColor,
      },
    },
  );

  res.send(
    `Dołączono do gry! Status: ${isGameFull ? "gra rozpoczęta" : "czekam na drugiego gracza"}`,
  );
});

app.get("/multiplayer-game", async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.redirect(302, "/login");
  }

  const client = await get_db_connection();
  const db = client.db(dbName);
  const sessions = db.collection("sessions");
  const games = db.collection("games");

  const session = await sessions.findOne({ sessionId: sessionId });
  if (!session) {
    return res.redirect(302, "/login");
  }

  const gameId = req.query.game_id;
  const game = await games.findOne({ gameId: gameId });

  if (!game) {
    return res.status(404).send("Gra nie istnieje");
  }

  const username = session.username;

  if (game.status === "waiting") {
    return res.send("Czekamy na drugiego gracza. Odśwież stronę za chwilę.");
  }

  if (game.status === "finished") {
    return res.send(`<h1>Koniec gry! Wygrał: ${game.winner}</h1>`);
  }

  const chosenColors = game.moves.map((move) => move.color);

  const buttons = game.colors
    .map((color) => {
      const alreadyChosen = chosenColors.includes(color);
      return `<form method="POST" action="/multiplayer-game/move">
        <input type="hidden" name="game_id" value="${gameId}" />
        <input type="hidden" name="color" value="${color}" />
        <button type="submit" style="background: ${color}" ${alreadyChosen ? "disabled" : ""}>
          ${color}
        </button>
      </form>`;
    })
    .join("");

  res.send(`
    <h1>Twoja tura: ${game.currentTurn === username ? "TAK" : "NIE - czekaj"}</h1>
    <p>Historia ruchów: ${JSON.stringify(game.moves)}</p>
    ${buttons}
  `);
});

app.post("/multiplayer-game/move", async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.redirect(302, "/login");
  }

  const client = await get_db_connection();
  const db = client.db(dbName);
  const sessions = db.collection("sessions");
  const games = db.collection("games");

  const session = await sessions.findOne({ sessionId: sessionId });
  if (!session) {
    return res.redirect(302, "/login");
  }

  const username = session.username;
  const gameId = req.body.game_id;
  const chosenColor = req.body.color;

  const game = await games.findOne({ gameId: gameId });

  if (!game || game.status !== "active") {
    return res.status(422).send("Gra nie jest aktywna");
  }

  if (game.currentTurn !== username) {
    return res.status(403).send("To nie Twoja tura!");
  }

  const alreadyChosen = game.moves.some((move) => move.color === chosenColor);
  if (alreadyChosen) {
    return res.status(422).send("Ten kolor już był wybrany");
  }

  const isWinningMove = chosenColor === game.correctColor;
  const otherPlayer = game.players.find((player) => player !== username);

  const update = {
    $push: { moves: { username: username, color: chosenColor } },
  };

  if (isWinningMove) {
    update.$set = { status: "finished", winner: username };
  } else {
    update.$set = { currentTurn: otherPlayer };
  }

  await games.updateOne({ gameId: gameId }, update);

  res.redirect(`/multiplayer-game?game_id=${gameId}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
