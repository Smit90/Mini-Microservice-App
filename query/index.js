const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

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
    res.send(posts)
})

app.post('/events', (req, res) => {
    const { type, data } = req.body

    handleEvent(type, data)

    res.send({})

})

const PORT = process.env.PORT || 4002

app.listen(PORT, async () => {
    console.log("Server is running on port: ", PORT);

    const res = await axios.get('http://localhost:4005/events')
    for (let event of res.data) {
        console.log("Processing event:", event.type);
        handleEvent(event.type, event.data)
    }

})