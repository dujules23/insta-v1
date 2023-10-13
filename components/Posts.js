import React from "react";
import Post from "./Post";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs);
    });
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.data().username}
          userImg={post.data().profileImage}
          img={post.data().image}
          caption={post.data().caption}
        />
      ))}
    </div>
  );
}
