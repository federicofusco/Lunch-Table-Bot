// Gets all the npm modules
// Discord.js
const Discord = require ( "discord.js" );

const db = require ( "quick.db" ) ;

const client = new Discord.Client ();

const http = require ( "http" ) ;

const askedRecently = new Set ();
const hasDaily = new Set ();
const hadLunch = new Set ();

const prefix = "?";

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

    // Sets the locker
    db.set ( 'user.locker.' + userId, 0 );

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

    var locker = db.get ( 'user.locker.' + authorId );

    var asked = db.get ( 'user.asked.' + authorId );

    var account = db.get ( 'user.account.' + authorId );

    // If the user wants to run an "ask" command
    if ( command === 'ask' || command === 'beg' ) {

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

          // Adds the user to the set so that they can't talk for 45 seconds

          askedRecently.add(authorId);

          setTimeout(() => {

          // Removes the user from the set after 45 seconds
          askedRecently.delete(authorId);

        }, 45000);

      }

    }

    /* BAL COMMAND */

    if ( command === 'bal' || command === 'money' ) {

      console.log(authorTag + ' is running a -bal command!');

      // Checks if there is a mention in the command
      if ( message.mentions.members.first() ) {

        var mention = message.mentions.members.first();

        var mentionAccount = db.get ( 'user.account.' + mention.user.id );

        checkAccount ( mentionAccount, mention.user.id );

        var userPocket = db.get( 'user.pocket.' + mention.user.id);

        var userLocker = db.get( 'user.locker.' + mention.user.id);

        const balEmbed = new Discord.MessageEmbed ()
        .setColor('RANDOM')
        .setAuthor(mention.user.username + '\'s Balance:', message.author.avatarURL)
        .setDescription('**Pocket:** ' + userPocket + '\n**Locker:** ' + userLocker)
        .setTimestamp()
        .setFooter(footer, profile);

        message.channel.send(balEmbed);

      } else {

        var mentionAccount = db.get ( 'user.account.' + authorId );

        checkAccount ( mentionAccount, authorId );

        var userPocket = db.get( 'user.pocket.' + authorId );

        var userLocker = db.get( 'user.locker.' + authorId );

        const balEmbed = new Discord.MessageEmbed ()
        .setColor ( 'RANDOM' )
        .setAuthor ( authorTag + '\'s Balance:', message.author.avatarURL )
        .setDescription ( '**Pocket:** ' + userPocket + '\n**Locker:** ' + userLocker )
        .setTimestamp ()
        .setFooter ( footer, profile );

        message.channel.send ( balEmbed );

      }

    }

    /* DAILY COMMAND */

    if ( command === 'daily' || command === 'day' ) {

      checkAccount ( account, authorId );

      if ( hasDaily.has ( authorId ) ) {

        const usedDailyEarlyEmbed = new Discord.MessageEmbed ()
        .setColor ( 'RANDOM' )
        .setAuthor ( 'Yo ' + authorTag + ',', avatar )
        .setDescription ( 'You gotta calm down <@' + authorId + '>,\n the default wait time\'s ``24 hours``.')
        .setTimestamp ()
        .setFooter ( footer, profile );

        message.channel.send ( usedDailyEarlyEmbed );

      } else {

        db.add ( 'user.pocket.' + authorId, 75 );

        const usedDailyEmbed = new Discord.MessageEmbed ()
        .setColor ( 'RANDOM' )
        .setAuthor ( authorTag, avatar )
        .setDescription ( 'Yay <@' + authorId + '>! you used your daily!\nYou found ``$75`` on the bathroom floor!' )
        .setTimestamp ()
        .setFooter ( footer, profile );

        message.channel.send ( usedDailyEmbed );


        // Adds the user to the set so that they can't use the command for a day
        hasDaily.add ( authorId );

        setTimeout ( () => {

          // Removes the user from the set after a minute
          hasDaily.delete ( authorId );

        }, 86400000 );
     }

    }

    /* BUG COMMAND */

    if ( command === 'bug' || command === 'vuln' ) {

      const bugEmbed = new Discord.MessageEmbed ()
      .setColor ( 'RANDOM' )
      .setTitle ( 'Report Bug', 'https://github.com/federicofusco/Lunch-Table-Bot/issues' )
      .setURL ( 'https://www.google.com' )
      .setDescription ( 'Yo <@' + authorId + '>, report a bug by clicking on this message!' )
      .setTimestamp ()
      .setFooter ( footer, profile );

      message.channel.send ( bugEmbed );

    }

    /* LUNCH COMMAND */
    if ( command === 'lunch' || command === 'food' ) {


      if ( hadLunch.has ( authorId ) ) {

        const alreadyOrderedLunch = new Discord.MessageEmbed ()
        .setColor ( 'RANDOM' )
        .setAuthor ( 'Yo ' + authorTag + ',', avatar )
        .setDescription ( 'Still hungry bro? Sucks cuz you gotta wait ``3 hours`` to get another lunch bro.')
        .setTimestamp ()
        .setFooter ( footer, profile );

        message.channel.send ( alreadyOrderedLunch );

      } else {

        var lunchMenu = {
                        1: "Sloppy ~~Joe~~ Diarrhea",
                        2: "Boat Pizza",
                        3: "Stale Bread w/ Expired Milk",
                        4: "League of Legends",
                        5: "Block of *Solid* Pudding",
                        6: "Melted Ice Cream",
                        7: "Serghi127's Ban Record\n(You get a second one if you can finish it LMAO)",
                        8: "Plastic Spoon",
                        9: "Moldy Fruit",
                        10: "Projectile Vomit",
                        11: "Spit Ball"
                      }

        var meal = getRandomRange ( 1, 11 );

        var mealName = lunchMenu [ meal ];

        const lunchEmbed = new Discord.MessageEmbed ()
        .setColor ( 'RANDOM' )
        .setAuthor ( 'Here\'s your lunch boiii', avatar )
        .setDescription ( '``' + mealName + '`` Comin\' up for <@' + authorId + '>!\n\n\nhehe, good luck!' )
        .setTimestamp ()
        .setFooter ( footer, profile );

        message.channel.send ( lunchEmbed );

        // Adds the user to the set so that they can't talk three hours
        hadLunch.add ( authorId );

        setTimeout ( () => {

          // Removes the user from the set after three hours
          hadLunch.delete ( authorId );

        }, 10800000 );
      }

    }

    /* SHOP COMMAND */
    if ( command === 'shop' || command === 'store' ) {

      // object with all the items in the shop (more will be added in the future)
      var shopItems = {
                        "paperclip": {
                                      "name": "Paper Clip",
                                      "description": "Can be used to pick lockers open!",
                                      "buy": 1500,
                                      "sell": 750
                                     },
                        "pencil": {
                                   "name": "Pencil",
                                   "description": "Can be used to stab people if they try to pick your locker open!",
                                   "buy": 3000,
                                   "sell": 1000
                                  },
                        "snack": {
                                  "name": "Snack",
                                  "description": "Can be eaten instead of the cafeteria food to avoid vomiting!",
                                  "buy": 500,
                                  "sell": 300
                                 },
                        "testanswers": {
                                        "name": "Test Answers",
                                        "description": "Can be used to answer correctly on a quiz or test!",
                                        "buy": 5000,
                                        "sell": 1000
                                       },
                        "phone": {
                                  "name": "Phone",
                                  "Descrpition": "Call your friends during class!",
                                  "buy": 10000,
                                  "sell": 2000
                                 },
                        "remote": {
                                   "name": "Projector Remote",
                                   "description": "Use this to be able to edit *anyone\'s* messages!\n*Until it gets confiscated in about 7-10 minutes",
                                   "buy": 15000,
                                   "sell": 3000
                                  },
                        "fakeid": {
                                   "name": "Fake ID",
                                   "description": "Can be used to change your nickname!",
                                   "buy": 13000,
                                   "sell": 100
                                  }
                      }

                      // Generates embed to send in response
                      const shopEmbed = new Discord.MessageEmbed ()
                      .setColor ( 'RANDOM' )
                      .setTitle ( 'School Shop (unofficial)' )
                      .addField ( ':paperclip: **Paper Clip**', '`` $' + shopItems.paperclip.buy + ' ``', true )
                      .addField('\u200b', '\u200b', true )
                      .addField ( ':pencil2: **Pencil**', '`` $' + shopItems.pencil.buy + ' ``', true )
                      .addField('\u200b', '\u200b' )
                      .addField ( ':canned_food: **Snack**', '`` $' + shopItems.snack.buy + ' ``', true )
                      .addField('\u200b', '\u200b', true )
                      .addField ( ':newspaper: **Test Answers**', '`` $' + shopItems.testanswers.buy + ' ``', true )
                      .addField('\u200b', '\u200b' )
                      .addField ( ':iphone: **Phone**', '`` $' + shopItems.phone.buy + ' ``', true )
                      .addField('\u200b', '\u200b', true )
                      .addField ( ':control_knobs: **Remote**', '`` $' + shopItems.remote.buy + ' ``', true )
                      .addField('\u200b', '\u200b' )
                      .addField ( ':credit_card: **Fake ID**', '`` $' + shopItems.fakeid.buy + ' ``', true )
                      .setThumbnail ( 'https://cdn.glitch.com/b1276a8f-0390-4506-b0c6-6be33d4596c2%2Fstore.jpg?v=1590766699998' )

                      // sendds embed into the channel
                      message.channel.send ( shopEmbed );

    }

    /* HELP COMMAND */
    if ( command === 'help' || command === 'h' ) {

      const commands = {
                        help: {
                               "icon": ":grey_question:",
                               "command": "?help",
                               "description": "A command used to learn how to use all the other commands!",
                               "help_command": "contact fede4961#1097 or henrylang#1054",
                               "alias": "h",
                               "command_args": [
                                                {"arg": "lunch", "description": "Command (?lunch)"},
                                                {"arg": "bal", "description": "Command (?bal)"},
                                                {"arg": "shop", "description": "Command (?shop)"},
                                                {"arg": "daily", "description": "Command (?daily)"},
                                                {"arg": "bug", "description": "Command (?bug)"},
                                                {"arg": "ask", "description": "Command (?ask)"}
                                               ]
                               },
                        lunch: {
                                "icon": ":canned_food:",
                                "command": "?lunch",
                                "description": "Get ya lunch boiii",
                                "help_command": "?help lunch",
                                "alias": "food",
                                "command_args": []
                               },
                        bal: {
                              "icon": ":money_with_wings:",
                              "command": "?bal",
                              "description": "Get people's bank info...",
                              "help_command": "?help bal",
                              "alias": "money",
                              "command_args": [
                                               {"arg": "@user", "description": "User mention which specifies which user's balance to check lol"}
                                              ]
                             },
                        shop: {
                               "icon": ":shopping_bags:",
                               "command": "?shop",
                               "description": "Take a lovle' trip to the mall with ya friends!",
                               "help_command": "?help shop",
                               "alias": "store",
                               "command_args": [
                                                {"arg": "Shop Item", "description": "If you include an item name, you'll get a brief description of the item"}
                                               ]
                              },
                        daily: {
                                "icon": ":calendar:",
                                "command": "?daily",
                                "description": "Get ya daily allowance!",
                                "help_command": "?help daily",
                                "alias": "day",
                                "command_args" : []
                               },
                        bug: {
                              "icon": ":computer:",
                              "command": "?bug",
                              "description": "Report a bug, and we'll fix it soon enough.\neither that or we'll send you a passive aggressive ping.",
                              "help_command": "?help bug",
                              "alias": "vuln",
                              "command_args": []
                             },
                        ask: {
                              "icon": ":pray:",
                              "command": "?ask",
                              "description": "Beg anyone from your mom, to your local pedophile on hopes of money.",
                              "help_command": "?help ask",
                              "alias": "beg",
                              "command_args": []
                             }
                      };

      if ( args.length > 0 ) {

        if ( args [ 0 ] !== 'help' || args [ 0 ] !== 'h' ) {

          var commandList = null;

          var commandObject = commands [ args [ 0 ] ];

          if ( commandObject.command_args.length === 0 ) {

            commandObject.command_args = [{"arg": "", "description": ""}];

          }

          var helpCommandEmbed = new Discord.MessageEmbed ()
          .setColor ( 'RANDOM' )
          .setAuthor ( 'Here ya go!')
          .addField ( '**' + commandObject.icon + ' ' + commandObject.command + '**', '\n**Description: ** *' + commandObject.description + '\n\nArguments: \n``' + commandObject.command_args[0].arg + ':`` ' + commandObject.command_args[0].description + '\n\nAliases: \n``' + commandObject.alias + '``', true)
          .setTimestamp ()
          .setFooter ( footer, profile );

          message.channel.send (helpCommandEmbed);

        } else {

          var helpCommandEmbed = new Discord.MessageEmbed ()
          .setColor ( 'RANDOM' )
          .setAuthor ( 'Boi you know what the help command does!' )
          .setTimestamp ()
          .setFooter ( footer, profile );

          message.channel.send ( helpCommandEmbed );

        }

      } else {

        var helpCommandEmbed = new Discord.MessageEmbed ()
        .setColor ( 'RANDOM' )
        .setAuthor ('Here ya go buddy!')
        .setTimestamp ()
        .setFooter ( footer, profile )

        for ( var x = 0; x < Object.keys(commands).length; x++ ) {

          commandObject = Object.values ( commands ) [ x ];

          helpCommandEmbed = helpCommandEmbed.addField ( '**' + commandObject.icon  + ' ' + commandObject.command + '**', '\n**Description: ** *' + commandObject.description + '*\n\nTo find out more about ' + commandObject.command + ',\n do ``' + commandObject.help_command + '``\n\n', true );

        }

        message.channel.send ( helpCommandEmbed );

      }

    }

  }

})

// Logs into the bot
client.login ( process.env.TOKEN );
