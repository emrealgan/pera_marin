"use client"
import Image from "next/image"
import Logo from "@/public/pera.jpg"
import Link from "next/link"
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar({ triggerZoom = () => { } }) {

  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname()
  const router = useRouter()

  const items = [
    {
      name: "About Us",
      href: "/",
      target: "",
      onClick: () => {
        if (path !== '/') {
          router.push('/');
          triggerZoom();
        } else {
          triggerZoom();
        }
      }
    },
    {
      name: "Our Products",
      href: "/products",
      target: ""
    },
    {
      name: "Contact",
      href: "https://wa.me/905372779962",
      target: "_blank"
    },
    {
      name: "info@peramarin.com",
      href: "mailto:info@peramarin.com",
      target: "_blank"
    },
  ]


  return (
    <nav className="w-full h-12 md:h-20 absolute bg-white shadow-md z-10 italic">
      <div className="flex items-center justify-between h-full px-4 overflow-hidden">
        <Link className="flex items-center justify-center h-full sm:w-[16%] lg:w-[12%] p-2"
          href={path === '/' ? '/admin' : '/'}
        >
          <Image
            className="object-cover h-full w-auto md:h-auto md:w-full"
            src={Logo}
            alt="Logo"
            priority
          />
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden block text-gray-500 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <div className="hidden md:flex flex-grow justify-evenly xl:px-32">
          {items.map((item) => (
            <Link
              key={item.href}
              className="sm:text-base lg:text-lg text-gray-500 hover:text-gray-900"
              href={item.href}
              target={item.target}
              onClick={item?.onClick}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg">
            {items.map((item) => (
              <Link
                key={item.href}
                className="block px-4 py-2 text-lg text-gray-500 hover:text-gray-900"
                href={item.href}
                target={item.target}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
