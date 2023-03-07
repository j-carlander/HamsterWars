import express from "express";
import path from "path";
import url from "url";
import mustache from "mustache-express";

// Working directory path
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server parameters
const app = express();
const port = 3000;

// Template engine
app.engine("html", mustache());
app.set("view engine", "html");
app.set("views", __dirname + "/views");

// Use built in middleware to encode html form and serve images
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));

// Server db
const db = [
  { name: "hamster_1", img: `./images/hamster_1.png`, votes: 0 },
  { name: "hamster_2", img: "./images/hamster_2.png", votes: 0 },
];

// Routes

app.get("/", (request, response) => {
  response.render("index");
});

app.get("/vote", (request, response) => {
  const model = { hamsters: db };
  response.render("vote", model);
});

app.post("/rateHamster", (request, response) => {
  if (request.body.votedOn) {
    db.find((hamster) => hamster.name === request.body.votedOn).votes += 1;
    response.redirect("/showResults");
  } else {
    response.redirect("/vote");
  }
});

app.get("/showResults", calcTotal, (request, response) => {
  const model = { hamsters: db, total: request.total };
  response.render("results", model);
});

// middleware
function calcTotal(request, response, next) {
  request.total = db[0].votes + db[1].votes;
  next();
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
