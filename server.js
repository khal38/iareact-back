const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123",
    database: "iarect"
  }
});

//this return a promise who return data so i have to do then
/*db
  .select("*")
  .from("users")
  .then(data => {
    console.log(data);
  });*/

const app = express();
app.use(cors());

app.use(bodyParser.json());

const database = {
  users: [
    {
      id: "120",
      name: "dey",
      email: "dey@mail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "121",
      name: "wes",
      email: "wes@mail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    }
  ],
  loggin: [
    {
      id: "987",
      hash: "",
      email: "dey@mail.com"
    }
  ]
};

//Signin
app.post("/signin", (req, res) => {
  // i want the user who this req.body.email and return me email and hash
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            // console.log(user)
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

//Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const hash = bcrypt.hashSync(password);
  //first we insert into loggin table, we return the email we inserted
  //logginEmail from returning and we insert this email in users
  //
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return (
          trx("users")
            // bidding with the response
            .returning("*")
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
              // if we get a response returne all from returning,
            })
            .then(user => {
              res.json(user[0]);
            })
        );
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
});

//Profile
// useful for update a name or email
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  // let found = false;
  db.select("*")
    .from("users")
    // in ES6 id :id   is  id because property as the same
    .where({ id })
    .then(user => {
      // grap array of the current user
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("error getting user"));
});

//Image

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
});

app.listen(3001);

/*API PLANNING

(/) --> res = this is working

/signin --> POST ( data of user to log) :  succes/fail , password we don't  want to send it as a query string want to send it inside of the body  over
HTTPS so that it's hidden from man-in-the-middle attacks and it's secure.

/register --> POST (ad data of new user in the database) : user

/profile/:userid--> GET ( acces to the home screen of user) : user

/image --> PUT ( update count of user send a request with the button) : count user


*/
