const handleRegister = (req, res, db , bcrypt) => {
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
  };

  module.exports = {
    handleRegister : handleRegister
  };