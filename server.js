// This file keeps the project "alive"
// The bot is hosted on glitch.com, which puts scripts to sleep if they aren't pinged for 5 minutes
// This script pings itself every 5 minutes, so that it doesn't go to sleep.
const http = require(‘http’);
const express = require(‘express’);

const app = express();
app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
  });
  app.listen(process.env.PORT);
  setInterval(() => {
  http.get(https://bothome.glitch.me/);
}, 280000);
