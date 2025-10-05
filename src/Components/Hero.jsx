import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// ===== Earth Animations =====
const rotateDay = keyframes`
  0% { background-position: 120% 0; }
  100% { background-position: -80% 0; }
`;

const rotateNight = keyframes`
  0% { background-position: calc(120% + 120px) 0; }
  100% { background-position: calc(-80% + 120px) 0; }
`;

const spinClouds = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// ===== Earth Styled Components =====
const EarthWrapper = styled.div`
  position: absolute;
  top: 100px;
  left: 750px;
  width: 80vh;
  height: 80vh;
  z-index: 0;

  /* Improved responsive design */
  @media only screen and (max-width: 1200px) {
    left: 600px;
    width: 70vh;
    height: 70vh;
  }

  @media only screen and (max-width: 1024px) {
    left: 500px;
    width: 60vh;
    height: 60vh;
  }

  @media only screen and (max-width: 768px) {
    position: relative;
    top: 0;
    left: 0;
    width: 80vw;
    height: 80vw;
    margin: 0 auto;
  }

  @media only screen and (max-width: 600px) {
    width: 70vw;
    height: 70vw;
    margin-top: 20px;
  }

  @media only screen and (max-width: 480px) {
    width: 85vw;
    height: 85vw;
  }

  @media only screen and (max-width: 320px) {
    width: 90vw;
    height: 90vw;
  }
`;

const MotionEarthWrapper = motion(EarthWrapper);

const PlanetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 
    0 0 50px rgba(94, 144, 241, 0.7),
    -25px -15px 80px rgba(94, 144, 241, 0.4) inset;
  transform: rotate(-15deg);
  overflow: hidden;
`;

const PlanetLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: 200% 100%;
  background-repeat: repeat-x;
`;

const Night = styled(PlanetLayer)`
  background-image: url('https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg');
  animation: ${rotateNight} 80s linear infinite;
  z-index: 2;
`;

const Day = styled(PlanetLayer)`
  background-image: url('https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg');
  animation: ${rotateDay} 80s linear infinite;
  mask-image: linear-gradient(90deg, transparent 0%, black 30%);
  z-index: 3;
`;

const Clouds = styled(PlanetLayer)`
  background-image: url('https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg');
  animation: 
    ${rotateDay} 50s linear infinite,
    ${spinClouds} 200s linear infinite;
  opacity: 0.35;
  z-index: 4;
`;

const InnerShadow = styled(PlanetLayer)`
  box-shadow: 
    -10px 0 25px rgba(21, 43, 87, 0.8) inset,
    10px 0 25px rgba(4, 6, 21, 0.8) inset;
  z-index: 5;
`;

// ===== Earth Component =====
const Earth = () => (
  <MotionEarthWrapper
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  >
    <PlanetContainer>
      <Night />
      <Day />
      <Clouds />
      <InnerShadow />
    </PlanetContainer>
  </MotionEarthWrapper>
);

