const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C Martin",
    category: "Programming",
    price: 3799,
    description: "Clean coding practices and principles.",
    image_url:
      "https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX377_BO1,204,203,200_.jpg",
    stock: 25
  }
];

app.get("/books", (req, res) => {
  res.status(200).json({ books });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
