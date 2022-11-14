const express = require("express");
const app = express();

const PORT = process.env.port || 3222;

app.get("/api", (req, res) => {
  res.json({ message: "hello from broker!" });
});

app.listen(PORT, () => {
  console.log(`LookOut Broker listening on port ${PORT}`);
});
