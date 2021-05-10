//basic properties of express
const express = require ('express');
const path = require("path");
const util = require("util");
const fs = require("fs");
const { constants } = require('buffer');
//creating the express app 
const app = express ();
//sets the initial port 
const PORT = process.env.PORT || 3001;

//express middleware
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

//set variables
const writeFileSync = util.promisify(fs.writeFile);
const readFileSync = util.promisify(fs.readFile);
let allNotes;
//Router 
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/api/notes", (req, res) => {
    readFileSync(path.join(__dirname, "./db/db.json"), "utf8")
    .then((data) => {
        return res.json(JSON.parse(data));
    });
});

app.post("/api/notes", (req,res) => {
    const newNote = req.body; 
    readFileSync(path.join(__dirname, "./db/db.json"), "utf8")
    .then((data) => {
        allNotes = JSON.parse(data);
        if(newNote.id || newNote.id === 0) {
            let currNote = allNotes[newNote.id];
            currNote.title = newNote.title;
            currNote.text = newNote.text;
        } else {
            allNotes.push(newNote);
        }
        writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
        .then(() => {
            console.log("write db.json file");
        })
    });
});
//delete requests 
app.delete("/api/notes/:id", (req,res) => {
    const id = req.params.id ; 
    readFileSync(path.join(__dirname, "./db/db.json"), "utf8")
    .then((data) => {
        allNotes = JSON.parse(data);
        allNotes.splice(id,1);
        writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
        .then(() => {
            console.log("delete db.json file");
        })
    });
    res.json(id);
});


//LISTENER
app.listen(PORT, () => {
    console.log(`API server now on ${PORT}`)
});