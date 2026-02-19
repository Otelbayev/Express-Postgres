import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello motherfucker",
  });
});

app.listen(5000, () => {
  console.log("Server is running on 5000 port");
});
