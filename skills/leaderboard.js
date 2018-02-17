/* 
* List & manage leaderboard
*/

module.exports = function(controller) { 
    controller.hears(['leaderboard'], 'direct_message, direct_mention', function(bot, message) {
        controller.storage.users.all(function(err, userList) {
          var sortedList = userList.sort(function (a, b) {
              return a.zaps < b.zaps
          });
          
          var leaderboard = "";
          sortedList.map(function(user) {
            leaderboard += "<@"+user.id+"> "+user.zaps+" :zap:\n";
          });
          if (leaderboard != "")
            bot.reply(message, "Leaderboard:\n" + leaderboard);
          else
            bot.reply(message, "No leaderboard yet, start giving some :zap: !");
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