const express = require("express");
const app = express();
const port = 3000;
//const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const ejs = require("ejs");
app.set("view engine", "ejs");

app.use(express.static("views"));

app
  .route("/login")
  .get((req, res) => {
    res.sendFile(__dirname + "/views/login.html");
  })
  .post((req, res) => {
    if (req.body.username === "admin" && req.body.password === "adminadmin") {
      res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<h1>logged in!</h1>
    
</body>
</html>`);
    } else {
      res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<h1>Wrong username or password</h1>
    
</body>
</html>`);
    }
  });

app
  .route("/signup")
  .get((req, res) => {
    res.sendFile(__dirname + "/views/signup.html");
  })
  .post((req, res) => {
    if (req.body.password.length < 8) {
      return res.json({ error: "this password is too short" });
    } else {
      return res.json({ message: "Account created" });
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
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hex</title>
</head>
<body>
<h1 style="color: ${req.body.chosenColor}; background: red">Game over</h1>
</body>
</html>`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
