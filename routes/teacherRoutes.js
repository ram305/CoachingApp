const express = require('express');
const router = express.Router();
const teacherCntrl = require('../controllers/teacherOps');
const auth = require('../middleware/auth');

router.post("/addSubjects", auth, teacherCntrl.addSubjects);
router.post("/deleteSubjects", auth, teacherCntrl.deleteSubjects);
router.post("/updateAttendance", auth, teacherCntrl.updateAttendance);
router.get("/getSubjects", auth, teacherCntrl.getSubjects);


module.exports = router;