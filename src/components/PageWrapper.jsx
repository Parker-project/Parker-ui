import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './PageWrapper.css';

export default function PageWrapper({ 
  children, 
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: 10 },
  transition = { duration: 0.3 }
}) {
  return (
    <div className="app-container">
      <motion.div
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className="page-content"
      >
        {children}
      </motion.div>
    </div>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  initial: PropTypes.object,
  animate: PropTypes.object,
  exit: PropTypes.object,
  transition: PropTypes.object
};
