const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'TOKEN_SECRET_KEY');
        const userId = decodedToken.userId;
        console.log(req.session.user.userId);
        console.log(req.body.userId);
        if (req.body.userId !== userId || req.session.user.userId !== req.body.userId) {
            // throw 'Invalid user ID';
            return res.status(401).json({
                error: new Error("Invalid user")
            });
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};