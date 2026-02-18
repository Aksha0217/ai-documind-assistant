import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -5,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
