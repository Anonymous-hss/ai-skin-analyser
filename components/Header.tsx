import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SA</span>
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-primary-800">AI Skin Analyzer</h1>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-secondary-700 hover:text-primary-500 transition-colors">
            Home
          </Link>
          <Link href="#how-it-works" className="text-secondary-700 hover:text-primary-500 transition-colors">
            How It Works
          </Link>
          <Link href="#skin-conditions" className="text-secondary-700 hover:text-primary-500 transition-colors">
            Skin Conditions
          </Link>
        </nav>

        <div className="md:hidden">
          <button className="text-secondary-700 hover:text-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

