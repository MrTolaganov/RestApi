const express = require("express");
const { resolve } = require("path");
// const contacts = require("./services/contacts");
const { v4 } = require("uuid");

const app = express();

let contacts = [];

app.use(express.json());
app.use(express.static(resolve(__dirname, "client")));

// GET method
app.get("/api/contacts", (req, res) => {
  setTimeout(() => {
    res.status(200).json(contacts);
  }, 2000);
});

// POST method
app.post("/api/contacts", (req, res) => {
  const contact = { ...req.body, id: v4(), marked: false };
  contacts.push(contact);
  res.status(200).json(contact);
});

// DELETE method
app.delete("/api/contacts/:id", (req, res) => {
  contacts = contacts.filter(contact => contact.id !== req.params.id);
  res.status(200).json({ message: "Contact was deleted successfully" });
});

// PUT method
app.put("/api/contacts/:id", (req, res) => {
  const idx = contacts.findIndex(contact => contact.id !== req.params.id);
  contacts[idx] = req.body;
  res.status(200).json(contacts[idx]);
});

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "client", "index.html"));
});

app.listen(5000, () => {
  console.log("Server is running on port: 5000...");
});
