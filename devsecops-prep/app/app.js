const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

// Fake DB
let users = [{ id: 1, username: "admin", password: "admin123" }];

// 🔴 1. SQL Injection-like (simulated)
app.get("/user", (req, res) => {
  const id = req.query.id;
  const user = users.find(u => u.id == id); // no validation
  res.send(user);
});

// 🔴 2. XSS
app.get("/hello", (req, res) => {
  res.send("Hello " + req.query.name);
});

// 🔴 3. Hardcoded secret
const SECRET = "supersecretkey";

// 🔴 4. Weak JWT auth
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, SECRET);
    res.send({ token });
  } else {
    res.status(401).send("Invalid");
  }
});

// 🔴 5. No auth check (IDOR-like)
app.get("/admin", (req, res) => {
  res.send("Sensitive admin data");
});

app.listen(3000, () => console.log("Running on 3000"));
// test change
