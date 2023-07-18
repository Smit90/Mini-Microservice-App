import React, { useState } from "react";
import axios from "axios";

const Create = () => {
    const [title, setTitle] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('http://localhost:4000/posts/create', {
            title
        })

        setTitle('')
    };

    return (
        <div>
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                    <label>Title</label>
                    <input
                        value={title}
                        className="form-control"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default Create;
