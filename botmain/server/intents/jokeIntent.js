

const request = require('superagent');

module.exports.process = function process(intentData , registry, callback) {
    if(intentData.intent[0].value !== 'joke' )
        return callback(new Error( ` Expected chuck norris intent , got ${intentData.intent[0].value }`));
    
    const service = registry.get('chuck');
    

    if(!service){
        return(cb, 'no service available');
    } 

    const serviceUrl = `http://${service.ip}:${service.port}/service/`;

    console.log('in process........ before get', service,  serviceUrl);

    request.get(serviceUrl, (err, res)=>{
        if(err || res.statusCode !=200 || !res.body.result ){
            console.log(err);            
            return callback(false, ' I had a problem finding my sense of humor :-X ');
        }
        return callback(false, `${res.body.result}`)    ;
    });
};