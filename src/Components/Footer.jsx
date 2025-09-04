import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaYoutube,
} from "react-icons/fa"; // Importing icons from react-icons

function Footer() {

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const updateTheme = () => {
      setTheme(document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const getSocialColor = (platform) => {
    return theme === 'light' ? '#121212' : '#e1d9d1';
  };

  // Update styles based on theme
  const updatedStyles = {
    ...styles,
    footer: {
      ...styles.footer,
      backgroundColor: theme === 'light' ? '#e1d9d1' : '#121212',
    },
    link: {
      ...styles.link,
      color: theme === 'light' ? '#000' : '#fff',
    },
    footerSocialIcons: {
      ...styles.footerSocialIcons,
      color: theme === 'light' ? '#121212' : '#121212',
    },
    footerCopyright: {
      ...styles.footerCopyright,
      color: theme === 'light' ? '#000' : '#fff',
    }
  };



  return (
    <footer style={updatedStyles.footer}>
      <div style={updatedStyles.footerLinks}>
        <div style={updatedStyles.footerLinksText}>
          {/* Add style tag for animations */}
          <style>
            {`
    .footer-link {
      position: relative;
      display: inline-block;
      text-decoration: none;
    }
    
    .footer-link::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: currentColor;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    .footer-link:hover::after {
      width: 100%;
      color: #b19cd9;
    }
    `}
          </style>

          {/* Add className to each Link */}
          <Link to="/" style={updatedStyles.link} className="footer-link">
            Home
          </Link>
          <Link to="/about" style={updatedStyles.link} className="footer-link">
            About
          </Link>
          <Link to="/categories" style={updatedStyles.link} className="footer-link">
            Categories
          </Link>
          <Link to="/shareurthoughts" style={updatedStyles.link} className="footer-link">
            Share Ur Thoughts
          </Link>
        </div>


        <div style={updatedStyles.footerSocialIcons}>
          {[
            {
              href: "https://facebook.com",
              icon: FaFacebook,
              color: getSocialColor('facebook'),
              key: 'facebook'
            },
            {
              href: "https://instagram.com",
              icon: FaInstagram,
              color: getSocialColor('instagram'),
              key: 'instagram'
            },
            {
              href: "https://mail.google.com/mail/?view=cm&fs=1&to=benatcode@gmail.com",
              icon: FaEnvelope,
              color: getSocialColor('googleplus'),
              key: 'email'
            },
            {
              href: "https://youtube.com",
              icon: FaYoutube,
              color: getSocialColor('youtube'),
              key: 'youtube'
            },
          ].map((item) => (
            <div key={item.key} style={styles.iconContainer}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...styles.iconLink, color: item.color }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('.shine').style.opacity = 1;
                  e.currentTarget.querySelector('.shine').style.transform = 'rotate(30deg) translate(40px, 80px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.shine').style.opacity = 0;
                  e.currentTarget.querySelector('.shine').style.transform = 'rotate(30deg) translate(-20px, -40px)';
                }}
              >
                <item.icon style={styles.icon} />
                <div className="shine" style={styles.shineEffect} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={updatedStyles.footerCopyright}>
        <small>All Rights Reserved &copy; Copyright, Benat Code.</small>
      </div>
    </footer>
  );
}

export default Footer;

// Inline CSS styles
const styles = {
  footer: {
    backgroundColor: "#e1d9d1",
    padding: "20px",
    textAlign: "center",
  },
  footerCategories: {
    listStyle: "none",
    padding: "0",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "20px",
  },
  footerLinks: {
    margin: "30px 0",
  },
  footerLinksText: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "25px", // Increased margin to add more space below the text links
  },
  link: {
    margin: "0 10px",
    textDecoration: "none",
    color: "#e1d9d1", // Changed to white
  },
  footerSocialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
  },
  iconContainer: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    borderRadius: '50%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  iconLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '25px',
    position: 'relative',
    zIndex: 2,
    transition: "color 0.3s ease",
  },
  shineEffect: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(30deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
    transform: 'rotate(30deg) translate(-20px, -40px)',
    opacity: 0,
    transition: 'opacity 0.3s ease, transform 0.6s ease',
    zIndex: 1,
  },
  footerCopyright: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#e1d9d1", // Changed to white
  },
};
