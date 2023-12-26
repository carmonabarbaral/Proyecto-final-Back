const config = () => {
  return {
    port: process.env.PORT,
    mongoDbHost: process.env.MONGO_DATABASE_HOST,
    mongoDbPassword: process.env.MONGO_DATABASE_PASSWORD,
    mongoDbUser: process.env.MONGO_DATABASE_USER,
    mongoDbName: process.env.MONGO_DATABASE_NAME,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    privateKey: process.env.PRIVATE_KEY,
    jwtKey: process.env.JWT_KEY,
    emailUser: process.env.EMAIL_USER,
    passUser: process.env.EMAIL_PASSWORD,
    environment: process.env.ENVIRONMENT,
    adminId: process.env.ADMIN_ID,
    adminUser: process.env.ADMIN_USER,
    adminPassword: process.env.ADMIN_PASSWORD,
    stripeKey: process.env.STRIPE_KEY,
  };
};
module.exports = config;