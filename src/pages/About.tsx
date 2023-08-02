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

export default function Home() {
  const location = useLocation();
  const direction = location.state?.direction || 'right';

  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const publicPath = process.env.PUBLIC_URL;
  const readmeFile = `${publicPath}/README.md`;

  document.getElementById('appBody')?.setAttribute('class', 'about');

  useEffect(() => {
    const fetchTextFile = async () => {
      const response = await fetch(readmeFile);
      const text = await response.text();
      setMarkdownContent(text);
    };
    fetchTextFile();
  }, [readmeFile]);

  useEffect(() => {
    const transformMarkdown = async () => {
      const htmlContent = marked(markdownContent);
      const transformedHtmlContent = shiftHeadingsDown(htmlContent);
      setHtmlContent(transformedHtmlContent);
    };
    transformMarkdown();
  }, [markdownContent]);

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
