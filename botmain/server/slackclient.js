
const RTMClient = require('@slack/client').RTMClient;
let nlp = null;
let botName = null;
let botId = null;
let registry = null;
// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_TOKEN ;



function addAuthenticatedHandler(rtm) {
  rtm.on('authenticated', (connectionData) => {
    console.log('RTMClient authenticated', connectionData);

    botId = connectionData.self.id;
    botName = connectionData.self.name;
  });
}


function handleMessage(rtm) {
  rtm.on('message', (event) => {
    console.log(`Incoming message: ${JSON.stringify(event)}`);
    console.log(' the message is <drum roll>', event.text );

    var isBotRequest = event.text.includes(botId.toString()) || event.text.includes(botName);

    let channel = event.channel;
    if (isBotRequest) {
      nlp.ask(event.text, (err, res) => {
        if (err) {
          console.log(err);
          sendMessage(rtm, 'sorry I do not understand ', event.channel);
          return;
        }
        try {
          if (!res.intent || !res.intent[0] || !res.intent[0].value) {
            throw new Error("Could not extract intent");
          }
          const intent = require('./intents/' + res.intent[0].value + 'Intent');
          intent.process(res, registry,  (err, response) => {
            if (err) {
              console.log(err); 
              return sendMessage(rtm, err.message , channel);
            }
            console.log(response);
            return sendMessage(rtm, response, channel);
          });
        } catch (error) {
            console.log(error);
            console.log(response);
            sendMessage(rtm, 'Sorry I do not know what you are talking about ', channel);
        }
      });
    }
    // sendMessage(rtm, message , event.channel)
  });
}



function sendMessage(rtm, message, channel) {
  const conversationId = channel;

  // The RTM client can send simple string messages
  rtm.sendMessage(message, conversationId)
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
    })
    .catch(console.error);
}

module.exports.init = function slackClient(token, loglevel, nlpClient, serviceRegistry) {
  const rtm = new RTMClient(token, {
    loglevel: loglevel
  });
  nlp = nlpClient;
  registry = serviceRegistry;
  return rtm;
};


module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
module.exports.handleMessage = handleMessage;
// // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
// const conversationId = 'CBTSQ9L5V';

// // The RTM client can send simple string messages
// rtm.sendMessage('#general Hello again there', conversationId)
//   .then((res) => {
//     // `res` contains information about the posted message
//     console.log('Message sent: ', res.ts);
//   })
//   .catch(console.error);