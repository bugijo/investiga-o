import { motion } from 'framer-motion';

const CRTOverlay = () => {
  return (
    <>
      {/* Scanlines */}
      <div className="crt-overlay" />
      
      {/* Vignette */}
      <div className="crt-vignette" />
      
      {/* Subtle screen flicker */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[998] bg-primary/[0.02]"
        animate={{
          opacity: [0, 0.02, 0, 0.01, 0],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 8,
          times: [0, 0.2, 0.4, 0.6, 1],
        }}
      />
    </>
  );
};

export default CRTOverlay;
