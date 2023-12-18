require('dotenv').config()

module.exports = {
    mongo: {
        user: process.env.MONGO_DATABASE_USER,
        password: process.env.MONGO_DATABASE_PASSWORD,
        name: process.env.MONGO_DATABASE_NAME,
    },
    session: {
        secret: process.env.SECRET_KEY,
        secretOrPrivateKey: process.env.JWT_SECRET,
    },
    github: {   
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    email: {
    emailUser : process.env.EMAIL_USER,
    emailPassword : process.env.EMAIL_PASSWORD,
    },
    url: {port: process.env.PORT}
}