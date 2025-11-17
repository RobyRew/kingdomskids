'use client';

import { useState as state } from 'react';

export default function Header() {
  const [search, $search] = state('');

  return (
    <>
      {search && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => $search('')}></div>
      )}

      <header className="w-full py-5 text-sm">
        <div className="relative mx-auto w-fit z-50">
        <div className="relative z-50 flex
                        items-center justify-center
                        p-2.5
                        gap-2.5
                        bg-off-white
                        border 
                        border-transparent 
                        rounded-t-lg">

          <button className="flex-shrink-0
                             p-2.5 
                             text-black hover:text-orange active:text-orange
                             transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a
            href=""
            className="flex-shrink-0
                       px-5 py-1.5
                       text-xl font-bold text-black hover:text-orange active:text-orange
                       border-y 
                       border-black hover:border-orange active:border-orange
                       transition-colors duration-300">
            Kingdom's Kids
          </a>

          <nav className="flex items-center gap-2.5">
            <a
              href=""
              className="select-none inline-block
                         px-5 py-2.5
                         font-medium text-black hover:text-orange active:text-orange
                         bg-transparent hover:bg-transparent active:bg-transparent
                         transition-colors duration-300"
            >
              Testimonies
            </a>
            <a
              href=""
              className="select-none inline-block
                         px-5 py-2.5
                         font-medium text-black hover:text-orange active:text-orange
                         bg-transparent hover:bg-transparent active:bg-transparent
                         transition-colors duration-300"
            >
              Gallery
            </a>
          </nav>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black ac pointer-events-none" fill="none" stroke="black" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              onFocus={() => $search('active')}
              onBlur={() => $search('')}
              className="w-100 pl-10 pr-5 py-2.5
                         placeholder:text-black
                         caret-orange
                         text-black
                         selection:bg-orange selection:text-white
                         bg-gray
                         rounded-lg
                         focus:outline-1 focus:outline-orange"
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
                         border 
                         border-black hover:border-orange active:border-orange 
                         rounded-lg
                         transition-colors duration-300"
            >
              Donate
            </a>

            <a
              href=""
              className="select-none
                         px-5 py-2.5
                         font-medium text-black hover:text-white active:text-white
                         bg-transparent hover:bg-orange active:bg-orange
                         border 
                         border-black hover:border-transparent active:border-transparent
                         rounded-lg
                         transition-colors duration-300"
            >
              Volunteer
            </a>
          </div>

        </div>

        {search && (
          <div className="absolute top-full left-0 w-full rounded-b-lg bg-off-white p-4">
            <p className="text-gray-600">Search results will appear here...</p>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
