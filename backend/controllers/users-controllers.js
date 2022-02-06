const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Alex johnson",
    email: "a@test.com",
    password: "testtest",
    image:
      "https://photo-cdn2.icons8.com/99L3mO3yHI4fFvBl_QpK3x38RVKTTyGUAzVrtiF8GtM/rs:fit:715:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNzIvNTI0Nzg4/MjctMzViMy00Y2Q2/LWJjM2YtNTMwYmZk/YmVkZTM4LmpwZw.jpg",
    places: "3",
  },
  {
    id: "u2",
    name: "emily michigan",
    email: "e@test.com",
    password: "testtest",
    image:
      "https://photo-cdn2.icons8.com/XGYUDcGGnHuzyR3eaNeLAa5LQfpo_JdwnKYGaIwbjP8/rs:fit:804:1072/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNzY5LzhiMTYy/NDU3LTkxN2UtNDVm/Ni1iYjhjLTE2YmQy/MmYyODU1Zi5qcGc.jpg",
    places: "4",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("inavalid input", 422));
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    return next(new HttpError("Email already exists", 422));
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("wrong username or password", 401));
  }

  res.json({ message: "logedin" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
