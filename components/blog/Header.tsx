
import React from 'react';
import Link from 'next/link';
import { InitialsIcon } from '@/components/icons/InitialsIcon';

export const Header = () => (
  <header className="py-10 bg-gradient-to-r from-pink-100 to-indigo-100 shadow-md relative overflow-hidden">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
      <div className="text-center md:text-left mb-8 md:mb-0">

        <h1 className="text-5xl font-black font-sans text-pink-600 tracking-wide">
          <Link href="/"><InitialsIcon /></Link>
          <span className='text-indigo-800'>My Blog</span>
        </h1>
        <p className="text-lg mt-3 text-gray-700">Snippets, cheatsheets, & musings on web development</p>
      </div>
    </div>
  </header>
);
