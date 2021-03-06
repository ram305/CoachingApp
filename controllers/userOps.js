const { Students } = require('../models/users');
const { Teachers } = require('../models/users');
const bcrypt = require('bcrypt');
const joi = require("@hapi/joi");
const jswt = require('jsonwebtoken');


signupFunction = (user) => {
    user.save().then(
        () => {
            res.status(200).json({
                message: 'User added succesfully'
            });
        }
    ).catch(
        (error) => {
            return res.status(500).json({
                error: new Error(error)
            });
        }
    );
};

exports.signUp = (req, res) => {
    try {
        const schema = joi.object().keys({
            firstName: joi.string().min(3).max(45).required(),
            lastName: joi.string().min(1).max(45).required(),
            email: joi.string().email().required(),
            password: joi.string().min(6).max(20).required(),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            throw result.error.details[0].message;
        }
        bcrypt.hash(req.body.password, 10).then(
            (hashPass) => {
                if (req.body.userType === 'STUDENT') {
                    const student = new Students({
                        email: req.body.email,
                        password: hashPass,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    });
                    signupFunction(student);
                } else {
                    const teacher = new Teachers({
                        email: req.body.email,
                        password: hashPass,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    });
                    signupFunction(teacher);
                }
            }
        )
    } catch (e) {
        res.status(500).json({ error: e });
    }
};

loginFunction = (table, req, res) => {
    table.findOne({email: req.body.email}).then(
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found!')
                });
            }
            try {
                bcrypt.compare(req.body.password, user.password).then(
                    (valid) => {
                        if (!valid) {
                            res.status(401).json({
                                error: new Error('Password check failed')
                            });
                        }
                        const token = jswt.sign(
                            {userId: user._id},
                            'TOKEN_SECRET_KEY',
                            {expiresIn: '15d'});
                        req.session.user = {
                            userId: user._id
                        };
                        return res.status(200).json({
                            token: token,
                            user: req.body.email,
                            userId: user._id

                        });
                    }
                )
            }
            catch (e) {
                    res.json({ error: true, message: e });
            }
        }
    );
};


exports.logIn = (req, res) => {
    if(req.body.userType === 'STUDENT'){
        loginFunction(Students, req, res);
    } else if(req.body.userType === 'TEACHER'){
        loginFunction(Teachers, req, res);
    } else {
        return res.status(500).json({
            error: new Error()
        });
    }
};

exports.logout = (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        req.session.destroy();
    }
    return res.status(200).json({
        message: "logged out"
    });
};