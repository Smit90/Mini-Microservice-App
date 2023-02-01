const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

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


app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const { type, data } = req.body

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
    res.send({})

})

const PORT = process.env.PORT || 4002

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
})