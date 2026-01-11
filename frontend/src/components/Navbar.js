import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { href: '/schools', label: t('nav_schools') },
    { href: '/transport', label: t('nav_transport') },
    { href: '/services', label: t('nav_services') },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
              <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <span className="font-serif font-semibold text-emerald-900 text-lg hidden sm:block">
                Dublin Study
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                data-testid={`nav-link-${link.href.slice(1)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
              data-testid="language-toggle"
            >
              <Globe className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" data-testid="user-menu-trigger">
                    <User className="h-4 w-4" />
                    {user?.name?.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} data-testid="nav-dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {t('nav_dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} data-testid="nav-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav_logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" data-testid="nav-login">
                    {t('nav_login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-emerald-900 hover:bg-emerald-800" data-testid="nav-register">
                    {t('nav_register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              data-testid="mobile-language-toggle"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-button"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in" data-testid="mobile-menu">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav_dashboard')}
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-900"
                    >
                      {t('nav_logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav_login')}
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm font-medium text-emerald-900"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav_register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
