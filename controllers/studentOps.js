const { Subjects } = require('../models/users');
const { Students } = require('../models/users');

exports.enrollSubjects = (req, res) => {
    Subjects.updateOne({subject: req.body.subject},
        {$addToSet: {students: req.body.email}}
        ).then(
        res.status(200).json({
            message: "Enrolled succesfully!!!"
        })
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
};

exports.viewAttendance = (req, res) => {

    Subjects.findOne({subject: req.body.subject}).then(
        (subject)=> {
            var map = new Map();
            console.log(subject.attendance);
            subject.attendance.forEach(element => {
                if (element.studentsList.includes(req.body.student)) {
                    map[element.date]= "Present";
                } else {
                    map[element.date]= "Absent";
                }
            });
            res.status(200).json({
                attendance: map
            });
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
};