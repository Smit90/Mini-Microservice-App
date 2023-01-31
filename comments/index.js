const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')

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

app.post('/posts/:id/comments', (req, res) => {
    const id = req.params.id
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body

    const comments = commentsByPostId[id] || []

    comments.push({ id: commentId, content })
    commentsByPostId[id] = comments
    res.status(201).send(comments)
})

const PORT = process.env.PORT || 4001

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
})