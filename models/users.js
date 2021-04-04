const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const studentSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    subjectsEnrolled: { type: Array, default: [] }
});

const teacherSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});


/**
 * Assuming no two teachers have same subject code
 * **/
const subjectSchema = mongoose.Schema({
    teacher: { type: String, required: true },
    subject: { type: String, required:true, unique: true },
    students: {type: Array, default: []},
    attendance:[{
        date: {type: String},
        studentsList: {type: Array, default: []}
    }]

});

studentSchema.plugin(uniqueValidator);
teacherSchema.plugin(uniqueValidator);
subjectSchema.plugin(uniqueValidator);

const students = mongoose.model('Students', studentSchema, "students");
const teachers = mongoose.model('Teachers', teacherSchema, "teachers");
const Subjects = mongoose.model('Subjects', subjectSchema, "subjects");

module.exports = {
    Students: students,
    Teachers: teachers,
    Subjects: Subjects
};