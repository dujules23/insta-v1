import { modalState } from "../atom/modalAtom";
import { userState } from "../atom/userAtom";
import { useRecoilState } from "recoil";
import Modal from "react-modal";
import { CameraIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export default function UploadModal() {
  const [open, setOpen] = useRecoilState(modalState);
  const [currentUser] = useRecoilState(userState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);

  // study this function, deals with storing data and image into firestore database.
  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);
    // wait for document after submitting post
    const docRef = await addDoc(collection(db, "posts"), {
      caption: captionRef.current.value,
      username: currentUser?.username,
      profileImage: currentUser?.userImg,
      timestamp: serverTimestamp(),
    });
    // take image and store it in firebase storage with docRef id
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    // upload image into storage
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        // update the document
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );
    // reset modal, loading state, selectedFile
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  // method for adding Images to new post
  const addImageToPost = (event) => {
    // built in javascript function for reading files
    const reader = new FileReader();
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
    console.log;
  };

  return (
    <div>
      {open && (
        <Modal
          className="max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md"
          isOpen={open}
          onRequestClose={() => {
            setOpen(false);
            setSelectedFile(null);
          }}
        >
          <div className="flex flex-col justify-center items-center h-[100%]">
            {selectedFile ? (
              <img
                onClick={() => setSelectedFile(null)}
                src={selectedFile}
                alt=""
                className="w-full max-h-[250px] object-cover cursor-pointer"
              />
            ) : (
              <CameraIcon
                onClick={() => filePickerRef.current.click()}
                className="cursor-pointer h-14 bg-red-200 p-2 rounded-full border-2 text-red-500"
              />
            )}

            <input
              type="file"
              hidden
              ref={filePickerRef}
              onChange={addImageToPost}
            />
            <input
              type="text"
              maxLength="150"
              placeholder="Please enter your caption..."
              className="m-4 border-none text-center w-full focus:ring-0"
              ref={captionRef}
            />
            <button
              disabled={!selectedFile || loading}
              onClick={uploadPost}
              className="w-full bg-red-600 text-white p-2 shadow-md hover:brightness-125 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
            >
              Upload Post
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
