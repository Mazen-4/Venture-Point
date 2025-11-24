import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/pageTransition.css';

/**
 * PageTransition Component
 * Provides a book-like page slide animation when navigating between pages
 * The old page slides out to the left while the new page slides in from the right
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = React.useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation]);

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 1000,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth book-like motion
      },
    },
    exit: {
      opacity: 0,
      x: -1000,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setDisplayLocation(location)}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page-transition-wrapper"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
