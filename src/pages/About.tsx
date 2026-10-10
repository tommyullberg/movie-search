import React, { useEffect, useState } from 'react';
import { shiftHeadingsDown } from '../utils/helpers';
import { marked } from 'marked';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  variants,
  transition,
  onAnimationStart,
  onAnimationComplete
} from '../utils/pageAnimations';

export default function About() {
  const location = useLocation();
  const direction = location.state?.direction || 'right';

  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    document.getElementById('appBody')?.setAttribute('class', 'about');
  }, []);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        // Use Vite's dynamic import with ?raw to get the file contents as a string
        const readmeModule = await import('../../README.md?raw');
        const text = readmeModule.default;
        
        const rawHtml = marked(text);
        const transformedHtmlContent = shiftHeadingsDown(rawHtml as string);
        setHtmlContent(transformedHtmlContent);
      } catch (err) {
        console.error("Could not load README.md", err);
      }
    };
    loadMarkdown();
  }, []);


  return (
    <motion.div
      className='container-fluid content'
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={transition}
      custom={direction}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}>
      <section>
        <div className='card mb-3'>
          <div className='card-header py-3'>
            <h1 className='mb-0 text-center'>About</h1>
          </div>
          <div className='card-body text'>
            <div
              className='readme-content'
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
}
