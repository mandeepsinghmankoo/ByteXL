const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let seats = {};
const NUM_SEATS = 10; 

for (let i = 1; i <= NUM_SEATS; i++) {
  seats[i] = { status: "available", lockedBy: null, lockExpiry: null };
}


function checkAndReleaseLocks() {
  const now = Date.now();
  for (let id in seats) {
    if (seats[id].status === "locked" && seats[id].lockExpiry <= now) {
      seats[id] = { status: "available", lockedBy: null, lockExpiry: null };
    }
  }
}


app.get("/seats", (req, res) => {
  checkAndReleaseLocks();
  res.json(seats);
});

app.post("/seats/:id/lock", (req, res) => {
  checkAndReleaseLocks();
  const { user } = req.body;
  const id = req.params.id;

  if (!seats[id]) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seats[id].status === "available") {
    seats[id].status = "locked";
    seats[id].lockedBy = user;
    seats[id].lockExpiry = Date.now() + 60000; // 1 min expiry
    return res.json({ message: `Seat ${id} locked for user ${user}`, expiry: seats[id].lockExpiry });
  }

  if (seats[id].status === "locked") {
    return res.status(400).json({ message: `Seat ${id} is already locked by another user` });
  }

  if (seats[id].status === "booked") {
    return res.status(400).json({ message: `Seat ${id} is already booked` });
  }
});

app.post("/seats/:id/confirm", (req, res) => {
  checkAndReleaseLocks();
  const { user } = req.body;
  const id = req.params.id;

  if (!seats[id]) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seats[id].status === "locked" && seats[id].lockedBy === user) {
    seats[id].status = "booked";
    seats[id].lockedBy = null;
    seats[id].lockExpiry = null;
    return res.json({ message: `Seat ${id} successfully booked by ${user}` });
  }

  if (seats[id].status === "locked") {
    return res.status(400).json({ message: `Seat ${id} is locked by another user` });
  }

  if (seats[id].status === "booked") {
    return res.status(400).json({ message: `Seat ${id} is already booked` });
  }

  return res.status(400).json({ message: `Seat ${id} must be locked before confirming` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
