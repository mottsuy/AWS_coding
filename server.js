const port = 8080;
const express = require("express");
const app = express();

app.get("/", (req,res) => {
    res.send("AMAZON")
});

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
