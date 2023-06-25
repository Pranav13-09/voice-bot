# voice-bot

This project involves  use of the OpenAI API to process the user's queries in  form of audio and send them back audio response to their query.


TechStack used  

Backend : NodeJS,Express,socket.io
Frontend : HTML,CSS,Javascript



# Backend  

We are using Express to configure the server and socket.io for bidirectional communication between  backend server and  client browser.
In the backend we received the auery as form as text we use openai api to process the query , then convert the query into audio stream using node gtts and further 
convert it into 64based encoded audio output and send it to the frontend  by emitting the event




## Backend Hosting
Backend is hosted on the vercel.

## Frontend
Frontend conatins the Plain UI to provide the voice oice input mechanism for user queries, the response recived from the backend is also displayed in form of audio player on the frontend 

You can access the frontend at  http://localhost:3000 Locally




## Installation

Clone the project

bash
  git clone https://github.com/Pranav13-09/mobilicispr


Go to the project directory

bash
  cd voice-bot


Install dependencie
bash
  npm i
 

## Run Locally

Start the backend server
bash
  nodemon server


The backend will be available at http://localhost:3000 Locally
