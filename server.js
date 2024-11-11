const express = require("express");
const { MongoClient } = require("mongodb");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Atlas connection string
const uri =
  "mongodb+srv://vammbox:nZrqyxtzADw7ciSz@cluster0.a6zyl.mongodb.net/sample_mflix?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let db, collection;

// Function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("sample_mflix"); // Use your database name here
    collection = db.collection("playlist");
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: "640ddf3eca3a4f7482844f1799a16a17", // Replace with your Client ID
  clientSecret: "f55bbeafc6bb4b4297ac636453515a62", // Replace with your Client Secret
  redirectUri: "http://localhost:3001/callback", // Use your redirect URI
});

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Spotify login route
app.get("/login", (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private",
  ];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Spotify callback route
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];

    // Set access and refresh tokens
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    console.log("Access Token Set:", accessToken);
    console.log("Refresh Token Set:", refreshToken);

    res.send("Authentication successful!");
  } catch (error) {
    console.error("Error during Spotify authentication:", error);
    res.send("Authentication failed");
  }
});

// Refresh Spotify access token periodically
setInterval(async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    const newAccessToken = data.body["access_token"];
    spotifyApi.setAccessToken(newAccessToken);
    console.log("Access token refreshed");
  } catch (err) {
    console.error("Could not refresh access token", err);
  }
}, 3500 * 1000); // Refresh every hour

// Middleware to ensure token availability
async function ensureAccessToken(req, res, next) {
  if (!spotifyApi.getAccessToken()) {
    return res.status(401).json({
      error: "Access token not available. Please authenticate first.",
    });
  }
  next();
}

// Route to generate playlist
app.post("/generatePlaylist", ensureAccessToken, async (req, res) => {
  try {
    const userInput = req.body.keywords;
    const cleanInput = userInput.trim().toLowerCase();
    console.log("User input processed:", cleanInput);

    // Search tracks using Spotify API
    const data = await spotifyApi.searchTracks(cleanInput, { limit: 10 });
    const tracks = data.body.tracks.items;

    // Store the track data in MongoDB Atlass
    await collection.insertMany(tracks);
    console.log("Tracks saved to MongoDB Atlas");

    res.json({
      message: "Playlist generated successfully!",
      tracks: tracks,
    });
  } catch (error) {
    console.error("Error generating playlist:", error);
    res.status(500).send("Error generating playlist");
  }
});

// Route to search tracks
app.get("/searchTracks", ensureAccessToken, async (req, res) => {
  const query = req.query.keyword;

  try {
    const data = await spotifyApi.searchTracks(query, { limit: 10 });
    res.json(data.body.tracks.items);
  } catch (error) {
    console.error("Error searching tracks:", error);
    res.status(500).send("Error searching tracks");
  }
});

console.log("About to start the server...");

// Start the server after connecting to MongoDB
app.listen(port, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${port}`);
});
