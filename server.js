const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");

dotenv.config();

const app = express();
app.options("*", cors());
app.use(cors({
  origin: [
    "https://main.d1078qw6x3k74s.amplifyapp.com"
  ],
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

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

startServer();