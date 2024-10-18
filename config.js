module.exports = {
  // Secret key for JWT signing and encryption
  secret: "super secret passphrase",
  db_collection_prefix: "raise_",
  lang: "en",
  allowed_origin: ["https://raise-frontend.vercel.app"],

  expiresIn: 3600 * 72, // 3 days
  db_url: "mongodb+srv://tuskidreamer:smiles@cluster0.ki9bs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  db_options: {
    // useNewUrlParser: true, //from 6 or higher version of mongoose
    // useUnifiedTopology: true, // the same above
  },
  serviceUrl:
    process.env.REACT_APP_SERVICE_URL || "https://raise-backend-new.vercel.app/api",
  cloudinary: {
    cloudName: 'dz01hd8xz',
    apiKey: '357492731237723',
    apiSecret: 'LS7QXpmPcStdHv9XBLJRS0pqauE',
  },
  imgur: {
    clientId: 'your_imgur_client_id',
  },
  googleCloud: {
    projectId: 'your_google_cloud_project_id',
    keyFilename: 'path/to/your-service-account-key.json',
  },

};
