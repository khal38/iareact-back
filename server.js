const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const database = {
  users: [
    {
      id: "123",
      name: "dey",
      email: "dey@mail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "wes",
      email: "wes@mail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    }
  ]
};

//Test route
app.get("/", (req, res) => {
  res.send(database.users);
});

//Signin
app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[1].email &&
    req.body.password === database.users[1].password
  ) {
    res.json("success");
  } else {
    res.status(404).json("No such user");
  }
});

//Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  database.users.push({
    id: "124",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });

  res.json(database.users[database.users.length - 1]);
});

//Profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  database.users.forEach(user => {
    if (user.id === id) {
      return res.json(user);
    } else {
      res.json("no match");
    }
  });
});

//Image

app.post("/image", (req, res) => {


    
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
