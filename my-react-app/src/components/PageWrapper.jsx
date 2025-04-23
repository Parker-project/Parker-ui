import { motion } from 'framer-motion';

export default function PageWrapper({ children }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg"
      >
        {children}
      </motion.div>
    </div>
  );
}
