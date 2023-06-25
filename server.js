const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const concat = require("concat-stream");
const OpenAI = require("openai-api");
const gtts = require("node-gtts")("en");

require("dotenv").config();

//Load the API key for OPENAI from .env file
const openai = new OpenAI(process.env.OPEN_API_KEY);

app.use(express.static("public"));

//Use socket.io to listen for events and emit the events
io.on("connection", (socket) => {
  //Listening to "user query " event emitted by the client browser when user request the voice query
  //Here we receive the  voice query of user in form of the text
  socket.on("user-query", async (query) => {
    console.log("i am in socket.io");
    console.log("Received query:", query);

    try {
      //Use of openAI to process the  user input , here we pass the prompt as text recived from th client
      const gptResponse = await openai.complete({
        engine: "text-davinci-003",
        prompt: query,
        maxTokens: 50,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
      });
      console.log(gptResponse.data, "i am gpt response");

      //From response received from the chatGpt we extract the  needed  response
      const generatedText = gptResponse.data.choices[0].text.trim();
      console.log(generatedText, "i am here bro ");

      //Use og node-gtts library to  convert the response received from the chatgpt to audio stream
      const audioStream = gtts.stream(generatedText);

      //Convert the audio Stream to the  64base encoded string which is used to crate the audio player at the frontend
      audioStream.pipe(
        concat((buffer) => {
          const base64Data = buffer.toString("base64");
          socket.emit("bot-response", base64Data); // emitting the event which is listened on frontend to craete the audio player for corresponding user query
        })
      );
    } catch (err) {
      console.log(err, "i am the compelte err");
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//Send the index.html file to the client browser
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
