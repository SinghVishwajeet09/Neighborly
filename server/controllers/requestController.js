const pool = require("../config/db");

// CREATE REQUEST
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user; // middleware se aa raha
    const { title, description, latitude, longitude } = req.body;

    const newRequest = await pool.query(
      `INSERT INTO requests (user_id, title, description, latitude, longitude)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, title, description, latitude, longitude]
    );

    res.json(newRequest.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL REQUESTS (for now simple version)
// GET NEARBY REQUESTS
exports.getRequests = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon)
      return res.status(400).json({ message: "Location required" });

    const radius = 5; // km
    const userId = req.user;

    const requests = await pool.query(
      `SELECT requests.*, users.name
       FROM requests
       JOIN users ON users.id = requests.user_id
       WHERE status='open' AND requests.user_id != $1`,
      [userId]
    );

    // filter nearby
    const nearby = requests.rows.filter(r => {
      const distance =
        111 *
        Math.sqrt(
          Math.pow(r.latitude - lat, 2) +
          Math.pow(r.longitude - lon, 2)
        );

      return distance <= radius;
    });

    res.json(nearby);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ACCEPT REQUEST
exports.acceptRequest = async (req, res) => {
  try {
    const helperId = req.user;
    const { requestId } = req.body;

    // check request exists
    const request = await pool.query(
      "SELECT * FROM requests WHERE id=$1 AND status='open'",
      [requestId]
    );

    if (request.rows.length === 0)
      return res.status(400).json({ message: "Request not available" });

    // insert into task_accepts
    await pool.query(
      "INSERT INTO task_accepts (request_id, helper_id) VALUES ($1,$2)",
      [requestId, helperId]
    );

    // update status
    await pool.query(
      "UPDATE requests SET status='accepted' WHERE id=$1",
      [requestId]
    );

    res.json({ message: "Request accepted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// COMPLETE REQUEST
exports.completeRequest = async (req, res) => {
  try {
    const helperId = req.user;
    const { requestId } = req.body;

    // check accepted request
    const task = await pool.query(
      "SELECT * FROM task_accepts WHERE request_id=$1 AND helper_id=$2",
      [requestId, helperId]
    );

    if (task.rows.length === 0)
      return res.status(400).json({ message: "Not authorized to complete" });

    // update completion time
    await pool.query(
      "UPDATE task_accepts SET completed_at=NOW() WHERE request_id=$1",
      [requestId]
    );

    // update request status
    await pool.query(
      "UPDATE requests SET status='completed' WHERE id=$1",
      [requestId]
    );

    res.json({ message: "Request marked completed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
