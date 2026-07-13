const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:");
  console.error(err);
});

// Import database after dotenv
const sequelize = require("./config/db");

const app = express();

// CORS Configuration
// Use ALLOWED_ORIGINS (comma-separated) to whitelist origins. If not set, allow all origins.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests like curl or server-to-server (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0) {
        // No whitelist configured — allow all origins
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy: This origin is not allowed."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/employees", require("./routes/employeeRoutes"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  let retries = 10;

  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database Connected");

      await sequelize.sync();
      console.log("✅ Models Synced");

      app.listen(PORT, () => {
        console.log(`🚀 Server Running On Port ${PORT}`);
      });

      break;
    } catch (error) {
      retries--;

      console.log("⏳ Waiting for PostgreSQL...");
      console.log(error.message);

      if (retries === 0) {
        console.log("❌ Could not connect to PostgreSQL.");
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

startServer().catch((err) => {
  console.error("START SERVER ERROR:");
  console.error(err);
});