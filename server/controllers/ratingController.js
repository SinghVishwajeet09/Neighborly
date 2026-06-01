const pool = require("../config/db");

// RATE USER
exports.rateUser = async (req, res) => {
  try {
    const fromUser = req.user;
    const { toUser, rating, review } = req.body;

    // insert rating
    await pool.query(
      "INSERT INTO ratings (from_user, to_user, rating, review) VALUES ($1,$2,$3,$4)",
      [fromUser, toUser, rating, review]
    );

    // update trust score (average)
    const result = await pool.query(
      "SELECT AVG(rating) as avg FROM ratings WHERE to_user=$1",
      [toUser]
    );

    await pool.query(
      "UPDATE users SET trust_score=$1 WHERE id=$2",
      [result.rows[0].avg, toUser]
    );

    res.json({ message: "Rating submitted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

