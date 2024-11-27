const express = require("express");
const { MongoClient } = require("mongodb");
const SpotifyWebApi = require("spotify-web-api-node");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Atlas connection string
const uri =
  "mongodb+srv://vammbox:nZrqyxtzADw7ciSz@cluster0.a6zyl.mongodb.net/sample_mflix?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let db, playlistCollection, usersCollection;

// Function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("sample_mflix"); // Use your database name here
    playlistCollection = db.collection("playlist");
    usersCollection = db.collection("users"); // Add a collection to store user tokens
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: "640ddf3eca3a4f7482844f1799a16a17", // Replace with your Client ID
  clientSecret: "f55bbeafc6bb4b4297ac636453515a62", // Replace with your Client Secret
  redirectUri: "http://192.168.0.208:3001/callback", // Replace with your redirect URI
});

// Route to generate a unique user ID
app.get("/generateUserId", (req, res) => {
  const uniqueUserId = uuidv4();
  res.json({ uniqueUserId });
});

// Spotify login route (for user-specific login)
app.get("/login", (req, res) => {
  const { userId } = req.query; // Accept a user identifier in query parameters
  if (!userId) {
    return res.status(400).send("Missing userId query parameter");
  }

  console.log(`Login initiated for userId: ${userId}`);
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-recently-played",
  ];
  const authorizeURL =
    spotifyApi.createAuthorizeURL(scopes) + `&state=${userId}`; // Add user ID to state for tracking
  res.redirect(authorizeURL);
});

// Spotify callback route to store user-specific tokens
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const userId = req.query.state; // Retrieve userId from the state parameter

  if (!userId) {
    console.error("Callback received without userId");
    return res.status(400).send("Missing userId in callback state");
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];

    // Store user-specific tokens in MongoDB
    await usersCollection.updateOne(
      { userId }, // Use userId as a unique identifier
      {
        $set: {
          accessToken,
          refreshToken,
          tokenExpiry: Date.now() + 3600 * 1000,
        },
      },
      { upsert: true } // Insert if not already present
    );

    console.log(`Tokens for user ${userId} stored in MongoDB`);

    res.send("Authentication successful! You can now close this page.");
  } catch (error) {
    console.error("Error during Spotify authentication:", error);
    res.send("Authentication failed");
  }
});

// Middleware to ensure user-specific access token is valid
async function ensureUserAccessToken(req, res, next) {
  const { userId } = req.query; // Get userId from request query parameters

  if (!userId) {
    console.error("Request missing userId");
    return res.status(400).json({ error: "Missing userId in request" });
  }

  try {
    // Retrieve user’s tokens from MongoDB
    const user = await usersCollection.findOne({ userId });
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Set the user’s refresh token in Spotify API client
    spotifyApi.setRefreshToken(user.refreshToken);

    // Check if the access token needs to be refreshed
    if (!spotifyApi.getAccessToken() || Date.now() > user.tokenExpiry) {
      const data = await spotifyApi.refreshAccessToken();
      const newAccessToken = data.body["access_token"];
      spotifyApi.setAccessToken(newAccessToken);

      // Update MongoDB with new access token and expiry time
      await usersCollection.updateOne(
        { userId },
        {
          $set: {
            accessToken: newAccessToken,
            tokenExpiry: Date.now() + 3600 * 1000,
          },
        }
      );

      console.log(`Access token for user ${userId} refreshed`);
    } else {
      spotifyApi.setAccessToken(user.accessToken); // Set existing access token
    }

    next();
  } catch (error) {
    console.error("Error ensuring access token:", error);
    res.status(500).send("Error ensuring access token");
  }
}

// Start the server after connecting to MongoDB
app.listen(port, async () => {
  await connectDB();
  console.log(`Server running on http://192.168.0.208:${port}`);
});
