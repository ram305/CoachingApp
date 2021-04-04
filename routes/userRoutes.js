const express = require('express');
const router = express.Router();
const userCntrl = require('../controllers/userOps');

router.post("/signup", userCntrl.signUp);
router.post("/login", userCntrl.logIn);
router.post("/logout", userCntrl.logout);

module.exports = router;