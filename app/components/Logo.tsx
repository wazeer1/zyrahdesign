"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/Assets/logo/logo.svg";

function LogoComponent() {
  const [logoError, setLogoError] = useState(false);

  console.log("🔥 Logo Re-Rendered ten"); // test

  return (
    <Link href="/" className="flex items-center">
      {!logoError ? (
        <Image
          src={Logo}
          alt="ZYRAH Logo"
          width={120}
          height={40}
          className="h-10 w-auto object-contain"
          priority
          onError={() => setLogoError(true)}
        />
      ) : (
        <span
          className="text-3xl font-bold tracking-widest"
          style={{ color: "#2D2D2D" }}
        >
          ZYR<span style={{ color: "#B89C60" }}>A</span>H
        </span>
      )}
    </Link>
  );
}

export default React.memo(LogoComponent);
