import React from "react";
import Post from "./Post";

export default function Posts() {
  const posts = [
    {
      id: "1",
      username: "codewithpercy",
      userImg:
        "https://rstatic.stores.musicarts.com/locations/durrell-j-2-mac-columbia---sc-5f82b5ac-3cb4-474f-b148-0c8cfb143d72.jpg",
      img: "https://images.unsplash.com/photo-1687057217908-54f8e6d30e3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60",
      caption: "Nice picture!",
    },
    {
      id: "1",
      username: "percivalwright",
      userImg:
        "https://rstatic.stores.musicarts.com/locations/durrell-j-2-mac-columbia---sc-5f82b5ac-3cb4-474f-b148-0c8cfb143d72.jpg",
      img: "https://images.unsplash.com/photo-1610880846497-7257b23f6138?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      caption: "New whip.",
    },
  ];
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.userImg}
          img={post.img}
          caption={post.caption}
        />
      ))}
    </div>
  );
}
