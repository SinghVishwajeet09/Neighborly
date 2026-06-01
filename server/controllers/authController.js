const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // check existing user
    const userExists = await pool.query(
      "SELECT * FROM users WHERE phone=$1",
      [phone]
    );

    if (userExists.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    await pool.query(
      "INSERT INTO users (name, phone, password) VALUES ($1,$2,$3)",
      [name, phone, hashedPassword]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const jwt = require("jsonwebtoken");

// LOGIN
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE phone=$1",
      [phone]
    );

    if (user.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

   const token = jwt.sign(
  { id: user.rows[0].id },
  process.env.JWT_SECRET
);

    res.json({ token, user: user.rows[0].name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
