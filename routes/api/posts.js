const express = require("express");
const router = express.Router();

// @route   GET api/users
// @Desc    Test Route
// @access  Public
router.get("/", (req, res) => {
  res.send("Post route");
});

module.exports = router;
