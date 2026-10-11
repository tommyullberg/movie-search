import { SearchForm } from '../components/SearchForm';
import { SearchResults } from '../components/SearchResults';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  variants,
  transition,
  onAnimationStart,
  onAnimationComplete
} from '../utils/pageAnimations';

export default function Home() {
  const location = useLocation();
  const direction = location.state?.direction || 'right';

  return (
    <motion.div
      className="w-full"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      custom={direction}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
    >
      <SearchForm />
      <SearchResults />
    </motion.div>
  );
}
