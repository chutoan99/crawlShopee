const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const initRoutes = require("./routes/index");
// const vienchibao = require("../data/vienchibao.json");
const { json } = require("body-parser");
// setup project
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
dotenv.config();
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
initRoutes(app);
const port = 8000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// vienchibao?.items.map((item) => console.log(item.itemid));
