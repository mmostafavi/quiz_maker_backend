import express from "express";
import "dotenv/config";

const PORT = process.env.PORT || 8000;
const app = express();

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
