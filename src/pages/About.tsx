import { useEffect, useState } from 'react';
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
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { BookOpen } from 'lucide-react';
import surpriseVideo from '../../docs/images/v2-surprise-me.mp4';

export default function About() {
  const location = useLocation();
  const direction = location.state?.direction || 'right';

  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const readmeModule = await import('../../README.md?raw');
        const text = readmeModule.default;
        const rawHtml = marked(text) as string;
        // Transform GitHub user-attachment mp4 video link into native video player using the local imported video asset
        const withVideos = rawHtml.replace(
          /<p><a href="https:\/\/github\.com\/user-attachments\/assets\/[^"]+".*?<\/a><\/p>/g,
          `<div class="my-4"><video src="${surpriseVideo}" controls class="w-full max-w-full rounded-xl border border-border shadow-lg" preload="metadata"></video></div>`
        );
        const transformedHtmlContent = shiftHeadingsDown(withVideos);
        setHtmlContent(transformedHtmlContent);
      } catch (err) {
        console.error('Could not load README.md', err);
      }
    };
    loadMarkdown();
  }, []);

  const handleArticleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // If the target element is inside a collapsed <details>, open it automatically
        const detailsParent = targetEl.closest('details') || targetEl.parentElement?.querySelector('details');
        if (detailsParent) {
          detailsParent.open = true;
        }
      }
    }
  };

  return (
    <motion.div
      className="mx-auto max-w-4xl py-4"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      custom={direction}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
    >
      <Card className="border border-border bg-card shadow-xl">
        <CardHeader className="border-b border-border pb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30" aria-hidden="true">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">About this project</h1>
        </CardHeader>
        <CardContent className="p-6 sm:p-10">
          <article
            aria-label="Project documentation and details"
            onClick={handleArticleClick}
            className="about-markdown space-y-4 text-foreground leading-relaxed text-base [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-foreground [&_h2]:border-b [&_h2]:border-border/60 [&_h2]:pb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-foreground [&_h4]:text-lg [&_h4]:font-bold [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-foreground [&_h5]:text-base [&_h5]:font-bold [&_h5]:mt-6 [&_h5]:mb-2 [&_h5]:text-foreground [&_p]:mb-4 [&_p]:text-foreground/90 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-foreground [&_a]:text-primary [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80 focus-visible:[&_a]:ring-2 focus-visible:[&_a]:ring-ring [&_code]:rounded [&_code]:bg-secondary [&_code]:text-foreground [&_code]:border [&_code]:border-border [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_hr]:border-border [&_hr]:my-6 [&_img]:rounded-xl [&_img]:border [&_img]:border-border [&_img]:my-3 [&_video]:max-w-full [&_video]:rounded-xl [&_video]:border [&_video]:border-border [&_video]:my-3"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
