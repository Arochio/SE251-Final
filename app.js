// imports to set up the basic tools you'll need to build a web server with Express, handle file operations, and manage file paths.
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.get('/favicon.ico', (req, res) => res.status(204)); ---> is this needed?

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, `utf8`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Get to sign up page
app.get(`/signup`, (req, res) => {
  const filePath = path.join(__dirname, `public`, `signup.html`);
  res.sendFile(filePath); //uses 'sendFile' to display the html rather than 'send'
});
app.get(`/account`, (req, res) => {
  const filePath = path.join(__dirname, `public`, `account.html`);
  console.log(filePath);
  res.sendFile(filePath); //uses 'sendFile' to display the html rather than 'send'
});

app.get(`/accounts`, async (req, res) => {
  var data = await readFile(`./data/accounts.json`);
  res.send(data);
});
// Add a new account
app.post(`/accounts`, async (req, res) => {
  var oldData = await readFile(`./data/accounts.json`);
  var newData = await JSON.parse(oldData);

  // use boolean to determine if new account is already in the list
  var found = false;
  for (var i = 0; i < newData.length; i++) {
    if (newData[i].username === req.body.username) {
      found = true;
      console.log(`Account already exists`);
      res.send(`Account already exists`);
      return;
    }
  }

  if (!found) {
    newData.push(req.body);
    const jsonString = JSON.stringify(newData);
    await fs.writeFile(`./data/accounts.json`, jsonString, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Account added`);
      }
    });
    res.redirect('/login');
  }
});

// Get to login page
app.get(`/login`, (req, res) => {
  const filePath = path.join(__dirname, `public`, `index.html`);
  res.sendFile(filePath); //uses 'sendFile' to display the html rather than 'send'
});

// Get to account page if login info matches username and password in JSON file
app.post(`/login`, async (req, res) => {
  var oldData = await readFile(`./data/accounts.json`);
  var newData = await JSON.parse(oldData);
  var found = false;

  for (var i = 0; i < newData.length; i++) {
    if (newData[i].username === req.body.username && newData[i].password === req.body.password) {
      found = true;
      console.log(`Login successful`);
    }
  }

  if (!found) {
    console.log(`Login failed`);
    res.send(`Login failed`);
  }
  else {
    console.log(__dirname + `/public/account.html`)
    
    //
  }
  //res.redirect('/account')
  //res.sendFile(__dirname + `/public/account.html`);
  res.send(`{"valid":"true"}`);
});

//Start up the server on port 80.
var port = process.env.PORT || 80;
app.listen(port, () => {
  console.log("Server Running at Localhost:80");
});