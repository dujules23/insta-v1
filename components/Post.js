import React, { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";

export default function Post({ img, userImg, caption, username, id }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");

  const sentComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="bg-white my-7 border rounded-md">
      {/* Post Header */}

      <div className="flex items-center p-5">
        <img
          className="h-12 rounded-full object-cover border p-1 mr-3"
          src={userImg}
          alt={username}
        />
        <p className="font-bold flex-1">{username}</p>
        <EllipsisHorizontalIcon className="h-5" />
      </div>

      {/* Post Image */}

      <img className="object-cover w-full" src={img} alt="" />

      {session && (
        <>
          {/* Post Buttons */}
          <div className="flex justify-between px-4 pt-4">
            <div className="flex space-x-4">
              <HeartIcon className="btn" />
              <ChatBubbleOvalLeftIcon className="btn" />
            </div>
            <BookmarkIcon className="btn" />
          </div>
        </>
      )}

      {/* Post Comments */}
      <p className="p-5 truncate">
        <span className="font-bold mr-2">{username}</span>
        {caption}
      </p>

      {/* Post Input Box */}
      {session && (
        <form className="flex items-center p-4">
          <FaceSmileIcon className="h-7" />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border-none flex-1 focus:ring-0"
            type="text"
            placeholder="Enter your comment."
          />
          <button
            onClick={sentComment}
            disabled={!comment.trim()}
            className="text-blue-400 fort-bold disabled:text-blue-200"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
