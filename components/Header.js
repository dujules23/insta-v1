import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <div>
      {/* Left */}

      <div className="flex items-center justify-between max-w-6xl">
        <div className="cursor-pointer h-24 w-24 relative hidden lg:inline-grid">
          <Image
            src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016.png"
            className="object-contain"
            alt="header-logo"
            fill={true}
          />
        </div>
        <div className="cursor-pointer h-24 w-10 relative lg:hidden">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/1200px-Instagram-Icon.png"
            className="object-contain"
            alt="header-logo"
            fill={true}
          />
        </div>

        <h1>Right Side</h1>
      </div>

      {/* Middle */}

      {/* Right */}
    </div>
  );
}
