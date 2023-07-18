const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')
const amqp = require('amqplib')
const Producer = require('./producer')
const producer = new Producer()
const config = require('../config/rabbitMQ-config')
const app = express()

const commentsByPostId = {}

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ message: "This is comments service" })
})

app.get('/posts/:id/comments', (req, res) => {
    const id = req.params.id
    res.send(commentsByPostId[id])
})

app.post('/posts/:id/comments', async (req, res) => {
    const id = req.params.id
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body

    const comments = commentsByPostId[id] || []

    comments.push({ id: commentId, content, status: 'pending' })
    commentsByPostId[id] = comments
    await producer.publishMessage('CommentCreated', {
        id: commentId,
        content,
        postId: id,
        status: 'pending'
    });
    res.status(201).send(comments)
})


async function consumeMessages() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();


    const exchangeName = config.rabbitMQ.exchangeName;
    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("CommentQueue")

    await channel.bindQueue(q.queue, exchangeName, "CommentModerated");

    channel.consume(q.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log("Comment Queue", data);
        const { logType, data: commentData } = data
        const { postId, id, status } = commentData

        const comments = commentsByPostId[postId]

        const commData = comments.find(c => c.id == id)
        commData.status = status
        publishData(commentData)
        channel.ack(msg);
    });

}


const publishData = async (data) => {
    await producer.publishMessage("CommentUpdated", data)
}



const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
    consumeMessages()
})