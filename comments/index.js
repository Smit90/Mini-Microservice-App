const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

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

    comments.push({ id: commentId, content })
    commentsByPostId[id] = comments

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: id
        }
    })

    res.status(201).send(comments)
})


app.post('/events', (req, res) => {
    console.log('eventssss received', req.body.type);
    res.send({})
})


const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
})