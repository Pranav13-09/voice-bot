# voice-bot

This project involves 

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
Frontend dispays the data fetched from the backend in the tabular format  

On the home page, there are 5 options provided for performing 5 different tasks. When a user clicks on any one of the options, an axios request is sent to the backend to fetch the required data. The user is then redirected to a new page where the fetched data is displayed in tabular format.

The backend server is deployed and available at https://mobiserver.vercel.app. To fetch data from the server, we make a dynamic API request to the URL https://mobiserver.vercel.app/api/${id}, where the 'id' parameter is dynamic and changes automatically based on the data that we want to fetch.

For frontend  https://mobiserver.vercel.app  is the host server.


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
