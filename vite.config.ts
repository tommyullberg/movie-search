import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

function getGitVersion(): string {
  try {
    const tag = execSync('git describe --tags --abbrev=0', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (tag) return tag.replace(/^v/, '');
  } catch {
    // Fall back to package.json version if git command fails (e.g. shallow CI)
  }
  try {
    const pkgJson = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, 'package.json'), 'utf-8'));
    return pkgJson.version || '2.0.0';
  } catch {
    return '2.0.0';
  }
}

const appVersion = getGitVersion();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  base: '/movie-search/', // GitHub Pages base path
});
