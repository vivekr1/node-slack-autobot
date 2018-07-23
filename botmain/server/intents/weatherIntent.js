

const request = require('superagent');

module.exports.process = function process(intentData , registry, callback) {
    if(intentData.intent[0].value !== 'weather' )
        return callback(new Error( ` Expected time intent , got ${intentData.intent[0].value }`));
    if(!intentData.location)
        return callback(new Error( ` PLease specify the location in time request  `));
    
    const location = intentData.location[0].value;

    const service = registry.get('weather');
    

    if(!service){
        return(cb, 'no service available');
    } 

    const serviceUrl = `http://${service.ip}:${service.port}/service/${location}`;

    console.log('in process........ before get', service , location, serviceUrl);

    request.get(serviceUrl, (err, res)=>{
        if(err || res.statusCode !=200 || !res.body.result ){
            console.log(err);            
            return callback(false, ' I had a problem finding out the weather in ' + location);
        }
        return callback(false, ` In ${location} , it is now ${res.body.result}`)    ;
    });
};