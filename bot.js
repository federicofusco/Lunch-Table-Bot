// Gets all the npm modules
const Discord = require("discord.js");
const db = require("quick.db");
const client = new Discord.Client();
const http = require("http");
const prefix = "-";
const footer = "The Lunch Bot by fede4961#1097 and henrylang#1054";
const profile = "https://cdn.discordapp.com/app-icons/713533881709494312/5bf7f8c58f329e47255094f8e8d85612.png?size=256%22";

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

// Functions
function getRandomRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Logs in the console when the bot has logged in
client.on ( "ready", () => {

  console.log("[INFO/IMPORTANT]: Bot Online!");

});

// When a message is sent
client.on ( "message", message => {

  // Checks that them message wasn't from a bot and starts with the prefix
  if ( !message.author.bot && message.content.startsWith ( prefix ) && message.channel.id === '713504998968918068' ) {

    // Gets info about message
    const authorId = message.author.id;
    const authorTag = message.author.tag;
    const channel = message.channel.id;
    const args = message.content.slice ( prefix.length ).split (' ');
    const command = args.shift ().toLowerCase ();
    var pocket = db.get ( 'user.pocket.' + authorId );
    var wallet = db.get ( 'user.wallet.' + authorId );
    var asked = db.get ( 'user.asked. ' + authorId );

    // If the user wants to run an "ask" command
    if ( command === "ask" ) {

      // Adds 1 to the users ask counter
      db.add ( 'user.asked.' + authorId, 1 );

      // Specifies in the console that the user has sent an -ask command
      console.log("[AUDIT]: " + authorTag + " has run an -ask command");

      // JS Object of all relatives. In the future, this will be able to be modified by server admins and developers.
      var relatives = {
                         0: "Mom",
                         1: "Dad",
                         2: "Uncle",
                         3: "Brother",
                         4: "Sister",
                         5: "Grandpa",
                         6: "Grandma",
                         7: "Cousin",
                         8: "Keanu Reeves",
                         9: "Edna Mode",
                         10: "Aunt",
                         11: "Uncle",
                         12: "Local Pedophile",
                         13: "Personal Stalker"
                      };

      // Picks a random relative
      var relativesId = Math.floor ( Math.random () * Math.floor ( Object.keys ( relatives ).length ) );
      var choosenRelative = relatives [ relativesId ];

      // JE Object of all the context that the relatives can say. This too will be modifiable in the future
      var messages = {
                       0: ["*No.", false],
                       1: ["*Yes.", true],
                       2: ["LMAOOOOO sure why not?", true],
                       3: ["I'm not going to support your ice cream addiction", false],
                       4: ["Yea no", false],
                       5: ["No u", false],
                       6: ["ok", true],
                       7: ["HAHAHAHAHA no.", false],
                       8: ["lol no", false],
                       9: ["lol ok", true],
                       10: ["HAHA *poor*", false],
                       11: ["whatever...", true],
                       12: ["Ugh no", false]
                    };

      // Picks a random message and checks wether the user should recieve money or not
      var messageId = Math.floor ( Math.random () * Math.floor ( Object.keys ( messages ).length ) );
      var choosenMessage = messages [ messageId ] [0];
      var giveMoney = messages [ messageId ] [1];

      // If the user is supposed to recieve money,
      if ( giveMoney ) {

        // Randomly decides how much money the user should recieve
        var money = getRandomRange ( 50, 743 );

        // Generates embed
        var askEmbed = new Discord.MessageEmbed ()
        .setColor ('RANDOM')
        .setDescription ( choosenMessage + '\n' + '**' + choosenRelative + '** has given <@' + authorId + '> $' + money)
        .setTimestamp ()
        .setFooter ( footer, profile );

        // Adds the money to the users pocket
        db.add ( 'user.pocket.' + authorId, money );

        // Sends the Embed in the channel
        message.channel.send ( askEmbed );

        // Logs it to the console
        console.log ( "[AUDIT]: Given " + authorTag + ' $' + money );

      } else {

        var askEmbed = new Discord.MessageEmbed ()
        .setColor ('RANDOM')
        .setDescription ( '**' + choosenRelative + '**: '  + choosenMessage )
        .setTimestamp ()
        .setFooter ( footer, profile );

        // Sendds the embed in the channel
        message.channel.send ( askEmbed );

        // Logs it into the console
        console.log ( "[AUDIT]: Given " + authorTag + ' $0' );

      }



    }

  }

})

// Logs into the bot
client.login ( process.env.TOKEN );
