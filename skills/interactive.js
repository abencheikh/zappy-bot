var sendZap = require('../helpers/zaps.js');
const PROMPT_ID = 'prompt';
const DIALOG_ID = 'dialog';

module.exports = function(controller) { 
  
  controller.on('reaction_added', function(bot, message) {
    if (message.event.reaction == 'zap') {
      bot.api.channels.history({token: process.env.verificationToken, channel:message.event.item.channel, count:1, inclusive: true, latest: message.event.item.ts}, function(error, response) {
        bot.sendEphemeral({
          channel: message.event.item.channel,
          user: message.event.user,
          attachments:[
              {
                  title: 'Voulez-vous envoyer un message personnalisé ?',
                  callback_id: PROMPT_ID,
                  attachment_type: 'default',
                  actions: [
                      {
                          "name":"yes",
                          "text": "Oui",
                          "value": message.event.item_user,
                          "type": "button",
                      },
                      {
                          "name":"no",
                          "text": "Non",
                          "value": message.event.item_user,
                          "type": "button",
                      }
                  ]
              }
          ]
        });
      });
    }
  });

  controller.on('interactive_message_callback', function(bot, message) {
    console.log(message);
    if (message.callback_id == PROMPT_ID) {
      if (message.actions[0].name == 'yes') {
        var dialog = bot.createDialog(
            'Envoyer un remerciement',
            DIALOG_ID,
            'Envoyer'
          ).addText('Message','text','un message sympa');

        bot.replyWithDialog(message, dialog.asObject(), function(err, res) {
          console.log(err);
          console.log(res);
        });
      }
      else {
        sendZap(message.actions[0].value, message.user, controller, bot);   
        bot.say({channel: message.channel, text: `Hey <@${message.actions[0].value}> ! Tu as reçu un :zap: de la part de <@${message.user}> !`});
      }
    }                               
  });
  
}
