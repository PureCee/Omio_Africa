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
  const buf = await scryptAsync(code, salt, 8);
  return `${buf.toString("hex")}$${salt}`;
};

const compare = async (savedCode, enteredCode) => {
  const [enteredVal, salt] = savedCode.split("$");
  const buf = await this.scryptAsync(enteredCode.toString(), salt, 8);
  return enteredVal === buf.toString("hex");
};

module.exports = { generateCode, hashCode, compare };
