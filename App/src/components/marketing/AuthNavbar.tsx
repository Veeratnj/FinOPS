const AuthNavbar = () => {
  return (
    <nav
      className="
        sticky top-0 z-50
        w-full
        border-b border-[#436900]
        bg-[#0B1208]/95
        backdrop-blur-xl
      "
    >

      <div
        className="
          max-w-[1400px]
          mx-auto
          px-6
          h-[82px]
          flex
          items-center
          justify-between
        "
      >

        {/* LEFT LOGO */}
        <a
          href="https://seynova.ai/"
          className="flex items-center"
        >

          <img
            src="/Kore Value Logo.png"
            alt="Seynova Logo"
            className="
              h-[52px]
              object-contain
              transition-all
              duration-300
              hover:scale-105
            "
          />

        </a>

        {/* CENTER NAVIGATION */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-10
            text-[#77B900]
            text-[16px]
            font-medium
          "
        >

          <a
            href="https://seynova.ai/"
            className="
              relative
              hover:text-[#9fdc00]
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-[#77B900]
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Home
          </a>

          <a
            href="https://seynova.ai/"
            className="
              relative
              hover:text-[#9fdc00]
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-[#77B900]
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Platform
          </a>

          <a
            href="https://seynova.ai/"
            className="
              relative
              hover:text-[#9fdc00]
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-[#77B900]
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Resources
          </a>

          <a
            href="https://seynova.ai/"
            className="
              relative
              hover:text-[#9fdc00]
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-[#77B900]
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Pricing
          </a>

          <a
            href="https://seynova.ai/"
            className="
              relative
              hover:text-[#9fdc00]
              transition-all
              duration-300
              after:absolute
              after:left-0
              after:-bottom-1
              after:h-[2px]
              after:w-0
              after:bg-[#77B900]
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Company
          </a>

        </div>

        {/* RIGHT BUTTON */}
        <a
          href="https://seynova.ai/"
          className="
            px-5 py-3
            rounded-[14px]
            bg-[#77B900]
            text-black
            font-semibold
            transition-all
            duration-300
            hover:bg-[#8ED000]
            hover:shadow-[0_0_25px_rgba(119,185,0,0.45)]
            hover:scale-[1.02]
          "
        >
          Get Started
        </a>

      </div>

    </nav>
  );
};

export default AuthNavbar;