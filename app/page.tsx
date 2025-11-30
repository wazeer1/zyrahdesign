"use client";

import React from "react";
import Link from "next/link";
import About from "./about/component/About";
import Collections from "./collections/component/Collections";
import Lookbook from "./lookbook/component/Lookbook";

export default function Home() {
  return (
    <div className="font-sans" style={{ backgroundColor: "#F8F8F8", color: "#2D2D2D", scrollBehavior: "smooth" }}>

      {/* ===== HOME SECTION (Hero) ===== */}
      <section
        id="home"
        className="flex flex-col justify-center items-center text-center p-6"
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/2d2d2d/b89c60?text=ZYRAH+%7C+Minimal+Elegance')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          minHeight: "700px",
        }}
      >
        <div className="p-8 md:p-14 rounded-xl bg-black/40 max-w-4xl mx-auto shadow-2xl backdrop-blur-sm">
          <h1 className="text-6xl md:text-8xl font-heading tracking-wider mb-4" style={{ color: "#F8F8F8" }}>
            Effortless Elegance.
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light" style={{ color: "#F8F8F8" }}>
            Simple sophistication in contemporary Indian silhouettes.
          </p>
          <Link
            href="/collections"
            className="cta-button inline-block text-base py-3 px-10 rounded-full font-bold uppercase tracking-wider border-2 transition-all duration-300"
            style={{
              backgroundColor: "#B89C60",
              color: "#2D2D2D",
              borderColor: "#B89C60",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2D2D2D";
              e.currentTarget.style.color = "#B89C60";
              e.currentTarget.style.borderColor = "#B89C60";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(184, 156, 96, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#B89C60";
              e.currentTarget.style.color = "#2D2D2D";
              e.currentTarget.style.borderColor = "#B89C60";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Explore The Edit
          </Link>
        </div>
      </section>
      <About />
      <Collections />
      <Lookbook />
    </div>
  );
}
