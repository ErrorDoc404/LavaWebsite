const api = require("express").Router();
const { Collection } = require("discord.js");
const { join } = require("path");
const config = require("../config");
const { Auth, Administrator } = require("./Middlewares");
const fs = require("fs");

// Read categories from the commands directory
const categories = fs.readdirSync(__dirname + '/../handlers/commands/');

let Commands = [];

// Iterate through each category
categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
  // Read files in the category directory
  const files = fs.readdirSync(__dirname + `/../handlers/commands/${cat}/`).filter((f) =>
    f.endsWith('.js')
  );

  // Iterate through each file in the category
  files.forEach((file) => {
    // Require the command file
    let cmd = require(__dirname + `/../handlers/commands/${cat}/` + file);

    // Add the command to the Commands array if it has the required properties
    if (!cmd.name || !cmd.description || !cmd.SlashCommand) return;
    Commands.push({
      name: cmd.name,
      aliases: cmd.aliases,
      usage: cmd.usage,
      description: cmd.description,
      slash: cmd.SlashCommand ? true : false,
      premium: cmd.premium ? cmd.premium : false,
    });
  })
});

// Sort the Commands array alphabetically by name
Commands.sort(function (cmd1, cmd2) {
  if (cmd1.name > cmd2.name) return 1;
  if (cmd1.name < cmd2.name) return -1;
  return 0;
});

// Serve the index.html file
api.get("/", (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.sendFile(join(__dirname, "..", "webview", "index.html"));
});

// Serve the dashboard.html file with authentication
api.get("/dashboard", Auth, (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.sendFile(join(__dirname, "..", "webview", "dashboard.html"));
});

// Serve the redeem.html file with authentication
api.get("/redeem", Auth, (req, res) => {
  req.session.returnTo = req.originalUrl;
  console.log(req.session)
  res.sendFile(join(__dirname, "..", "webview", "redeem.html"));
});

api.get("/user", Auth, Administrator, (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.sendFile(join(__dirname, "..", "webview", "user.html"));
});

// Serve the music.html file with authentication
api.get("/save-song", Auth, (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.sendFile(join(__dirname, "..", "webview", "music.html"));
});

api.get("/ticket", Auth, (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.sendFile(join(__dirname, "..", "webview", "ticket.html"));
});

api.get("/terms-of-service", (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.sendFile(join(__dirname, "..", "webview", "tos.html"));
});

api.get("/privacy-policy", (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.sendFile(join(__dirname, "..", "webview", "pp.html"));
});


// Serve the server/index.html file with authentication and guild validation
api.get("/server/:id", Auth, (req, res) => {
  req.session.returnTo = req.originalUrl;
  try {
    if (!req.user.guilds.find((x) => x.id == req.params.id))
      return res.redirect("/dashboard");
    res.sendFile(join(__dirname, "..", "webview", "server", "index.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("500 Internal Server Error");
  }
});

// Serve the api/commands endpoint with the Commands data
api.get("/api/commands", (req, res) => {
  req.session.returnTo = req.originalUrl;
  try {
    res.send({ commands: Commands });
  } catch (error) {
    console.error(error);
    res.status(500).send("500 Internal Server Error");
  }
});

// Logout route
api.get("/logout", (req, res) => {
  try {
    if (req.user) req.logout(function (err) { if (err) return next(err); });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("500 Internal Server Error");
  }
});

// 404 route handler for unknown routes
// api.use(function (req, res, next) {
//   res.status(404).send("404 Not Found");
// });

// 500 route handler for internal server errors
// api.use(function (err, req, res, next) {
//   console.error(err);
//   res.status(500).send("500 Internal Server Error");
// });

// api.get("/passbook", Auth, (req, res) => {
//   res.sendFile(join(__dirname, "..", "webview", "passbook.html"));
// });

// api.get("/chat", Auth, (req, res) => {
//   res.sendFile(join(__dirname, "..", "webview", "chat.html"));
// });

// api.get("/servers", Auth, (req, res) => {
//   res.sendFile(join(__dirname, "..", "views", "servers.html"));
// });

// api.get("/server/:id/music", Auth, (req, res) => {
//   if (!req.user.guilds.find((x) => x.id == req.params.id))
//     return res.redirect("/servers");
//   res.sendFile(join(__dirname, "..", "views", "music.html"));
// });

// api.get("/api/info", (req, res) => {
//   res.send({
//     ClientID: config.ClientID,
//     Permissions: config.Permissions,
//     Scopes: config.Scopes,
//     Website: config.Website,
//     CallbackURL: config.CallbackURL,
//   });
// });

module.exports = api;