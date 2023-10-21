import { Link } from "@remix-run/react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-500 mt-10 text-white">
      <div className="container flex flex-col items-center justify-center px-4 py-8 mx-auto md:flex-row lg:justify-between">
        <div className="flex flex-wrap justify-center">
          <ul className="flex items-center space-x-4">
            <li>
              <Link to="#">About</Link>
            </li>
            <li>
              <Link to="#">Report Bugs</Link>
            </li>
          </ul>
        </div>
        <div className="flex justify-center space-x-4 mt-4 lg:mt-0">
          <Link to="#">
            <Facebook />
          </Link>
          <Link to="#">
            <Twitter />
          </Link>
          <Link to="#">
            <Instagram />
          </Link>
          <Link to="#">
            <Linkedin />
          </Link>
        </div>
      </div>
      <div className="pb-2">
        <p className="text-center">
          @{new Date().getFullYear()} All rights reserved by your Primakra
          Developers.
        </p>
      </div>
    </footer>
  );
}
