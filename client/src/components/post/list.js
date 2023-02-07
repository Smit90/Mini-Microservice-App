import axios from "axios";
import React, { useEffect, useState } from "react";
import { CommentCreate, CommentList } from '../comments'

const List = () => {
    const [posts, setPosts] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const res = await axios.get("http://posts.com/posts");
        setPosts(res.data);
    };

    const renderedPosts = Object.values(posts).map((post) => {
        return (
            <div
                key={post.id}
                className="card"
                style={{ width: "30%", marginBottom: "220px" }}
            >
                <div className="card-body">
                    <h3>{post.title}</h3>
                    <CommentList comments={post.comments} />
                    <CommentCreate postId={post.id} />
                </div>
            </div>
        );
    })

    return (
        <div>
            <h1>Posts</h1>
            <div className="d-flex flex-row flex-wrap justify-content-between" >
                {renderedPosts}
            </div>
        </div>
    );
};

export default List;
