/* 
* List leaderboard
*/

module.exports = function(controller) { 
    controller.hears(['leaderboard'], 'direct_message, direct_mention', function(bot, message) {
        controller.storage.users.all(function(err, userList) {
          console.log(userList);
          var sortedList = userList.sort(function (a, b) {
              return a.zaps < b.zaps
          });
          
          bot.createConversation(message, function(err, convo) { 
            convo.say("Leaderboard:");
            sortedList.map(function(user) {
              convo.say("<@"+user.id+"> "+user.zaps+" :zap:");
            });
            convo.activate();
          });
          
        });
    }); 
}