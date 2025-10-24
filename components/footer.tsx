export function Footer() {
  return (
    <footer className="bg-[#1B1B1A] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Ahjoor" className="h-24 w-auto" />
        </div>

        {/* Navigation Links */}
        <nav className="flex justify-center gap-12 mb-12">
          <a href="#" className="text-white hover:text-gray-300 transition-colors text-lg">
            Documentations
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors text-lg">
            Resources
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors text-lg">
            Securities
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors text-lg">
            Socials
          </a>
        </nav>

        {/* Email Subscription Form */}
        <div className="flex justify-center">
          <form className="flex gap-0 max-w-md w-full">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 px-6 py-3 bg-[#808080] text-white placeholder:text-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#141B34]"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#141B34] text-white rounded-r-lg hover:bg-[#141B34] transition-colors font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
