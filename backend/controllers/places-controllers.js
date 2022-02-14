const fs = require("fs");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");

/* ------------------------------ getPlaceById ------------------------------ */
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("something went wrong,  could not find place", 500)
    );
  }

  if (!place) {
    return next(new HttpError("could not find any places for place id", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};
/* -------------------------------------------------------------------------- */

/* ---------------------------- getPlacesByUserId --------------------------- */
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(
      new HttpError(
        "something went wrong,  could not find place by user id",
        500
      )
    );
  }

  if (!userWithPlaces || userWithPlaces.length === 0) {
    const error = new Error("could not find any places for user id");
    error.code = 404;
    return next(error);
  }

  res.json({
    places: userWithPlaces.places.map((p) => p.toObject({ getters: true })),
  });
};
/* -------------------------------------------------------------------------- */

/* ------------------------------- createPlace ------------------------------ */
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("inavalid input", 422));
  }

  const { title, description, location, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    location,
    image: req.file.path,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed", 500));
  }

  if (!user) {
    return next(new HttpError("could not find user", 404));
  }

  try {
    //  const sess = await mongoose.startSession();
    //  sess.startTransaction();
    await createdPlace.save(/* { session: sess } */);
    user.places.push(createdPlace);
    await user.save(/* { session: sess } */);
    //await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Creating place failed, validation", 500));
  }

  res.status(201).json({ place: createdPlace });
};
/* -------------------------------------------------------------------------- */

/* ------------------------------- updatePlace ------------------------------ */
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("inavalid input", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId); //mongoose Object
  } catch (error) {
    return next(
      new HttpError("something went wrong,  could not update place", 500)
    );
  }

  if (place.creator.toString() !== req.userData.userId)
    return next(new HttpError("Not Authorized to update this place", 401));

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("updating place failed", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};
/* -------------------------------------------------------------------------- */

/* ------------------------------- deletePlace ------------------------------ */
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(new HttpError("Removing place failed", 500));
  }

  if (!place) {
    return next(new HttpError("could not find place", 404));
  }

  if (place.creator.id !== req.userData.userId)
    return next(new HttpError("Not Authorized to delete this place", 401));

  const imagePath = place.image;

  try {
    await place.remove();
    place.creator.places.pull(place);
    await place.creator.save();
  } catch (error) {
    return next(new HttpError("Removing place failed", 500));
  }

  fs.unlink(imagePath, (err) => {});
  res.status(200).json({ message: "Deleted place" });
};
/* -------------------------------------------------------------------------- */

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
