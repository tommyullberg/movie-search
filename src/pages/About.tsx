import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { variants, transition } from '../utils/pageAnimations';
import { useLocation } from 'react-router-dom';
import { marked } from 'marked';
import { shiftHeadingsDown } from '../utils/helpers';

export default function Home() {
  const location = useLocation();
  const direction = location.state?.direction || 'right';

  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const publicPath = process.env.PUBLIC_URL;
  const readmeFile = `${publicPath}/README.md`;

  useEffect(() => {
    const fetchTextFile = async () => {
      const cacheName      = 'readme-cache';
      const cacheKey       = 'readme.md';
      const cacheStorage   = await caches.open(cacheName);
      const cachedResponse = await cacheStorage.match(cacheKey);

      if (cachedResponse) {
        const text = await cachedResponse.text();
        setMarkdownContent(text);
      } else {
        const response = await fetch(readmeFile);
        const clonedResponse = response.clone();
        const text = await response.text();
        setMarkdownContent(text);
        cacheStorage.put(cacheKey, clonedResponse);
      }
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
      custom={direction}>
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
