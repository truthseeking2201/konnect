import React from 'react';
import Link from 'next/link';
import { ExternalLink, Github, Twitter, MessageCircle, FileText } from 'lucide-react';

interface FooterLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const FooterGlyphBar: React.FC = () => {
  // For analytics
  const trackEvent = (name: string, params = {}) => {
    if (typeof window !== 'undefined') {
      console.log(`[Analytics] ${name}`, params);
    }
  };
  
  const links: FooterLink[] = [
    {
      icon: <Github size={20} />,
      href: 'https://github.com/konstellation',
      label: 'GitHub'
    },
    {
      icon: <Twitter size={20} />,
      href: 'https://twitter.com/konstellationai',
      label: 'Twitter'
    },
    {
      icon: <MessageCircle size={20} />,
      href: 'https://discord.gg/konstellation',
      label: 'Discord'
    },
    {
      icon: <FileText size={20} />,
      href: 'https://docs.konstellation.tech',
      label: 'Documentation'
    }
  ];
  
  return (
    <footer className="bg-bg border-t border-surface py-8">
      <div className="container-grid">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-primary mr-2 flex items-center justify-center">
              <span className="text-xs font-bold text-bg">K</span>
            </div>
            <span className="text-sm text-gray-400">
              © 2025 Konstellation Labs
            </span>
          </div>
          
          <div className="flex space-x-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                onClick={() => trackEvent('link_docs_click', { href: link.href })}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
          <p>
            Echo Lite is in beta. Not financial advice. Always DYOR. 
            <Link href="/terms" legacyBehavior>
              <a
                className="text-electric-ink ml-1 underline hover:no-underline"
                onClick={() => trackEvent('link_docs_click', { href: '/terms' })}
              >
                Terms & Privacy <ExternalLink size={10} className="inline" />
              </a>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterGlyphBar;