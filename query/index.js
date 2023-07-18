const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const amqp = require("amqplib");
const config = require('../config/rabbitMQ-config')
const app = express()

app.use(bodyParser.json())
app.use(cors())

const posts = {}
/* 
Post Structure
posts = {
    'asfasfa': {
        id: 'asfasfa',
        title: 'Test',
        comments: [
            {
                id:'fasfasfas',
                content:'Comment!',
                status:'approved | pending | rejected'
            }
        ]
    }
} 
*/


const handleEvent = (type, data) => {
    if (type == 'PostCreated') {
        const { id, title } = data

        posts[id] = { id, title, comments: [] }
    }
    if (type == 'CommentCreated') {
        const { id, content, postId, status } = data
        const post = posts[postId]
        post.comments.push({ id, content, status })
    }
    if (type == 'CommentUpdated') {
        const { id, content, postId, status } = data

        const post = posts[postId]
        const comment = post.comments.find(c => c.id == id)

        comment.status = status
        comment.content = content

    }
}

app.get('/posts', (req, res) => {
    console.log("post list", posts);
    res.send(posts)
})

app.post('/events', (req, res) => {
    const { type, data } = req.body

    handleEvent(type, data)

    res.send({})

})

async function consumeMessages() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const exchangeName = config.rabbitMQ.exchangeName;
    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("PostQueue");
    const q2 = await channel.assertQueue("CommentQueue")

    await channel.bindQueue(q.queue, exchangeName, "PostCreated");
    await channel.bindQueue(q2.queue, exchangeName, "CommentCreated");
    // await channel.bindQueue(q2.queue, exchangeName, "CommentUpdated");

    channel.consume(q.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log("Post Queue", data);
        const { logType, data: postData } = data
        handleEvent(logType, postData)
        channel.ack(msg);
    });
    channel.consume(q2.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log("Comment Queue", data);
        const { logType, data: commentData } = data
        handleEvent(logType, commentData)
        if (!logType == 'CommentCreated') {
            channel.ack(msg);
        }
    });
}

const PORT = process.env.PORT || 4002

app.listen(PORT, async () => {
    console.log("Server is running on port: ", PORT);
    consumeMessages()

    // const res = await axios.get('http://localhost:4005/events')
    // for (let event of res.data) {
    //     console.log("Processing event:", event.type);
    //     handleEvent(event.type, event.data)
    // }

})