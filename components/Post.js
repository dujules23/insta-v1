import React, { useState, useEffect } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import {
  doc,
  deleteDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import Moment from "react-moment";

import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";

export default function Post({ img, userImg, caption, username, id }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [currentUser] = useRecoilState(userState);

  // sends comments to the data base
  const sentComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: currentUser?.username,
      userImage: currentUser?.userImg,
      timestamp: serverTimestamp(),
    });
  };

  const likePost = async (e) => {
    if (hasLiked) {
      // deletes like if a like is already present
      await deleteDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
        username: currentUser?.username,
      });
    } else {
      // setDoc modifies instead of adding something new like adDoc
      await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
        username: currentUser?.username,
      });
    }
  };
  // retrieves comments from the database
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db, id]);
  // grabs the likes from from the database
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes]);

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

      {currentUser && (
        <>
          {/* Post Buttons */}
          <div className="flex justify-between px-4 pt-4">
            <div className="flex space-x-4">
              {hasLiked ? (
                <HeartIconFilled
                  onClick={likePost}
                  className="text-red-400 btn"
                />
              ) : (
                <HeartIcon onClick={likePost} className="btn" />
              )}
              <ChatBubbleOvalLeftIcon className="btn" />
            </div>
            <BookmarkIcon className="btn" />
          </div>
        </>
      )}

      {/* Post Comments */}
      <p className="p-5 truncate">
        {likes.length > 0 && (
          <p className="font-bold mb-1">{likes.length} like(s)</p>
        )}
        <span className="font-bold mr-2">{username}</span>
        {caption}
      </p>

      {comments.length > 0 && (
        <div className="mx-10 max-h-24 overflow-y-scroll scrollbar-none">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-2">
              <img
                className="h-7 rounded-full object-cover"
                src={comment.data().userImage}
                alt="user-image"
              />
              <p className="font-semibold">{comment.data().username}</p>
              <p className="flex-1 truncate">{comment.data().comment}</p>
              <Moment fromNow>{comment.data().timestamp?.toDate()}</Moment>
            </div>
          ))}
        </div>
      )}

      {/* Post Input Box */}
      {currentUser && (
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
