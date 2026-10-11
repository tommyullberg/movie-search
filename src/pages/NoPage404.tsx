import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  variants,
  transition,
  onAnimationStart,
  onAnimationComplete
} from '../utils/pageAnimations';
import { Button } from '../components/ui/button';
import { Film, Home } from 'lucide-react';

export default function NoPage404() {
  const publicPath = import.meta.env.BASE_URL;
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 text-center"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      custom="right"
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
        <Film className="h-10 w-10 opacity-50" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
        404 - Page Not Found
      </h1>
      <p className="mt-3 text-base text-muted-foreground max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to={`${publicPath}/`}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