// ===== Hero Component =====
const Hero = () => {
  const [isAnimating,] = useState(true);
  const [theme, setTheme] = useState("light");
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    // Safe window size detection
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial size
    handleResize();

    // Add event listener with safe check
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      setTheme(document.body.classList.contains("dark-mode") ? "dark" : "light");
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const isMobile = windowSize.width <= 768;
  const isSmallMobile = windowSize.width <= 480;

  const styles = {
    container: {
      position: 'relative',
      height: isMobile ? 'auto' : '100vh',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      zIndex: 0,
      background: theme === "light" ? "#e1d9d1" : "#121212",
      padding: isMobile ? '20px 0' : '0',
    },
    backgroundContainer: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      zIndex: 1,
    },
    blobsContainer: {
      position: 'absolute',
      inset: '-10px',
      opacity: 0.5,
    },
    blob: {
      position: 'absolute',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(20px)',
    },
    contentContainer: {
      position: 'relative',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: isMobile ? '0 20px' : '0 16px',
      textAlign: 'center',
      zIndex: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroHeading1: {
      width: isMobile ? '100%' : '400px',
      fontFamily: 'Orbitron',
      fontSize: isSmallMobile ? '2rem' : isMobile ? '3rem' : '4.75rem',
      fontWeight: 700,
      marginBottom: '20px',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: theme === "light" ? "#121212" : "#fff",
      textAlign: 'center',
      lineHeight: 1.2,
      position: 'relative',
      right: isMobile ? -5 : 400,
      top: isMobile ? 50 : 50,
    },
    heroHeading2: {
      width: isMobile ? '100%' : '500px',
      fontFamily: 'Orbitron',
      fontSize: isSmallMobile ? '2rem' : isMobile ? '3rem' : '4.75rem',
      fontWeight: 700,
      marginBottom: '20px',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: theme === "light" ? "#121212" : "#fff",
      textAlign: 'center',
      lineHeight: 1.2,
      position: 'relative',
      right: isMobile ? -5 : 300,
      top: isMobile ? 20 : 10,
    },
    heroSubtitle: {
      fontSize: isSmallMobile ? '0.9rem' : isMobile ? '1rem' : '0.94rem',
      color: theme === "light" ? "#121212" : "#ccc",
      marginBottom: '24px',
      maxWidth: isMobile ? '100%' : '430px',
      textAlign: isMobile ? 'center' : 'justify',
      lineHeight: 1.5,
      position: 'relative',
      right: isMobile ? -10 : 250,
      top: isMobile ? 10 : -10,
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 32px',
      background: 'linear-gradient(90deg, #9333EA 0%, #DB2777 100%)',
      color: 'white',
      borderRadius: '9999px',
      fontWeight: 500,
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      margin: '0 auto',
    },
    letterContainer: {
      display: 'inline-block',
      position: 'relative',
      margin: '0 2px',
    },
    baseLetter: {
      opacity: 0.3,
      transition: 'opacity 0.3s ease',
      display: 'inline-block',
    },
    animatedLetter: (delay) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      animation: isAnimating ? `letters-loading 4s infinite ${delay}s` : 'none',
      opacity: 0,
      transform: 'rotateY(-90deg)',
      color: theme === "light" ? "#121212" : "#fff",
      display: 'inline-block',
    }),
  };

  const keyframes = `
    @keyframes letters-loading {
      0%, 75%, 100% {
        opacity: 0;
        transform: rotateY(-90deg);
      }
      25%, 50% {
        opacity: 1;
        transform: rotateY(0deg);
      }
    }
  `;

  const renderAnimatedText = (text) => {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return <span key={index} style={{ display: 'inline-block', width: isMobile ? '10px' : '20px' }}>&nbsp;</span>;
      }

      const delay = index * 0.15;

      return (
        <span key={index} style={styles.letterContainer}>
          <span style={styles.baseLetter}>{char}</span>
          <span style={styles.animatedLetter(delay)}>
            {char}
          </span>
        </span>
      );
    });
  };

  return (
    <div style={styles.container}>
      {/* Earth animation in the background */}
      {!isMobile && <Earth />}

      {/* Blobs (on top of Earth) */}
      <div style={styles.backgroundContainer}>
        <div style={styles.blobsContainer}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                ...styles.blob,
                width: '60%',
                height: '60%',
                left: `${i * 30}%`,
                top: `${i * 20}%`,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero text content */}
      <div className='contentContainer' style={styles.contentContainer}>
        {isMobile && <Earth />}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <style>{keyframes}</style>
          <h1 style={styles.heroHeading1}>
            {renderAnimatedText("Meet the")}
          </h1>
          <h1 style={styles.heroHeading2}>
            {renderAnimatedText("New Reality")}
          </h1>
          <p style={styles.heroSubtitle}>
            Discover thought-provoking articles, creative insights
            that will expand your horizons.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;