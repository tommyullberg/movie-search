import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  variants,
  transition,
  onAnimationStart,
  onAnimationComplete
} from '../utils/pageAnimations';

export default function NoPage404() {
  const publicPath = process.env.PUBLIC_URL;
  return (
    <motion.div
      className='container-fluid content'
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={transition}
      custom='right'
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}>
      <h1>404 - Not found</h1>
      <p>
        <Link to={`${publicPath}/`}>Go to the home page</Link>
      </p>
    </motion.div>
  );
}
