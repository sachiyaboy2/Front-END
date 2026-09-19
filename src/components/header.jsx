import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // LocalStorage එකෙන් Auth Token සහ User details ලබා ගැනීම
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Logout Function එක
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Navigation Items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Orders', path: '/orders' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4 mb-3"> 
      {/* 3D Floating Header Container */}
      <nav className="relative flex items-center justify-between rounded-2xl bg-primary px-6 py-4 border-3 border-accent shadow-[0_8px_0_0_var(--color-accent)] transition-all duration-300">
        
        {/* 3D Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary border-2 border-accent shadow-[0_4px_0_0_var(--color-accent)] active:translate-y-1 active:shadow-none transition-all overflow-hidden p-1">
            <img src="/logo.png" alt="නාරී CRAFT Logo" className="h-full w-full object-contain" />
          </div>
          <span className="text-3xl font-black text-accent tracking-wide drop-shadow-[2px_2px_0_var(--color-secoundry)]">
            නාරී<span className="text-secoundry text-2xl">CRAFT</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 font-bold text-accent">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative py-1 transition-all duration-200 block active:translate-y-0 ${
                    isActive
                      ? 'text-secoundry border-b-2 border-secoundry font-black'
                      : 'hover:text-secoundry hover:-translate-y-0.5'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 3D Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-3">
              <span className="font-bold text-accent">
                Hi, {user?.name || 'User'} 👋
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-primary px-5 py-2.5 font-bold text-accent border-2 border-accent shadow-[0_4px_0_0_var(--color-accent)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-accent)] active:translate-y-1 active:shadow-none transition-all duration-150"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="rounded-xl bg-primary px-5 py-2.5 font-bold text-accent border-2 border-accent shadow-[0_4px_0_0_var(--color-accent)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-accent)] active:translate-y-1 active:shadow-none transition-all duration-150">
                  Log In
                </button>
              </Link>

              <Link to="/register">
                <button className="rounded-xl bg-[#E4D19E] px-5 py-2.5 font-bold text-secoundry border-2 border-accent shadow-[0_4px_0_0_var(--color-accent)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-accent)] active:translate-y-1 active:shadow-none transition-all duration-150">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2.5 rounded-xl bg-primary border-2 border-accent shadow-[0_3px_0_0_var(--color-accent)] active:translate-y-0.5 active:shadow-none"
        >
          <span className="w-6 h-0.5 bg-accent rounded-full"></span>
          <span className="w-6 h-0.5 bg-accent rounded-full"></span>
          <span className="w-6 h-0.5 bg-accent rounded-full"></span>
        </button>
      </nav>

      {/* Mobile Responsive Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 rounded-2xl bg-primary p-5 border-3 border-accent shadow-[0_8px_0_0_var(--color-accent)] flex flex-col gap-4 font-bold text-accent">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-1 transition-all ${
                  isActive ? 'text-secoundry font-black' : 'hover:text-secoundry'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <hr className="border-accent/20" />
          <div className="flex flex-col gap-3">
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-primary py-2.5 text-accent border-2 border-accent shadow-[0_4px_0_0_var(--color-accent)] active:translate-y-1 active:shadow-none"
              >
                Log Out ({user?.name || 'User'})
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full rounded-xl bg-primary py-2.5 text-accent border-2 border-accent shadow-[0_4px_0_0_var(--color-accent)] active:translate-y-1 active:shadow-none">
                    Log In
                  </button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full rounded-xl bg-[#E4D19E] py-2.5 text-secoundry border-2 border-accent shadow-[0_4px_0_0_var(--color-accent)] active:translate-y-1 active:shadow-none">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}