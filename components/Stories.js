import minifaker from "minifaker";
import "minifaker/locales/en";
import Story from "./Story";
import { useRecoilState } from "recoil";

import { userState } from "../atom/userAtom";

import { useState, useEffect } from "react";

export default function Stories() {
  const [currentUser] = useRecoilState(userState);
  const [storyUsers, setStoryUsers] = useState([]);

  useEffect(() => {
    const storyUsers = minifaker.array(20, (i) => ({
      username: minifaker.username({ locale: "en" }).toLowerCase(),
      img: `https://i.pravatar.cc/150?img=${Math.ceil(Math.random() * 70)}`,
      id: i,
    }));
    setStoryUsers(storyUsers);
    console.log(storyUsers);
  }, []);

  return (
    <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border-1 overflow-x-scroll rounded-sm scrollbar-none">
      {currentUser && (
        <Story
          img={currentUser?.userImg}
          username={currentUser?.username}
          isUser="true"
        />
      )}
      {storyUsers.map((user) => (
        <Story key={user.id} username={user.username} img={user.img} />
      ))}
    </div>
  );
}
