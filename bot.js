// Gets all the npm modules
// Discord.js
const Discord = require("discord.js");

const db = require("quick.db");

const client = new Discord.Client();

const http = require("http");

const askedRecently = new Set();

const prefix = "-";

const footer = "The Lunch Bot by fede4961#1097 and henrylang#1054";

const profile = "https://cdn.discordapp.com/app-icons/713533881709494312/5bf7f8c58f329e47255094f8e8d85612.png?size=256%22";

// Functions
function getRandomRange(min, max) {

    min = Math.ceil( min );

    max = Math.floor( max );

    return Math.floor( Math.random () * ( max - min + 1 ) ) + min;

}

function checkAccount ( accountIdentifier, userId ) {

  if ( !accountIdentifier ) {

    // Sets the account
    db.set ( 'user.account.' + userId, userId );

    // Sets the pocket
    db.set ( 'user.pocket.' + userId, 0 );

    // Sets the wallet
    db.set ( 'user.wallet.' + userId, 0 );

    // Sets the ask counter
    db.set ( 'user.asked.' + userId, 0 );

  }

}


// Logs in the console when the bot has logged in
client.on ( "ready", () => {

  console.log ( "[INFO/IMPORTANT]: Bot Online!" );

});

// When a message is sent
client.on ( "message", message => {

  // Checks that them message wasn't from a bot and starts with the prefix
  if ( !message.author.bot && message.content.startsWith ( prefix ) ) {

    // Gets info about message
    const authorId = message.author.id;

    const authorTag = message.author.tag;

    const channel = message.channel.id;

    const avatar = message.author.avatarURL;

    const args = message.content.slice ( prefix.length ).split (' ');

    const command = args.shift ().toLowerCase ();

    var pocket = db.get ( 'user.pocket.' + authorId );

    var wallet = db.get ( 'user.wallet.' + authorId );

    var asked = db.get ( 'user.asked.' + authorId );

    var account = db.get ( 'user.account.' + authorId );

    // If the user wants to run an "ask" command
    if ( command === "ask" ) {

      if ( askedRecently.has ( authorId ) ) {

          const askWaitEmbed = new Discord.MessageEmbed ()
          .setColor ( 'RANDOM' )
          .setAuthor ( authorTag, avatar )
          .setDescription ('Hey dude! The cool down to ask is ``45 seconds``\nYou stil gotta wait!')
          .setFooter ( footer, profile );

           message.channel.send ( askWaitEmbed );

      } else {

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
                           0: ["*No.*", false],
                           1: ["*Yes.*", true],
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
            var money = getRandomRange ( 19, 243 );

            // Generates embed
            var askEmbed = new Discord.MessageEmbed ()
            .setColor ('RANDOM')
            .setDescription ( choosenMessage + '\n' + '**' + choosenRelative + '** has given <@' + authorId + '> $' + money)
            .setTimestamp ()
            .setFooter ( footer, profile );

            checkAccount ( account, authorId );

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

          // Adds the user to the set so that they can't talk for a minute

          askedRecently.add(authorId);

          setTimeout(() => {

          // Removes the user from the set after a minute
          askedRecently.delete(authorId);

        }, 45000);

      }

    }




    if ( command === 'bal' ) {

      console.log(authorTag + ' is running a -bal command!');

      // Checks if there is a mention in the command
      if ( message.mentions.members.first() ) {

        var mention = message.mentions.members.first();

        var mentionAccount = db.get ( 'user.account.' + mention.user.id );

        checkAccount ( mentionAccount, mention.user.id );

        var userPocket = db.get( 'user.pocket.' + mention.user.id);

        var userWallet = db.get( 'user.wallet.' + mention.user.id);

        const balEmbed = new Discord.MessageEmbed ()
        .setColor('RANDOM')
        .setAuthor(mention.user.username + '\'s Balance:', message.author.avatarURL)
        .setDescription('**Pocket:** ' + userPocket + '\n**Wallet:** ' + userWallet)
        .setTimestamp()
        .setFooter(footer, profile);

        message.channel.send(balEmbed);

      } else {

        var mentionAccount = db.get ( 'user.account.' + authorId );

        checkAccount ( mentionAccount, authorId );

        var userPocket = db.get( 'user.pocket.' + authorId );

        var userWallet = db.get( 'user.wallet.' + authorId );

        const balEmbed = new Discord.MessageEmbed ()
        .setColor('RANDOM')
        .setAuthor( message.author.username + '\'s Balance:', message.author.avatarURL )
        .setDescription('**Pocket:** ' + userPocket + '\n**Wallet:** ' + userWallet)
        .setTimestamp()
        .setFooter(footer, profile);

        message.channel.send(balEmbed);

      }

    }

  }

})

// Logs into the bot
client.login ( process.env.TOKEN );
