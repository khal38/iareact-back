const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const image = require("./controllers/image");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123",
    database: "iarect"
  }
});

const app = express();
app.use(cors());

app.use(bodyParser.json());

//Signin ( we running handleSignIn with db and bcrypt and when signin get head we passing the request response)
app.post("/signin",  signin.handleSignIn(db, bcrypt));;
//Register
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
//Profile
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db, bcrypt);
});
//Image
app.put("/image", (req, res) => {
  image.handleImage(req, res, db, bcrypt);
});
//Image clarifai
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.en.PORT || 3001, ()=>{
  console.log(`app is running on port ${process.env.PORT}`)
});



/*API PLANNING

(/) --> res = this is working

/signin --> POST ( data of user to log) :  succes/fail , password we don't  want to send it as a query string want to send it inside of the body  over
HTTPS so that it's hidden from man-in-the-middle attacks and it's secure.

/register --> POST (ad data of new user in the database) : user

/profile/:userid--> GET ( acces to the home screen of user) : user

/image --> PUT ( update count of user send a request with the button) : count user


*/
