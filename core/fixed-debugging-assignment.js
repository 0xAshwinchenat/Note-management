const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers);  /// here it should be allUsers instead of userList
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id); /// here it should be Number instead of just req.params.id
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

function getUserById(id) {
  const user = users.find(u => u.id === id);
  return user;  /// here there was no return statement, so it should be added to return the found user
  
}

app.get("/notes/count", (req, res) => {
  const total = notes.length; /// there was a typo lenght instead of length
  res.send({ total });
});

app.get("/external-data", async (req, res) => {
  const data = await fetchExternalData(); /// there was a missing await keyword to wait for the promise to resolve before sending the response
  res.send(data);
});

app.get("/notes", (req, res) => {
  if (notes.length === 0) {  /// there was an empty array check instead of checking the length of the notes array
    console.log("No notes found");
  }
  res.send(notes);
});

function generateNoteId() {
  return Math.random() * 1000;
}

app.post("/notes", (req, res) => {
  const newId = generateNoteId(); /// there was a missing function call to generate a new ID but it was above the function definition, so it should be called after the function is defined
  const { title, content, userId } = req.body;

  if (!title || !content) {  /// there was && operator instead of || operator to check if either title or content is missing
    return res.send("Invalid input");
  }

  const newNote = {
    id: newId,
    title: title,
    content: content,
    userId: userId
  };

  notes.push(newNote);
  res.send(newNote);
});

app.delete("/notes/:id", (req, res) => {

const id = Number(req.params.id); /// there was a missing Number conversion
const noteIndex = notes.findIndex(n => n.id === id);
if (noteIndex === -1) return res.status(404).send("Not found"); 
res.send({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send("User not found");
  user.name = name; /// it was username before but it should be name to match the user object structure
  res.send(user);
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const userNotes = notes.filter(n => n.userId === userId); /// before it was assignment operator instead of comparison operator 
  res.send(userNotes);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") { /// it was or operator instead of and operator (if it was or it login if either email or password is correct, but it should be both to be correct)
    res.send({ message: "Login successful" });
  } else {
    res.send({ message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id); /// it was filter method which returns an array, but it should be find method to return a single user object
  if (!user) return res.status(404).send("Not found");
  res.send(user); 
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  const total = Number(a) + Number(b);
  res.send({ total });
});

app.listen(5000, () => { /// it was 3000 before but it should be 5000 to match the console log message
  console.log("Server running on port 5000"); 
});