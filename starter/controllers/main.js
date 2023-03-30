// check username, password in post (login request)
//if exsts create new JWT
//send back to front end
const jwt = require("jsonwebtoken");

const { BadRequest } = require("../errors");
//set up authentication so only the resquest with JWT can access the dashboard.

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequest("Please provide email or password");
  }
  const id = new Date().getDate();
  //What you send back goes in sign. Don't send confidential info there.
  //Payloads should be small. This becomes a very long cryptic string
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  //mongo will handle this for us in the futurue
  // Joi will handle this for us in the futurue
  //
  //we send the token back, the front end stores it in localstorage and then if the token is in local storage you cat get data in the dashboard.
  res.status(200).json({ msg: "used created", token });
};

//In the get we add Authorization >> write a new like Authorization and then in the value Bearer <copyherethejwttoken>
//We built it like this, but usully we will do this with our own middleware
const dashboard = async (req, res) => {
  //Middleware does soemthing for us now here auth.js and returns a user in the request

  const luckyNumber = Math.floor(Math.random() * 100);

  //takes the username encoded in the string
  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: "Here is your authorized data, your lucky number is " + luckyNumber,
  });
};

module.exports = {
  login,
  dashboard,
};
