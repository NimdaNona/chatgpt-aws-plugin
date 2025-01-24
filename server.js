require("dotenv").config(); // loads local .env if present
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Middleware to check for a valid Bearer Token
app.use((req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Bearer token" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  if (token !== process.env.BEARER_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  next(); // If token is valid, proceed to the next middleware/route handler
});

// AWS SDK v3
const {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
} = require("@aws-sdk/client-s3");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Serve the ai-plugin.json from /.well-known
app.get("/.well-known/ai-plugin.json", (req, res) => {
  res.sendFile(path.join(__dirname, "ai-plugin.json"));
});

// Serve the openapi.json
app.get("/openapi.json", (req, res) => {
  res.sendFile(path.join(__dirname, "openapi.json"));
});

// Create S3 Bucket endpoint
app.post("/create-s3-bucket", async (req, res) => {
  const { bucketName } = req.body;
  if (!bucketName) {
    return res.status(400).json({
      success: false,
      message: "Missing 'bucketName' in request body",
    });
  }

  try {
    const command = new CreateBucketCommand({ Bucket: bucketName });
    await s3Client.send(command);
    res.json({
      success: true,
      message: `Bucket '${bucketName}' created successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List S3 buckets endpoint
app.get("/list-s3-buckets", async (req, res) => {
  try {
    const command = new ListBucketsCommand({});
    const data = await s3Client.send(command);
    const bucketNames = data.Buckets.map(b => b.Name);

    res.json({ buckets: bucketNames });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Plugin server running on port ${port}`);
});
