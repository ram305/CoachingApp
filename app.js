const express = require("express");
const app = express();
const nconf = require("nconf");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require("express-session");
const redis = require("redis");
const redisStore = require("connect-redis")(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

nconf
    .argv()
    .env()
    .file({
        file: __dirname + "/config.json",
    });

mongoose.connect(nconf.get("mongodbURL"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const redisSessionStore = redis.createClient(
    nconf.get("redisPort"),
    nconf.get("redisHost"),
    {
        db: 0,
    }
);

app.use(
    session({
        secret: nconf.get("sessionSecret"),
        cookie: {
            maxAge: 1000 * 60 * 15, // 1 week
        },
        store: new redisStore({ client: redisSessionStore }),
        resave: false,
        saveUninitialized: false,
    })
);


app.use('/auth', require('./routes/userRoutes'));
app.use('/teacher', require('./routes/teacherRoutes'));
app.use('/student', require('./routes/studentRoutes'));

app.listen(3005);