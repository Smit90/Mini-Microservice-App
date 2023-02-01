import axios from 'axios';
import React, { useEffect, useState } from 'react'

const List = ({ comments }) => {

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