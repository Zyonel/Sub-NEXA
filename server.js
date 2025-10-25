import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Setup multer to save files in /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Route to handle uploads
app.post("/upload", upload.single("receipt"), (req, res) => {
  res.send(`
    <h2 style="font-family:sans-serif;">✅ Upload successful!</h2>
    <p>Go to <a href="/admin.html">Admin Panel</a> to view receipts.</p>
  `);
});

// Route to list uploaded images
app.get("/uploads-list", (req, res) => {
  const files = fs.readdirSync("uploads")
    .filter(f => /\.(png|jpg|jpeg|gif|pdf)$/i.test(f))
    .map(f => `/uploads/${f}`);
  res.json(files);
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
