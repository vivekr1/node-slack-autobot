const request = require('superagent');

function handleWitRespose(res) {
    console.log('handleWitResponse');
   return res.entities;
}

module.exports = function witClient(token) 
{
    const witAuthToken = ''; // TODO 
    const ask = function ask(message, callback) {
        
        request.get('https://api.wit.ai/message')
        .set('Authorization', 'Bearer ' + token)
        .query({v:witAuthToken})
        .query({q: message})
        .end((err, res)=>{
            console.log(res.body, res.statusCode);

            if(err) callback(err);
            if(res.statusCode != 200)
                return callback('expected status code 200 but got ', res.statusCode);


            console.log(' in resp : ' , res.statusCode);
            const witResponse = handleWitRespose(res.body);
            return callback(null, witResponse);
        });

    }
    return {
        ask: ask
    }
}
