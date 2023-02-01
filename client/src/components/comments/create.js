import axios from "axios";
import React, { useState } from "react";

const Create = ({ postId }) => {
    const [content, setContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content,
        });

        setContent("");
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                    <label>New Comment</label>
                    <input
                        value={content}
                        className="form-control"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default Create;
