const Genre = require("../models/Genre");
const Book = require("../models/Book");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = (req, res) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_genre) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("genre_list", {
        title: "Author List",
        genre_list: list_genre,
      });
    });
};

// Display detail page for a specific Genre.
// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Display Genre create form on GET.
// Display Genre create form on GET.
// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
// Handle Genre create on POST.
// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and santize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("genre_delete", {
        title: "delte genre",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.body.gnereid).exec(callback);
      },

      genre_books(callback) {
        Book.find({ genre: req.body.genreid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre_books.length > 0) {
        // No results.
        res.render("genre_delete", {
          title: "delte genre",
          genre: results.genre,
          genre_books: results.genre_books,
        });
        return;
      }
      // Successful, so render
      Genre.findByIdAndRemove(req.body.genreid, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/genres");
      });
    }
  );
};

exports.genre_update_get = (req, res, next) => {
  Genre.findById(req.params.id, function (err, genre) {
    if (err) {
      return next(err);
    }

    if (genre == null) {
      var err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }

    res.render("genre_form", {
      title: "Update Genre",
      genre: genre,
    });
  });
};

exports.genre_update_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({
      min: 3,
    })
    .escape(),
  function (req, res, next) {
    var errors = validationResult(req);

    var genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findByIdAndUpdate(
        req.params.id,
        genre,
        {},
        function (err, thegenre) {
          if (err) {
            return next(err);
          }

          res.redirect(thegenre.url);
        }
      );
    }
  },
];
