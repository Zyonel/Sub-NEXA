import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";

//const express = require('express');
//const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

/* Ensure uploads folder exists */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* Middleware */
app.use(cors());

/* Multer setup */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

/* Serve static folders */
app.use(express.static("public"));        // /upload.html
app.use("/sub-nexa-admin", express.static("../sub-nexa-admin")); // /admin/receipt.html
app.use("/uploads", express.static("uploads"));

/* Upload endpoint */
app.post("/upload", upload.single("receipt"), (req, res) => {
  res.sendStatus(200);
});

/* List uploads */
app.get("/uploads-list", (req, res) => {
  const files = fs.readdirSync("uploads")
    .filter(f => /\.(png|jpg|jpeg|gif|pdf)$/i.test(f))
    .map(f => `/uploads/${f}`);
  res.json(files);
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
