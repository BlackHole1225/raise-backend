module.exports = {
  MONGOURI: process.env.MONGOURI || "mongodb+srv://tuskidreamer:smiles@cluster0.ki9bs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  secretOrKey: "secret",
  allowed_origin: ["https://raise-frontend.vercel.app"],
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
