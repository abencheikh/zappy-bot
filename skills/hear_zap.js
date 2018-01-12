module.exports = function(controller) { 
    controller.hears([':zap:'], 'direct_message', function(bot, message) { 
        bot.reply(message, 'saw a :zap:'); 
    }); 
}