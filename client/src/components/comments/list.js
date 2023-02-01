import axios from 'axios';
import React, { useEffect, useState } from 'react'

const List = ({ comments }) => {

    const renderedComments = comments && comments.map((comment) => {
        const { content, id, status } = comment
        let newContent

        if (status == 'approved') { newContent = content }
        if (status == 'pending') { newContent = 'This comment is awaiting moderation' }
        if (status == 'rejected') { newContent = 'This comment has been rejected' }

        return (
            <li key={id} >{newContent}</li>
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