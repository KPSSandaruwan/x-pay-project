const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the API V1");
});

require("./orderRoutes")(router);

module.exports.router = router;