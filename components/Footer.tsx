'use client'

import Link from 'next/link'
import { FiHeart, FiInstagram, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'Instagram',
      icon: FiInstagram,
      url: 'https://instagram.com/mr_amlya',
      color: 'hover:text-pink-400'
    },
    {
      name: 'GitHub',
      icon: FiGithub,
      url: 'https://github.com/mramlya',
      color: 'hover:text-purple-400'
    },
    {
      name: 'Twitter',
      icon: FiTwitter,
      url: 'https://twitter.com/mr_amlya',
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: FiLinkedin,
      url: 'https://linkedin.com/in/mramlya',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Email',
      icon: FiMail,
      url: 'mailto:asbhadane21@gmail.com',
      color: 'hover:text-red-400'
    },
  ]

  return (
    <footer className="relative mt-20 border-t border-white/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
      
      <div className="relative glass">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-6">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <FiHeart className="text-3xl text-pink-400 heart-beat" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unheard Echoes
              </span>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-center max-w-md">
              Where unspoken words find their voice
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-all transform hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="text-2xl" />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Developer Credit */}
            <div className="text-center space-y-2">
              <p className="text-gray-400 flex items-center justify-center gap-2">
                Designed & Developed with
                <FiHeart className="text-red-400 animate-pulse" />
                by
                <Link 
                  href="https://github.com/mramlya" 
                  target="_blank"
                  className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-pink-400 hover:to-purple-400 transition-all"
                >
                  MrAmlya
                </Link>
              </p>

              {/* Copyright */}
              <p className="text-gray-500 text-sm">
                © {currentYear} Unheard Echoes. All rights reserved.
              </p>
            </div>

            {/* Tech Stack Badge (optional) */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-3 py-1 rounded-full glass-card">Next.js</span>
              <span className="px-3 py-1 rounded-full glass-card">TypeScript</span>
              <span className="px-3 py-1 rounded-full glass-card">Tailwind CSS</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

