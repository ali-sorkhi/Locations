const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //hashing password
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

/* -------------------------------- getUsers -------------------------------- */
const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("fetching users failed", 500));
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};
/* -------------------------------------------------------------------------- */

/* --------------------------------- signup --------------------------------- */
const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("inavalid input", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Email already exists", 500));
  }

  if (existingUser) {
    return next(new HttpError("Email already exists", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("signup failed", 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError("signup failed", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "hiuhHIUSHUHenocnUFheufOhcowecnwuc:cuhOUEFUAE",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("signup failed", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};
/* -------------------------------------------------------------------------- */

/* ---------------------------------- login --------------------------------- */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("loginig in failed", 500));
  }

  if (!existingUser) {
    return next(new HttpError("loginig in failed", 500));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("loginig in failed", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("loginig in failed", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "hiuhHIUSHUHenocnUFheufOhcowecnwuc:cuhOUEFUAE",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("loginig in failed", 500));
  }

  res
    .status(201)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
};
/* -------------------------------------------------------------------------- */

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
