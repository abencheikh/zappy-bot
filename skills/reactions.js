/* 
* triggers for zaps in reactions
*/

var sendZap = require('../helpers/zaps.js');
const PROMPT_ID = 'prompt';
const DIALOG_ID = 'dialog';

module.exports = function(controller) { 
  controller.on('reaction_added', function(bot, message) {
    if (message.event.reaction == 'croissant' && message.event.user != message.event.item_user) {
      bot.api.channels.history({token: process.env.verificationToken, channel:message.event.item.channel, count:1, inclusive: true, latest: message.event.item.ts}, function(error, response) {
        bot.sendEphemeral({
          as_user: true,
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
    bot.replyInteractive(message, {text: ':croissant:'});
    if (message.callback_id == PROMPT_ID) {
      if (message.actions[0].name == 'yes') {
        var dialog = bot.createDialog(
          'Envoyer un remerciement',
          DIALOG_ID + '/' + message.actions[0].value,
          'Envoyer'
        ).addText('Message','text','', {placeholder: 'un message sympa !'});
        bot.replyWithDialog(message, dialog.asObject(), function(err, res) {
          console.log(err);
          console.log(res);
        });
      }
      else {
        sendZap(message.actions[0].value, message.user, controller, bot);  
        bot.say({channel: message.actions[0].value, text: `Hey ! Tu as reçu un :croissant: de la part de <@${message.user}> !`});
      }
    }                               
  });

  // handle a dialog submission
  // the values from the form are in event.submission    
  controller.on('dialog_submission', function(bot, message) {
    console.log(message);
    const [ callbackId, giftedUserID ] = message.callback_id.split('/');
    const { text } = message.submission;
    
    if (callbackId == DIALOG_ID && text != '') {
      bot.say({channel: message.channel, text: `<@${giftedUserID}> : ${text} :croissant: (de <@${message.user}>)`});
      sendZap(giftedUserID, message.user, controller, bot);
    }

    // call dialogOk or else Slack will think this is an error
    bot.dialogOk();
  });

  
}
