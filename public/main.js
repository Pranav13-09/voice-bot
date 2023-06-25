const socket = io();

let recognition;
let silenceTimer;

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const transcript = document.getElementById("transcript");
const conversationContainer = document.getElementById("conversationContainer");

transcript.textContent =
  "Please click on Start Listening  button to  ask question to the ChatBot";

// Adding the event listener on button to start recording the  queries of user
startButton.addEventListener("click", () => {
  recognition = new webkitSpeechRecognition(); // Builtin WebSpeechApi  to convert the voice into text
  startButton.disabled = true;
  transcript.textContent = "Listening...";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.start();

  recognition.onstart = () => {
    //To automatically dtermine the stop time and sending the query to the backend
    silenceTimer = setTimeout(() => {
      recognition.stop();
    }, 2000); // Adjust the silence duration as needed (in milliseconds)
  };

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1]; //converting the voice into text
    const text = result[0].transcript;
    transcript.innerHTML = text;

    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      recognition.stop();
      socket.emit("user-query", text); //emitting the event "user query which is listened on the backend , sending the  user query in foem of text to the backend server"
      console.log("event is emitted");
      loadingSpinner.style.display = "block"; //Loading the spinner while request is being processed
    }, 2000); // Adjust the silence duration as needed (in milliseconds)
  };
});

// Adding the event listener to stop recording the user voice
stopButton.addEventListener("click", () => {
  if (recognition) {
    clearTimeout(silenceTimer);
    recognition.stop();
    recognition = null;
    startButton.disabled = false;
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
  console.log(audioElement, "ia m audio Element");

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
