const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const amqp = require("amqplib");
const config = require("../config/rabbitMQ-config");
const Producer = require("./producer");
const producer = new Producer();
const app = express();

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  // if (type == 'CommentCreated') {
  //     const status = data.content.includes('orange') ? 'rejected' : 'approved'

  //     await axios.post('http://localhost:4005/events', {
  //         type: 'CommentModerated',
  //         data: {
  //             id: data.id,
  //             postId: data.postId,
  //             status,
  //             content: data.content
  //         }
  //     })

  // }

  res.send({});
});

async function consumeMessages() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();

  const exchangeName = config.rabbitMQ.exchangeName;
  await channel.assertExchange(exchangeName, "direct");

  const q = await channel.assertQueue("CommentQueue");

  await channel.bindQueue(q.queue, exchangeName, "CommentCreated");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log("moderation data", data);

    const { id, postId, content } = data.data;
    const status = content.includes("orange") ? "rejected" : "approved";
    publishData({
      id,
      postId,
      status,
      content,
    });

    channel.ack(msg);
  });
}

const publishData = async (data) => {
  await producer.publishMessage("CommentModerated", data);
};

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
  consumeMessages();
});
