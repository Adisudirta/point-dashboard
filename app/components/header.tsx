import { useState } from "react";

import Logo from "~/assets/primdev-logo.svg";
import { NavLink } from "@remix-run/react";

interface Props {
  navigations: {
    href: string;
    title: string;
  }[];
}

export default function Header({ navigations }: Props) {
  return (
    <header className="fixed shadow-md w-full z-50">
      <div className="container flex h-20 items-center justify-between">
        <div>
          <NavLink to="/">
            <div className="flex justify-between">
              <div className="mr-3">
                <img src={Logo} width={55} alt="Dashboard Logo" />
              </div>

              <div className="font-semibold h-6 text-2xl">Primdev Points</div>
            </div>
          </NavLink>
        </div>

        <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
          {navigations.map((link) => (
            <NavLink
              key={link.title}
              to={link.href}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-cyan-500 hidden sm:block"
                  : "duration-300 ease-in-out font-medium text-gray-900 hidden transition-colors sm:block hover:text-cyan-500"
              }
            >
              {link.title}
            </NavLink>
          ))}
        </div>

        <MobileNav navigations={navigations} />
      </div>
    </header>
  );
}

function MobileNav({ navigations }: Props) {
  const [navShow, setNavShow] = useState(false);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = "auto";
      } else {
        // Prevent scrolling
        document.body.style.overflow = "hidden";
      }
      return !status;
    });
  };

  return (
    <>
      <button onClick={onToggleNav} className="h-8 w-8 sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-900"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`bg-white duration-300 ease-in-out fixed h-full left-0 top-0 transform w-full z-10 ${
          navShow ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button
            className="mr-8 mt-11 h-8 w-8"
            aria-label="Toggle Menu"
            onClick={onToggleNav}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-gray-900 "
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <nav className="fixed mt-8 h-full">
          {navigations.map((link) => (
            <div key={link.title} className="px-12 py-4">
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-2xl text-cyan-500 sm:hidden"
                    : "duration-300 ease-in-out text-2xl text-gray-900 transition-colors sm:hidden hover:text-cyan-500"
                }
                onClick={onToggleNav}
              >
                {link.title}
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
