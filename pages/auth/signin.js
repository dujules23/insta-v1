import Header from "../../components/Header";
import Image from "next/image";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.providerData[0];
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          userImg: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
          username: user.displayName.split(" ").join("").toLocaleLowerCase(),
        });
      }
      router.push("/");
    } catch (error) {}
  };

  return (
    <>
      <Header />
      <div className="flex justify-center space-x-7 mt-20">
        <Image
          width={300}
          height={300}
          className="hidden object-cover rotate-6 md:inline-flex md:w-70"
          src="https://superviral.com.au/wp-content/uploads/2020/11/Copy-of-Untitled.png"
          alt="instagram-image"
        />
        <div className="">
          <div className="flex flex-col items-center">
            <Image
              width={500}
              height={500}
              className="w-32 object-cover"
              src="https://socodigital.com/wp-content/uploads/2021/03/Instagram-300x300.png"
              alt="instagram-logo"
            />
            <p className="text-sm italic my-10 text-center">
              This app was created for learning purposes
            </p>
            <button
              onClick={onGoogleClick}
              className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
