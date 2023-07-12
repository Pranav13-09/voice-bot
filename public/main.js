console.log("main.js loaded here");
const socket = io();

let recognition;
let silenceTimer;

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const transcript = document.getElementById("transcript");
const conversationContainer = document.getElementById("conversationContainer");
const confidenceThreshold = 0.7;

transcript.textContent =
  "Please click on Start Listening  button to  ask question to the ChatBot";

// Check if the browser supports the getUserMedia API
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Check microphone permission status
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      // Microphone permission granted, proceed with chatbot functionality
      // Add code to start the chatbot or enable the "Start Listening" button
      startButton.addEventListener("click", () => {
        recognition = new webkitSpeechRecognition(); // Builtin WebSpeechApi  to convert the voice into text
        startButton.disabled = true;
        transcript.textContent = "Listening...";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.start();
        console.log("before start");

        recognition.onstart = () => {
          console.log("i am started");
          //To automatically dtermine the stop time and sending the query to the backend
          silenceTimer = setTimeout(() => {
            transcript.textContent =
              " I was not able to hear anything.Please try again";

            recognition.stop();
            startButton.disabled = false;
            console.log("i am stopping");
          }, 6000); // Adjust the silence duration as needed (in milliseconds)
        };

        recognition.onresult = (event) => {
          const result = event.results[event.results.length - 1]; //converting the voice into text

          // const text = result[0].transcript;
          // transcript.innerHTML = text;

          // clearTimeout(silenceTimer);
          // silenceTimer = setTimeout(() => {
          //   recognition.stop();
          //   console.log("Before emitting the event");
          //   socket.emit("user-query", text); //emitting the event "user query which is listened on the backend , sending the  user query in foem of text to the backend server"
          //   console.log("event is emitted");
          //   loadingSpinner.style.display = "block"; //Loading the spinner while request is being processed
          // }, 2000); // Adjust the silence duration as needed (in milliseconds)
          const text = result[0].transcript.trim();
          if (result.isFinal) {
            const confidence = result[0].confidence;

            if (confidence >= confidenceThreshold) {
              transcript.innerHTML = text;

              clearTimeout(silenceTimer);
              silenceTimer = setTimeout(() => {
                recognition.stop();

                if (text === "") {
                  // Handle case when no voice input is recognized
                  transcript.textContent =
                    "Sorry, I couldn't recognize your voice input. Please try again.";
                } else {
                  // Emit the user query event to the server
                  socket.emit("user-query", text);
                  loadingSpinner.style.display = "block";
                }
              }, 2000); // Adjust the silence duration as needed (in milliseconds)
            } else {
              // Handle case when confidence level is below the threshold
              transcript.textContent =
                "I'm sorry, but I'm not confident in recognizing your voice input. Please try again.";
            }
          }
        };
      });

      // Adding the event listener to stop recording the user voice
      stopButton.addEventListener("click", () => {
        if (recognition) {
          clearTimeout(silenceTimer);
          recognition.stop();
          recognition = null;
          startButton.disabled = false;
          loadingSpinner.style.display = "none";
          transcript.textContent =
            "Please click on Start Listening  button to  ask question to the ChatBot";
        }
      });

      function createAudioPlayer(base64Data) {
        // Dynamically creating the  audio player and user query based on the base64 encoded audio data received from tjhe backend server
        const audioContainer = document.createElement("div");
        audioContainer.classList.add("queryItem");

        //Adding dynamic styles
        const transcriptText = transcript.textContent.trim();
        const transcriptElement = document.createElement("p");
        transcriptElement.textContent = transcriptText;

        //Creating audio player with help of audio tag in html
        const audioElement = document.createElement("audio");

        //Assigning the src as the base64 encoded data
        audioElement.src = "data:audio/mpeg;base64," + base64Data;
        audioElement.controls = true;
        audioElement.autoplay = true; // Autoplay

        audioContainer.appendChild(transcriptElement);
        audioContainer.appendChild(audioElement);
        conversationContainer.appendChild(audioContainer);
      }

      //Listening to the event emiited from the backend server
      socket.on("bot-response", (base64Data) => {
        // Create the audio player with the base64-encoded audio data, converting the base64 encoded audio data to the audio player(text to speech)
        createAudioPlayer(base64Data);
        loadingSpinner.style.display = "none";
        startButton.disabled = false;
        transcript.textContent =
          "Please click on Start Listening  button to  ask question to the ChatBot";
      });

      socket.on("ServerError", (msg) => {
        alert(msg);
        startButton.disabled = false;
        loadingSpinner.style.display = "none";
        transcript.textContent =
          "Please click on Start Listening  button to  ask question to the ChatBot";
      });
    })
    .catch(function (error) {
      // Microphone permission denied or not supported
      // Display an alert to the user
      transcript.innerHTML =
        "Please allow microphone access to proceed.Refresh the page after allowing microphone access";
      alert(
        "Microphone permission is required to use the chatbot. Please grant microphone permission to begin."
      );
    });
} else {
  // getUserMedia API not supported by the browser
  // Display an alert or fallback message to inform the user

  alert(
    "Your browser does not support the required features to use the chatbot. Please use a modern browser with microphone support."
  );
}

// Adding the event listener on button to start recording the  queries of user
