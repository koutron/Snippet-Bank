const exphbs = require("express-handlebars");
const config = require("./config/connectDB");
const express = require("express");
const mysql = require("mysql");
const app = express();

const PORT = process.env.PORT || 8089;

const dbConfig = process.env.NODE_ENV === "production" ? config.heroku : config.local;

const connection = mysql.createConnection(dbConfig);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// =============================================================================


app.get("/", (req, res) => {
  connection.query("SELECT * FROM snippets", (err, data) => {
    if (err) {
      throw err;
    }
    res.render("index", { snippets: data });
  });
});
//Alternative Version
// app.get("/", async (req, res) =>  {
//   const data = await functions.selectAll(connection, snippets)
//     res.render("index", { snippets: data });
//   });

app.post("/", (req, res) => {
  connection.query(
    "INSERT INTO snippets SET ?",
    {
      snippetTitle: req.body.newTitle,
      language: req.body.newLanguage,
      description: req.body.newDescription,
      snippetBody: req.body.newSnippetBody
    },
    (err, res) =>{
      if (err){
        return res.status(500).end();
      }
    }
  );
  res.redirect("/");
});

app.post("/api/:id", function(req, res){
  connection.query("SELECT * FROM snippets WHERE id=" + req.params.id, function(err, data) {
    if (err) throw err;
    // Log all results of the SELECT statement
    res.json(data);
  });
});

app.get("/api/filter/:query", function(req,res){
  const query = req.params.query;
  connection.query(query, function(err, data) {
    if (err) throw err;
    res.render("index", { snippets: data });
  });
})

app.get("/api/:language/:query", function(req,res){
  const query = req.params.query;
  console.log(`this is the language param: ${req.params.language}`)
  const a =`${req.params.language}`
  console.log(a)
  console.log(Object.keys(a))
  const aKeys = Object.keys(a);
  console.log(Object.values(a))
  console.log(aKeys)
  let b = "";
  for (let keyNum of aKeys){
    b += keyNum
    console.log(b.string)
  }

  connection.query(query, function(err, data) {
    if (err) throw err;
    res.render("index", { snippets: data, "selectedLanguage": b});
  });
})

// PORT listener
app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});
