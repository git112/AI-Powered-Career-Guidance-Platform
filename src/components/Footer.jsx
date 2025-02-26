// import React from 'react';
// import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer className="text-cyan-400 py-8">
//       <div className="container mx-auto px-6">
//         {/* Top Section */}
//         <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
//           {/* Logo & Tagline */}
//           <div>
//             <a href="/">
//               <img
//                 src="/logo.png"
//                 alt="GigPilot"
//                 className="h-20 py-1 w-auto object-contain"
//               />
//             </a>
//             <p className="text-cyan-50 mt-2">Your AI-powered freelancing assistant.</p>
//           </div>

//           {/* Quick Links */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="/" className="text-cyan-50 hover:text-cyan-400">🏠 Home</a></li>
//                 <li><a href="/gigs" className="text-cyan-50 hover:text-cyan-400">🔍 Find Gigs</a></li>
//                 <li><a href="/analytics" className="text-cyan-50 hover:text-cyan-400">📊 Analytics</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-3">More Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="/blog" className="text-cyan-50 hover:text-cyan-400">📖 Blog</a></li>
//                 <li><a href="/contact" className="text-cyan-50 hover:text-cyan-400">📩 Contact</a></li>
//               </ul>
//             </div>
//           </div>

//           {/* Social Media */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
//             <div className="flex justify-center md:justify-start space-x-4">
//               <a href="#" className="text-cyan-50 hover:text-cyan-400"><Facebook /></a>
//               <a href="#" className="text-cyan-50 hover:text-cyan-400"><Twitter /></a>
//               <a href="#" className="text-cyan-50 hover:text-cyan-400"><Instagram /></a>
//               <a href="#" className="text-cyan-50 hover:text-cyan-400"><Linkedin /></a>
//             </div>
//           </div>

//           {/* Newsletter Signup */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">📬 Stay Updated</h3>
//             <p className="text-cyan-50">Get the best freelancing gigs in your inbox.</p>
//             <div className="mt-3 flex">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="p-2 w-full rounded-l-lg bg-gray-800 border border-gray-700 text-white"
//               />
//               <button className="bg-cyan-500 px-4 py-2 rounded-r-lg text-white hover:bg-cyan-600">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="text-center text-gray-500 text-sm mt-5 border-t border-gray-800 pt-4">
//           &copy; 2025 GigPilot. All rights reserved. 💡
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "../assets/logo.png";
const Footer = () => {
  return (
    <footer className="bg-background text-cyan-100 py-10">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo & Tagline */}
          <div>
            <a href="/" className="flex items-center justify-center md:justify-start">
              <img src={logo} alt="Brand Logo" className="h-12 w-auto object-contain" />
            </a>
            <p className="text-muted-foreground mt-2 ">Your ultimate job & internship hub.</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-cyan-400">🏠 Home</a></li>
                <li><a href="/jobs" className="hover:text-cyan-400">💼 Find Jobs</a></li>
                <li><a href="/internships" className="hover:text-cyan-400">🎓 Internships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/blog" className="hover:text-cyan-400">📝 Blog</a></li>
                <li><a href="/contact" className="hover:text-cyan-400">📩 Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-cyan-400"><Facebook /></a>
              <a href="#" className="hover:text-cyan-400"><Twitter /></a>
              <a href="#" className="hover:text-cyan-400"><Instagram /></a>
              <a href="#" className="hover:text-cyan-400"><Linkedin /></a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">📬 Stay Updated</h3>
            <p className="text-gray-400 text-sm">Get the latest jobs & internships delivered to your inbox.</p>
            <div className="mt-3 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 w-full rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none"
              />
              <button className="bg-cyan-500 px-4 py-2 rounded-r-lg text-white hover:bg-cyan-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-800 pt-4">
          &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
