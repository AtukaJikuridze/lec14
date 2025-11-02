const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3030;
const { write, read } = require("./utils/helper");

const SECRET_KEY = "mysecret123";

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (token === `Bearer ${SECRET_KEY}`) {
    next();
  } else {
    res.status(403).json({ error: "Access denied: invalid or missing token" });
  }
}

app.get("/users", async (req, res) => {
  const data = await read("users.json", true);

  res.json(data);
});
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const data = await read("users.json", true);
  const correctIdData = data.find((e) => +e.id === +id);
  res.json(correctIdData || "User not found");
});

app.post("/users", async (req, res) => {
  const { name, age, eyecolor, email } = req.body;

  if (!name || !age) {
    return res.status(400).json({
      error: "name and age are required.",
    });
  }

  if (age < 10 || age > 30) {
    return res.status(400).json({
      error: "age must be between 10 and 30",
    });
  }

  const data = await read("users.json", true);
  const lastId = data.length ? data[data.length - 1].id : 0;
  const newData = [
    ...data,
    {
      id: lastId + 1,
      name,
      age,
      eyecolor,
      email,
    },
  ];

  await write("users.json", newData, true);
  res.json(newData);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, eyecolor, email } = req.body;

  let data = await read("users.json", true);
  const userIndex = data.findIndex((e) => +e.id === +id);

  if (userIndex === -1) {
    return res.status(404).json("User not found");
  }

  if (age && (age < 10 || age > 30)) {
    return res.status(400).json("age must be between 10 and 30");
  }

  if (!name || !age) {
    return res.status(400).json({
      error: "name and age are required.",
    });
  }

  const updatedUser = {
    ...data[userIndex],
    name,
    age,
    eyecolor,
    email,
  };

  data[userIndex] = updatedUser;
  await write("users.json", data, true);
  res.json(data);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const data = await read("users.json", true);
  const newData = data.filter((e) => +e.id !== +id);

  await write("users.json", newData, true);
  res.json(newData);
});

app.get("/secret/users", authenticate, async (req, res) => {
  const data = await read("users.json", true);
  res.json({ message: "Welcome to the secret route!", data });
});

app.listen(PORT, () => {
  console.log(`Server Running on localhost:${PORT} - Port`);
});
