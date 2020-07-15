const port = 8080;
const express = require("express");
const app = express();


var basicAuth = require('basic-auth-connect');
var adminApp  = express.Router();

adminApp.use(basicAuth('amazon', 'candidate'));

app.get("/", (req,res) => {
    res.send("AMAZON")
});

adminApp.get("/secret", (req,res) => {
  res.send("SUCCESS");
})

app.get("/calc", (req,res) => {
  let query = req.url;
  const queryIndex = query.indexOf('?');
  query = query.slice(queryIndex + 1);
  const checker = query.match(/[^0-9\+\-\*\/~\(\)\.]/g)
  console.log(checker);
  if(checker === null) {
    const answer = eval(query);
    res.send(String(answer) + "\n");
  } else {
    res.send("ERROR" + "\n");
  }
});


app.listen(port, () => {
    console.log(`server has started and is listening on port ${port}`)
});
