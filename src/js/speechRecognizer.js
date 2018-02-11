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


function updateAvg(score) {
    console.log("score: ", score);
    document.getElementById('modal-body-score').innerHTML = "Your score is : " + score * 100 + "%";

    if (score >= 0 && score <=.33) {
        document.getElementById('modal-body-text').innerHTML = "Based on the content of your negotiation, " +
            "you are severely lacking positivity and confidence in your argument. You may be padding your " +
            "argument with unnecessary filler words. You should make an effort to prepare more appropriately " +
            "and rehearse what you want to say. Know your worth!";
    } else if (score >= .34 && score <=.50) {
        document.getElementById('modal-body-text').innerHTML = "Your negotiation has some positive points " +
            "but is leaning towards being insincere. Your argument requires more rehearsal and confidence. " +
            "Don't back down with your argument in fear of the outcome.";

    } else if (score >= 0.51 && score <= 0.7) {
        document.getElementById('modal-body-text').innerHTML = "You are stuck in a strange middle ground. " +
            "You appear as if you want to negotiate for a higher salary, but you also seem unsure of your decision " +
            "to do so. Keep practicing and do your best to present yourself as best as you can. " +
            "Do your research and practice!";
    } else if (score >= 0.71 && score <= 0.80) {
        document.getElementById('modal-body-text').innerHTML = "For the most part, you present yourself as " +
            "confident and worthy, but you also appear to be underestimating your worth and/or not adequately " +
            "rehearsing your argument. Try not to rush when you are presenting your argument!";
    } else if (score >= 0.81 && score <= 1) {
        document.getElementById('modal-body-text').innerHTML = " You present your argument well, " +
            "and it is apparent that you’ve done your research and rehearsed your argument. Maintain " +
            "your positivity and confidence throughout your negotiation, but don’t come off as arrogant.";

    }

}

iosocket.on('avg_received', updateAvg);


function OnComplete() {
    console.log('complete');
    //stopBtn.disabled = false;
}

