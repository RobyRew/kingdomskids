export default function Header() {
  return (
    <header className="w-full py-4 md:py-5 lg:py-6 text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2.5">

          {/* Left: Logo */}
          <div className="flex-shrink-0">
            {/* Logo goes here */}
          </div>

          {/* Center: Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-grow justify-center">
            {/* Navigation Links */}
            <nav className="flex items-center gap-6">
              {/* Page 1 link */}
              {/* Page 2 link */}
            </nav>
          </div>

          <div>
            <input
              type="search"
              placeholder="Search"
              className="px-5 py-2.5
                         placeholder:text-black 
                         caret-orange 
                         text-black 
                         selection:bg-orange selection:text-white
                         bg-gray
                         rounded-lg
                         focus:outline-1 focus:outline-orange "
            />
          </div>

          <div className="flex items-center gap-2.5">
              <a
                href="https://www.paypal.com/donate?token=LGQXzy0rkm5Lv11xVwj8b71nxnbIZg5UgIo15muoPzl-fXQe-BBOgLUOy7a7QPCIAKNKNNx6-3mmp9do"
                target="_blank"
                rel="noopener noreferrer"
                className="select-none inline-block
                           px-5 py-2.5
                           font-medium text-white hover:text-orange active:text-orange
                           bg-black hover:bg-transparent active:bg-transparent
                           border border-black hover:border-orange active:border-orange rounded-lg
                           transition-colors duration-300"
              >
                Donate
              </a>

              <button className="select-none
                                 px-5 py-2.5
                                 font-medium text-black hover:text-white active:text-white
                                 bg-transparent hover:bg-orange active:bg-orange
                                 border border-black hover:border-transparent active:border-transparent rounded-lg
                                 transition-colors duration-300"
              >
                Volunteer
              </button>
          </div>

        </div>
      </div>
    </header>
  );
}
