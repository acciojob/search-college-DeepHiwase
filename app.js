const express = require("express");
const app = express();
const { collegeModel } = require("./connector");

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  res.status(200).send("HELLO WORLD");
});

// solution starts
app.get("/findColleges", async (req, res) => {
  try {
    let { name, state, city, minPackage, maxFees, course, exam } = req.query;

    minPackage = Number(minPackage);
    maxFees = Number(maxFees);

    if ((minPackage && minPackage < 0) || (maxFees && maxFees < 0)) {
      return res.status(400).json("Invalid Data like minPackage or maxFees");
    }

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (state) {
      query.state = { $regex: state, $options: "i" };
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (minPackage) {
      query.minPackage = { $gte: minPackage };
    }

    if (maxFees) {
      query.maxFees = { $lte: maxFees };
    }

    if (course) {
      query.course = course;
    }

    if (exam) {
      const exams = exam.split(",");
      query.exam = { $in: exams };
    }

    const result = await collegeModel
      .find(query, "name city state exam course maxFees minPackage")
      .exec();

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json("Server Error");
  }
});
// solution end

module.exports = { app };
