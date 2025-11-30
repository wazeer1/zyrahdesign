import React from 'react'

function About() {
  return (
    <div className="font-sans" style={{ backgroundColor: "#F8F8F8", color: "#2D2D2D", scrollBehavior: "smooth" }}>

      {/* ===== ABOUT SECTION ===== */}
      <section
        className="py-20 px-6 lg:px-20 min-h-[80vh] flex flex-col items-center text-center"
        style={{ backgroundColor: "#F5F3ED" }}
      >
        <h2 className="text-4xl font-heading mb-10 tracking-widest uppercase" style={{ color: "#2E4A3B" }}>
          Our Story & Ethos
        </h2>
        <p className="max-w-3xl text-lg leading-relaxed text-gray-700">
          <strong>ZYRAH</strong> curates pieces that speak to the modern woman who values <strong>understated luxury and clean design</strong>. We specialize in silhouettes like the Pheran, Kaftan, and contemporary Co-ord Sets, blending traditional Indian craftsmanship with minimalist aesthetics. Our focus is on impeccable fabrics, elegant drapes, and a timeless color palette, ensuring every dress is a statement of simple, effortless grace. We prioritize quality over quantity and the versatility of design.
        </p>
        <p className="max-w-3xl text-lg leading-relaxed mt-4 italic text-gray-600 font-heading">
          &quot;Refined by Fabric. Defined by Simplicity.&quot;
        </p>
      </section>
    </div>
  )
}

export default About