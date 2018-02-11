//import io from 'socket-io-client';

const iosocket = io();//io.connect();

const subscriptionKey = '2823454f4bf3464d891d5b4cf285445f';

// On document load resolve the SDK dependency
function Initialize(onComplete) {
    if (!!window.SDK) {
        document.getElementById('content').style.display = 'block';
        document.getElementById('warning').style.display = 'none';
        onComplete(window.SDK);
    }
}

// Setup the recognizer
function RecognizerSetup(SDK) {

    let recognitionMode = SDK.RecognitionMode.Interactive;

    var recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode,
        'en-us', // Supported languages are specific to each recognition mode. Refer to docs.
        SDK.SpeechResultFormat.Simple); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)


    var useTokenAuth = false;

    var authentication = function () {
        if (!useTokenAuth)
            return new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

        var callback = function () {
            var tokenDeferral = new SDK.Deferred();
            try {
                var xhr = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                xhr.open('GET', '/token', 1);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        tokenDeferral.Resolve(xhr.responseText);
                    } else {
                        tokenDeferral.Reject('Issue token request failed.');
                    }
                };
                xhr.send();
            } catch (e) {
                window.console && console.log(e);
                tokenDeferral.Reject(e.message);
            }
            return tokenDeferral.Promise();
        }

        return new SDK.CognitiveTokenAuthentication(callback, callback);
    }();

    return SDK.CreateRecognizer(recognizerConfig, authentication);


}

// Start the recognition
function RecognizerStart(SDK, recognizer) {
    recognizer.Recognize((event) => {
        /*
         Alternative syntax for typescript devs.
         if (event instanceof SDK.RecognitionTriggeredEvent)
        */
        switch (event.Name) {
            case "RecognitionTriggeredEvent" :
                console.log("Initializing");
                break;
            case "ListeningStartedEvent" :
                console.log("Listening");
                break;
            case "RecognitionStartedEvent" :
                console.log("Listening_Recognizing");
                break;
            case "SpeechStartDetectedEvent" :
                console.log("Listening_DetectedSpeech_Recognizing");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechHypothesisEvent" :
                //UpdateRecognizedHypothesis(event.Result.Text, false);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechFragmentEvent" :
                //UpdateRecognizedHypothesis(event.Result.Text, true);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechEndDetectedEvent" :
                OnSpeechEndDetected();
                console.log("Processing_Adding_Final_Touches");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechSimplePhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "SpeechDetailedPhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "RecognitionEndedEvent" :
                OnComplete();
                console.log("Idle");
                console.log(JSON.stringify(event)); // Debug information
                break;
            default:
                console.log(JSON.stringify(event)); // Debug information
        }
    })
        .On(() => {
                // The request succeeded. Nothing to do here.
            },
            (error) => {
                console.error(error);
            });
}

// Stop the Recognition.
function RecognizerStop(SDK, recognizer) {
    //recognizer.AudioSource.Detach(audioNodeId) //can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
}

var mic, stopBtn, phraseDiv;

const KEY = '2823454f4bf3464d891d5b4cf285445f';

var SDK;
var recognizer;

document.addEventListener("DOMContentLoaded", function () {
    mic = document.getElementById('mic');

    // phraseDiv = document.getElementById("phraseDiv");

    mic.addEventListener('click', function () {
        if (KEY === null) {
            alert('subscription key needed!');
        } else {
            if (!recognizer) {
                Setup();
            }

            // phraseDiv.innerHTML = "";
            RecognizerStart(SDK, recognizer);
            //stopBtn.disabled = false;

        }

    });

    // stopBtn.addEventListener("click", function () {
    //     RecognizerStop(SDK, recognizer);
    //     stopBtn.disabled = true;
    // });

    Initialize(function (speechSdk) {
        SDK = speechSdk;

    });


});

function Setup() {
    if (recognizer != null) {
        RecognizerStop(SDK, recognizer);
    }
    recognizer = RecognizerSetup(SDK);
    console.log(recognizer)
}


function OnSpeechEndDetected() {
    //stopBtn.disabled = true;
    console.log('end detected')
}

function UpdateRecognizedPhrase(json) {
    //phraseDiv.innerHTML += json + "\n";

    iosocket.emit('data_received', json);

}


function OnComplete() {
    console.log('complete');
    //stopBtn.disabled = false;
}

var stopBtn = document.getElementById('stopBtn');
stopBtn.addEventListener('click', function() {

});