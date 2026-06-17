'use client';

import { motion } from 'framer-motion';

const ScrollReveal = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  yOffset = 20, 
  staggerChildren = false,
  onlyChildren = false // If true, only children animate, container stays static
}) => {
  const containerVariants = {
    hidden: { opacity: onlyChildren ? 1 : 0, y: onlyChildren ? 0 : yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
        when: "beforeChildren",
        staggerChildren: staggerChildren ? 0.12 : 0,
      },
    },
  };

  if (staggerChildren) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: duration, delay: delay }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;

export const ScrollRevealItem = ({ children, yOffset = 20 }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: yOffset },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  );
};
