/* 
* List & manage leaderboard
*/

var constants = require('../helpers/constants.js');

module.exports = function(controller) { 
    console.log(constants);
    controller.hears(['leaderboard'], 'direct_message, direct_mention', function(bot, message) {
        controller.storage.users.all(function(err, userList) {
          var sortedList = userList.sort(function (a, b) {
              return b.zaps - a.zaps
          });
          
          var leaderboard = "";
          sortedList.map(function(user) {
            if (user.id) {
              leaderboard += "<@"+user.id+"> "+user.zaps+" :"+constants.ZAP_TAG+":\n";
            }
          });
          
          if (leaderboard != "")
            bot.reply(message, "Leaderboard:\n" + leaderboard);
          else
            bot.reply(message, "Pas encore de leaderboard, il est temps de distribuer quelques :"+constants.ZAP_TAG+": !");
        });
    }); 
  
    controller.hears(['reset'], 'direct_message, direct_mention', function(bot, message) {
      bot.api.users.info({user: message.user, token: process.env.verificationToken}, function(err, response) {
        if (response.user.is_admin || response.user.is_owner) {
          bot.reply(message, "Resetting leaderboard");
          controller.storage.users.all(function(err, userList) {
            userList.map(function(user) {
             controller.storage.users.delete(user.id); 
            });
          });
        }
        else {
          bot.reply(message, "Vous n'êtes pas autorisé à effectuer cette commande.");
        }
      });
    }); 
}