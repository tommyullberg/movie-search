import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { variants, transition } from '../utils/pageAnimations';

export default function NoPage404() {
  return (
    <motion.div
      className='container-fluid content'
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={transition}
      custom='right'>
      <h1>404 - Not found</h1>
      <p>
        <Link to='/'>Go to the home page</Link>
      </p>
    </motion.div>
  );
}
