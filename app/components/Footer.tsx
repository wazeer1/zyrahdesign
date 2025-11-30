export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gray-900 text-white py-12 px-6 lg:px-20 text-center"
    >
      <h3
        className="text-3xl mb-4 tracking-widest"
        style={{ color: "#B89C60" }}
      >
        Connect with ZYRAH
      </h3>

      <div className="text-sm mb-6 space-y-2">
        {/* Email Contact */}
        <p className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-3"
            style={{ color: "#B89C60" }}
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Email:{" "}
          <a
            href="mailto:Zyrahdesigns@gmail.com"
            className="ml-1 hover:underline transition duration-300"
            style={{ color: "#F8F8F8" }}
          >
            Zyrahdesigns@gmail.com
          </a>
        </p>

        {/* Phone Contact */}
        <p className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mr-3"
            style={{ color: "#B89C60" }}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Phone:{" "}
          <a
            href="tel:+971547081910"
            className="ml-1 hover:underline transition duration-300"
            style={{ color: "#F8F8F8" }}
          >
            +971547081910
          </a>
        </p>

        {/* Location Link */}
        {/* <p className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3" style={{ color: "#B89C60" }}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <a href="#" className="hover:underline transition duration-300" style={{ color: "#F8F8F8" }}>Boutique Location</a>
        </p> */}
      </div>

      <div className="flex items-center justify-center text-sm uppercase font-medium mb-8 space-x-6">
        <a
          href="https://www.instagram.com/zyrahdesigns?igsh=MTM3ODNhajFycTVueQ=="
          className="flex items-center gap-2 hover:text-gray-400 transition duration-300"
          style={{ color: "#B89C60" }}
          target="_blank"
          rel="noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="#B89C60"
          >
            <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 2a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
          Instagram
        </a>
        <a
          href="https://www.facebook.com/profile.php?viewas=100000686899395&id=61584462475491"
          className="flex items-center gap-2 hover:text-gray-400 transition duration-300"
          style={{ color: "#B89C60" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="#B89C60"
          >
            <path d="M22.676 0H1.326C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.326 24H12.82v-9.294H9.692V11.08h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.765v2.317h3.59l-.467 3.626h-3.123V24h6.128C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.676 0z" />
          </svg>
          Facebook
        </a>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} ZYRAH. All Rights Reserved. Crafted
        with attention to detail.
      </p>
    </footer>
  );
}
