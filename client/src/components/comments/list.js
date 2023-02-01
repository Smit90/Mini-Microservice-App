import axios from 'axios';
import React, { useEffect, useState } from 'react'

const List = ({ postId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
        setComments(res.data);
    };

    const renderedComments = comments && comments.map((comment) => {
        return (
            <li key={comment.id} >{comment.content}</li>
        )
    })

    return (
        <div className='mb-2' >
            <h5>Comments</h5>
            {renderedComments}
        </div>
    );
}

export default List