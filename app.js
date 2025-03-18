require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");  
const cors = require("cors");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

const v1 = require("./api/routes");
app.use("/api", v1.router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});