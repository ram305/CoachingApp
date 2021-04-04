const { Subjects } = require('../models/users');

exports.addSubjects = (req, res) => {
    Subjects.findOne({subject: req.body.subject}).then(
        (subjects) => {
            if (!subjects) {
                const newSubjects = new Subjects({
                    teacher: req.body.email,
                    subject: req.body.subject
                });
                newSubjects.save().then(
                    () => {
                        res.status(200).json({
                            message: 'Subjects added succesfully'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        });
                    }
                );
            } else {
                return res.status(200).json({
                    message: "Subject already there!"
                });
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
};

exports.deleteSubjects = (req, res) => {
    const subjects = req.body.subjects;
    for(var i=0; i<subjects.length; i++) {
        Subjects.remove({subject: subjects[i]}).then(
            () => {
                next();
            }
        ).
        catch(
            (error) => {
                return  res.status(500).json({
                    error: error
                });
            }
        );
    }
    res.status(200).json({
        message: "Deleted succesfully!!"
    });
};

exports.updateAttendance = (req, res) => {
    Subjects.findOne({subject: req.body.subject}, {attendance: {$elemMatch: {date:{$eq:req.body.date}}}}).then(
        (subject) => {
            console.log(subject);
            if(subject.attendance.length === 0){
                console.log("there1");
                Subjects.updateOne({subject: req.body.subject}, {$addToSet: {"attendance": [{date: req.body.date, studentsList: req.body.studentsList}]}}, function(err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                });
            } else {
                Subjects.updateOne({subject: req.body.subject, "attendance.date":req.body.date}, {$addToSet:{"attendance.$.studentsList": {$each: req.body.studentsList}}}, {projection: {attendance: {$elemMatch: {date:{$eq:req.body.date}}}}},function(err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(result);
                    }
                });
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
};

exports.getSubjects = (req, res) => {
    Subjects.find({teacher: req.body.email}).then(
        function(subjects) {
            if(!subjects) {
                return res.status(200).json({
                    message: "No subjects"
                });
            } else {
                var resSubjects = [];
                for (var i = 0; i < subjects.length; i++) {
                    resSubjects[i] = subjects[i].subject;
                }
                res.status(200).json({
                    subjects: resSubjects
                });
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );

};