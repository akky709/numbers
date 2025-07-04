'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Header.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Numbers Analytics</span>
          </Link>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              href="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              ホーム
            </Link>
            <Link 
              href="/numbers3" 
              className={`nav-link ${isActive('/numbers3') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              ナンバーズ3
            </Link>
            <Link 
              href="/numbers4" 
              className={`nav-link ${isActive('/numbers4') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              ナンバーズ4
            </Link>
            <Link 
              href="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              このサイトについて
            </Link>
          </nav>
          
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニューを開く"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}