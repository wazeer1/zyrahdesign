import React from 'react'

function Contact() {
  return (
    <div className="font-sans" style={{ backgroundColor: "#F8F8F8", color: "#2D2D2D", scrollBehavior: "smooth" }}>

    {/* ===== CONTACT SECTION ===== */}
    <section className="py-20 px-6 lg:px-20 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-normal mb-10 tracking-widest uppercase" style={{ color: "#2D2D2D" }}>
        Visit Our Boutique
      </h2>
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl mb-6" style={{ color: "#2E4A3B" }}>Get in Touch</h3>
          <div className="space-y-4 text-left">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3" style={{ color: "#B89C60" }}>
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <a href="mailto:Zyrahdesigns@gmail.com" className="hover:underline" style={{ color: "#2D2D2D" }}>Zyrahdesigns@gmail.com</a>
            </p>
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3" style={{ color: "#B89C60" }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+971547081910" className="hover:underline" style={{ color: "#2D2D2D" }}>+971547081910</a>
            </p>
            {/* <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3" style={{ color: "#B89C60" }}>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ color: "#2D2D2D" }}>Boutique Location</span>
            </p> */}
          </div>
        </div>
      </div>
    </section>
  </div>
  )
}

export default Contact