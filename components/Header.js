import React, { useEffect } from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { modalState } from "../atom/modalAtom";
import { userState } from "../atom/userAtom";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const auth = getAuth();

  const onSignOut = () => {
    signOut(auth);
    setCurrentUser(null);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(
            db,
            "users",
            user.auth.currentUser.providerData[0].uid
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
            console.log(currentUser);
          }
        };
        fetchUser();
      }
    });
  }, []);

  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30">
      <div className="flex items-center justify-between max-w-6xl mx-4 xl:mx-auto">
        {/* Left */}
        <div className="cursor-pointer h-24 w-24 relative hidden lg:inline-grid">
          <Image
            src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016.png"
            className="object-contain"
            alt="header-logo"
            fill={true}
            onClick={() => router.push("/")}
          />
        </div>
        <div className="cursor-pointer h-24 w-10 relative lg:hidden">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/1200px-Instagram-Icon.png"
            className="object-contain"
            alt="header-logo"
            fill={true}
            onClick={() => router.push("/")}
          />
        </div>

        {/* Middle */}

        <div className="relative mt-1">
          <div className="absolute top-2 left-2">
            <MagnifyingGlassIcon className="h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-50 pl-10 border-gray-500 text-sm focus:ring-black focus:border-black rounded-md"
          />
        </div>

        {/* Right */}

        <div className="flex space-x-4 items-center">
          <HomeIcon
            onClick={() => router.push("/")}
            className="hidden md:inline-flex cursor-pointer h-6 hover:scale-125 transition-transform duration-200 ease-out"
          />
          {currentUser ? (
            <>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="cursor-pointer h-6 hover:scale-125 transition-transform duration-200 ease-out"
              />
              <img
                onClick={onSignOut}
                src={currentUser?.userImg}
                alt="user-image"
                className="h-10 rounded-full"
              />
            </>
          ) : (
            <button onClick={() => router.push("/auth/signin")}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
}
