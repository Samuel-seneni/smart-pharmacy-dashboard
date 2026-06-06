const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("./jwtSecret");

const generateToken = (
  id,
  role,
  name = null,
  email = null
) => {
  return jwt.sign(
    {
      id,
      role,
      name,
      email,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;