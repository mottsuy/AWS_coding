const port = 8080;
const express = require("express");
const app = express();
const basicAuth = require('basic-auth-connect');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const Stocker = require('./model');

mongoose.connect(
  "mongodb://localhost:27017/stocker_db",
  {useNewUrlParser: true}
);

app.all('/secret', basicAuth(function(user, password) {
  return user === 'amazon' && password === 'candidate';
}));

app.get("/", (req,res) => {
    res.send("AMAZON")
});

app.get("/secret", (req,res) => {
  res.send("SUCCESS");
})

app.get("/calc", (req,res) => {
  let query = req.url;
  const queryIndex = query.indexOf('?');
  query = query.slice(queryIndex + 1);
  const checker = query.match(/[^0-9\+\-\*\/~\(\)\.]/g)
  if(checker === null) {
    const answer = eval(query);
    res.send(String(answer) + "\n");
  } else {
    res.send("ERROR" + "\n");
  }
});

app.get("/stocker", (req, res) => {
  const func = req.query.function;
  const name = req.query.name;
  let amount;
  let price;
  const amountStr = req.query.amount;
  const priceStr = req.query.price;
  if( amountStr && amountStr.match(/[^0-9\.]/g) === null ) {
     amount = parseInt(amountStr, 10);
  } else if(amountStr && amountStr.match(/[^0-9\.]/g) !== null) {
    amount = 0;
    return res.send("ERROR");
  }
  if( priceStr && priceStr.match(/[^0-9\.]/g) === null ) {
    price = parseInt(priceStr, 10);
  } else if(priceStr && priceStr.match(/[^0-9\.]/g) !== null){
    price = 0;
    return res.send("ERROR");
  }

  if(func === "addstock") {
    Stocker.find({name: name}, (err, docs) => {
      if(err) {
        console.log(err.message);
      } else {
        if(docs.length === 0 ) {
          Stocker.create({
            name,
            amount,
            price: 0,
          })
        } else if (docs.length !== 0) {
          console.log(docs[0].amount)
          const addAmount = docs[0].amount + amount;
          console.log(addAmount);
          Stocker.updateOne({name: docs[0].name}, {
            amount: addAmount,
          },
          (err) => {
            if (err) console.log(err);
          })
        }
      }
    })
  } else if (func === "checkstock" && name) {
    Stocker.find({name: name}, (err, docs) => {
      if(err) {
        console.log(err.message);
      } else {
        res.send(`${docs[0].name}: ${String(docs[0].amount)}`);
      }
    })
  } else if (func === "checkstock" && !name) {
    Stocker.find({}, (err, docs) => {
      if(err) {
        console.log(err.message);
      } else {
        let str = "";
        docs.sort(function(a, b) {
          return (a.name < b.name) ? -1 : 1;
        });
        docs.forEach(item => {
          if(item !== 0) {
          str = str + `${item.name}: ${item.amount}\n`;
          }
        })
        res.send(str);
      }
    })
  } else if (func === "sell" && name) {
    Stocker.find({name: name}, (err, docs) => {
      if(err) {
        console.log(err.message);
      } else {
        if(price && !amount) {
          const baseAmount = docs[0].amount;
          const subAmount = baseAmount - 1;
          const basePrice = docs[0].price;
          const seles =  price;
          const totalPrice = basePrice + seles;
          if(subAmount >= 0){
            Stocker.updateOne({name: name},{
              amount: subAmount,
              price: totalPrice,
            },(err) => {
              if (err) console.log(err);
            })
          } else {
            res.send("ERROR");
          }
        } else if (price && amount) {
          const baseAmount = docs[0].amount;
          const subAmount = baseAmount - amount;
          const basePrice = docs[0].price;
          const seles = amount * price;
          const totalPrice = basePrice + seles;
          if(subAmount >= 0){
            Stocker.updateOne({name: name},{
              amount: subAmount,
              price: totalPrice,
            },(err) => {
              if (err) console.log(err);
            })
          } else {
              res.send("ERROR");
          }
        }
      }
    });
  } else if (func === "checksales") {
    Stocker.find({},(err, docs) => {
      if(err) {
        console.log(err.message);
      } else {
        let totalSeles = 0;
        docs.forEach(item => {
          console.log(item.price);
          totalSeles += item.price;
        });
        res.send(String(totalSeles));
      }
  });
  } else if (func === "deleteall") {
    Stocker.deleteMany({},(err) => {
      if(err) {
        console.log(err.message);
      }
    })
  }
})


app.listen(port, () => {
    console.log(`server has started and is listening on port ${port}`)
});
