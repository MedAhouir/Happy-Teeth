import { motion } from 'framer-motion';

const Checkmark = () => {
  return (
    <motion.svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="green"
        strokeWidth="5"
        fill="none"
      />
      <motion.path
        d="M30 50 L45 65 L70 35"
        stroke="green"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
};

export default Checkmark;
