module.exports = {
  // Secret key for JWT signing and encryption
  secret: "super secret passphrase",
  db_collection_prefix: "raise_",
  lang: "en",
  allowed_origin: ["https://frontend-for-raise-social.vercel.app"],

  expiresIn: 3600 * 72, // 3 days
  db_url: "mongodb+srv://admin:solana@raise.3twoe.mongodb.net/raise?retryWrites=true&w=majority&appName=Raise",
  db_options: {
    // useNewUrlParser: true, //from 6 or higher version of mongoose
    // useUnifiedTopology: true, // the same above
  },
  serviceUrl:
    process.env.REACT_APP_SERVICE_URL || "https://backend-for-raise-social.vercel.app/api",
};
