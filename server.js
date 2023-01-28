const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const axios = require("axios");
const { Client } = require("pg");

// const Client connection here

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/"));

client.connect();

//homepage
app.get("/", (req, res) => {
  res.render("pages/main", {
    my_title: "Meal Search",
    items: "",
    error: false,
    message: "",
  });
});

//searches for meal
app.post("/get_feed", function (req, res) {
  var title = req.body.title;

  if (title) {
    axios({
      url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${title}`,
      method: "GET",
      dataType: "json",
    })
      .then((items) => {
        console.log(items.data.meals[0]);
        res.render("pages/main", {
          my_title: title,
          items: items.data.meals,
          error: false,
        });
      })
      .catch((error) => {
        console.log("Search error");
        res.render("pages/main", {
          my_title: "Meal Search",
          items: "",
          error: true,
          message: "No recipes found, try another search.",
        });
      });
  } else {
    res.render("pages/main", {
      my_title: "Meal Search",
      items: "",
      error: true,
      message: "Enter a food",
    });
  }
});

//loading reviews search
app.get("/reviews", function (req, res) {
  var select3 = `SELECT meal_name, review, LEFT(CAST(review_date AS text), 10) FROM reviews`;

  client.query(select3, (err, response1) => {
    res.render("pages/reviews", {
      my_title: "Meal Review Search",
      items: response1.rows,
      error: false,
      message: "",
    });
  });
});

//submitting review to database
app.post("/reviews", function (req, res) {
  var review_food = res.req.body.food.toLowerCase();
  var review = res.req.body.review_text;

  if (review) {
    var query = `INSERT INTO reviews (meal_name, review, review_date) VALUES ('${review_food}', '${review}', NOW())`;

    client.query(query, (err, _) => {
      if (!err) {
        console.log("insert successful");
      } else {
        console.log(err.message);
      }
    });
  }
  var select4 = `SELECT meal_name, review, LEFT(CAST(review_date AS text), 10) FROM reviews`;

  client.query(select4, (err, response1) => {
    res.render("pages/reviews", {
      my_title: "Meal Review Search",
      items: response1.rows,
      error: false,
      message: "",
    });
  });
});

//searches reviews
app.post("/reviews_search", function (err, res) {
  var review_title = res.req.body.review_title;

  if (review_title) {
    console.log("review title: ", review_title);
    var select1 = `SELECT meal_name, review, LEFT(CAST(review_date AS text), 10) FROM reviews WHERE meal_name LIKE LOWER('%${review_title}%')`;

    client.query(select1, (err, response) => {
      if (!err) {
        console.log("after select: ", response.rows);

        if (response.rows.length == 0) {
          var select2 = `SELECT meal_name, review, LEFT(CAST(review_date AS text), 10) FROM reviews`;

          client.query(select2, (err, response1) => {
            res.render("pages/reviews", {
              my_title: review_title,
              items: response1.rows,
              error: false,
              message: "",
            });
          });
        } else {
          res.render("pages/reviews", {
            my_title: review_title,
            items: response.rows,
            error: false,
            message: "",
          });
        }
      } else {
        console.log(err.message);
      }
    });
  }
});

module.exports = app.listen(process.env.PORT || 3000);
console.log("3000 is the magic port");
