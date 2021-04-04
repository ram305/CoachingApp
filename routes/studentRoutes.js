const express = require('express');
const router = express.Router();
const studentCntrl = require('../controllers/studentOps');
const auth = require('../middleware/auth');

router.post("/enrollSubjects", auth, studentCntrl.enrollSubjects);
router.get("/viewAttendance", auth, studentCntrl.viewAttendance);

module.exports = router;