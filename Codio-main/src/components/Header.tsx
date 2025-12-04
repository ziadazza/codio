import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center justify-center gap-2">
            <div className="w-20 rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">
              <img src="favicon3.png" className='rounded-md mb-2' />
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t('home')}
            </NavLink>
            <NavLink
              to="/users"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t('forUsers')}
            </NavLink>
            <NavLink
              to="/business"
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {t('forBusiness')}
            </NavLink>
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="hover:bg-secondary"
            >
              <Globe className="w-5 h-5" />
            </Button>

            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <NavLink
                to="/"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </NavLink>
              <NavLink
                to="/users"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('forUsers')}
              </NavLink>
              <NavLink
                to="/business"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('forBusiness')}
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
