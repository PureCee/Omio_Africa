const { randomBytes, scrypt } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

const betweenRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const generateCode = () => {
  let code = [];
  let counter = 0;
  while (counter < 6) {
    let numberVal = betweenRandomNumber(0, 9);
    code.push(numberVal);
    counter++;
  }
  const val = parseInt(code.join(""));
  return val;
};

const hashCode = async (code) => {
  const salt = randomBytes(8).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
};

const compare = async (savedCode, enteredCode) => {
  const [hashedPassword, salt] = savedCode.split(".");
  const buf = await scryptAsync(enteredCode, salt, 64);
  return buf.toString("hex") === hashedPassword;
};

module.exports = { generateCode, hashCode, compare };
