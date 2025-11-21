require('dotenv').config();

const oauthCheck = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Expecting: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Compare to actual OAuth token stored in environment variable
    if (token !== process.env.OAUTH_TOKEN) {
        return res.status(403).json({ error: "Invalid token" });
    }

    next();
};

module.exports = oauthCheck;