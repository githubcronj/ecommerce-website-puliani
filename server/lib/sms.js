'use strict';

import requestPromise from 'request-promise';
import Q from 'q';
import config from '../smsConfig.json';

export function sendSms(mobnos,message)
{
      var deffered = Q.defer();
      
         var options = {
                uri: 'http://123.63.33.43/blank/sms/user/urlsmstemp.php',
                qs: {
                    username: config.username,
                    pass: config.pass,
                    senderid: config.senderid,
                    message:  message,
                    dest_mobileno: mobnos,
                    response: config.response
                },
                headers: {
                    'User-Agent': 'Request-Promise'
                }
            };

            requestPromise(options)
            .then(function (response) {
               // console.log('sms api success response', response);
                deffered.resolve(response);
            })
            .catch(function (err) {
               // console.log('sms api error response', err);
                deffered.reject(err);
            });
 
      
      return deffered.promise;
  
}

