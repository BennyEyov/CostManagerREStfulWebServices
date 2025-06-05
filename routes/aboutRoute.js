const express = require('express');
const router = express.Router();
const {getTeamInfo} = require('../controllers/aboutController');

router.get('/about', getTeamInfo);

module.exports = router;