const express = require("express");
const app = express();
const port = 3000;
//const bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

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

app.use(express.static("views"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
