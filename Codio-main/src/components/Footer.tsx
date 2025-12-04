import { useTranslation } from 'react-i18next';
import { Instagram, Facebook, MessageCircle, Linkedin, Send, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/try.codio/', label: 'Instagram' },
    { icon: MessageCircle, href: 'https://wa.me/', label: 'WhatsApp' },
    { icon: Send, href: 'https://t.me/', label: 'Telegram' },
    { icon: Linkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com/', label: 'Facebook' },
    { icon: Mail, href: 'mailto:alitixs567@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">
                <img src="favicon2.jpg" className='rounded-full' />
              </div>
              <span className="text-2xl font-bold text-foreground font-display">Codio</span>
            </div>
            <p className="text-muted-foreground">
              {t('userHeroSubtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('contact')}</h3>
            <div className="space-y-2">
              <a href="mailto:alitixs567@gmail.com" className="block text-muted-foreground hover:text-primary transition-colors">
                alitixs567@gmail.com
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('followUs')}</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Codio. {t('allRightsReserved')}
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t('privacyPolicy')}
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                {t('termsOfService')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
