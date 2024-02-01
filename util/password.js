const { scrypt, randomBytes } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

const hashpassword = async (password) => {
  const salt = randomBytes(8).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
};
const comparePassword = async (supplied_password, saved_password) => {
  const [hashedPassword, salt] = saved_password.split(".");
  const buf = await scryptAsync(supplied_password, salt, 64);
  return buf.toString("hex") === hashedPassword;
};

module.exports = {
  hashpassword,
  comparePassword,
};
