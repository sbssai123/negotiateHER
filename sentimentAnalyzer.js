'use strict';

let https = require ('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
let accessKey = '360e9871fe85443bb1e86305054564b8';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
let uri = 'eastus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/sentiment';
var scores = [];



let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        let body__ = JSON.stringify (body_, null, '  ');
        console.log (body__);

        ////

        for (var i = 0; i < body_.documents.length; i++) {
            var counter = body_.documents[i];
            console.log(counter.score);
            if (i === body_.documents.length-1) {
                scores.push(counter.score);
            }

        }
        let sum = scores.reduce((previous, current) => current += previous);
        var avg = sum / scores.length;
        console.log('Average: '+ avg);

        module.exports.avg = avg;


    });

    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });


};

let get_sentiments = function (documents) {
    let body = JSON.stringify (documents);

    let request_params = {
        method : 'POST',
        hostname : uri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : accessKey,
        }
    };

    let req = https.request (request_params, response_handler);

    req.write (body);
    req.end ();
    return req;


}

module.exports.get_sentiments = get_sentiments;
