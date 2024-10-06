"use client";
import React, { useState } from "react";
import Link from "next/link";
import SearchInput from "./SearchInput";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  const planets = [
    "mercury",
    "venus",
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ];

  return (
    <nav className="bg-transparent text-white border-gray-200 absolute z-10 w-full">
      <div className="max-w-screen-xl flex items-center justify-between  mx-auto p-4">
        <a href="/" className="flex items-center">
          <span className="self-center text-2xl font-mono font-semibold whitespace-nowrap">
            AstroOrrery
          </span>
        </a>
        <div className="flex items-center md:order-2 gap-8">
          <SearchInput />
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:text-white  focus:outline-none relative z-10"
          >
            <span className="sr-only">Toggle Menu</span>
            {isMenuOpen ? (
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l15 15M1 16L16 1"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7h11M3 1h11M3 13h11"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu with transition */}
      <div
        className={`fixed top-0 left-0 w-full h-[60vh] bg-black bg-opacity-80  transition-transform duration-300 transform  ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <ul
          className={`flex flex-col items-start px-16 py-8 h-full transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        > 
          <p className="font-sans text-xl  font-semibold mb-1">Planets in our Solora System</p>
          <div className="w-[200px] h-[1px]  bg-slate-50 mb-2"></div>
          {planets.map((planet) => {
            return (
              <li key={planet} className="hover:text-blue-500 mb-2">
                <Link href={`/planets/${planet}`} onClick={toggleMenu}>
                  {planet}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
