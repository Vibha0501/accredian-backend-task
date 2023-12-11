require("dotenv").config();
const express = require("express");
const connection = require("./db");
const bcrypt = require("bcrypt");

const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    console.log("Received user data:", { username, email, password });
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
    connection.query(sql, [username, email, hashedPassword], (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }

        return res.status(500).json({ message: "Error registering user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM user WHERE email = ?";
    connection.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error logging in" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful", user: user });
    });
  } catch (error) {
    console.error("Error comparing passwords:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
