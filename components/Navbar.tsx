"use client"
import { NAV_LINKS } from "@/constants"
import Link from "next/link"
import { FaCalendarDays, FaTooth } from "react-icons/fa6"
import { IoMenu, IoClose } from "react-icons/io5";
import { useState } from "react"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-row justify-between text-lg items-center py-8 px-6">
        <Link href="/" className="font-bold text-3xl flex font-mulish"><FaTooth className="text-green-500"/>Happy</Link>
        <div className="hidden lg:flex flex-row gap-3">
            {NAV_LINKS.map((link) => (
                <Link href={link.href} key={link.key} className="pointer font-semibold rounded-3xl text-black hover:text-green-500 transition-all duration-500 py-2 px-3">
                    {link.label}
                </Link>
            ))}
        </div>  
        <button className="hidden lg:block py-2 px-5 bg-black text-gray-300 transition-all duration-500 rounded-3xl hover:bg-green-500 hover:text-white font-semibold">
            <a href="#" className="flex flex-row gap-2 items-center text-lg"><FaCalendarDays /> Book Online</a>
         </button>
         <div className="relative lg:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-green-500 focus:outline-none"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
        </button>
      </div>
         {/* Mobile Pop-Up Menu */}
      {menuOpen && (
        <div
          className="fixed top-0 right-0 w-full h-full bg-black bg-opacity-50 z-50"
          >
          <div
            className={`fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg flex flex-col justify-between p-6`}
          >
            <div>
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-yellow-500 self-end mb-6"
              >
                <IoClose size={30} />
              </button>
              <nav className="flex flex-col space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link href={link.href} key={link.key} className="pointer font-semibold rounded-3xl text-black hover:text-green-500 transition-all duration-500 py-2 px-3">
                      {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-8">
              <button className="py-2 px-5 bg-black text-gray-300 transition-all duration-500 rounded-3xl hover:bg-green-500 hover:text-white font-semibold">
                <a href="#" className="flex flex-row gap-2 items-center text-lg"><FaCalendarDays /> Book Online</a>
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
    
  )
}

export default Navbar