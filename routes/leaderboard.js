const express = require("express");
const router = express.Router();
const leaderboardController = require("../controller/leaderboard");

router.get("/getLeaderboardPage", leaderboardController.getLeaderboardPage);

module.exports = router;