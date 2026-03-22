import React, { useEffect } from 'react';

const SEO = ({ title, description, image, type = 'website', url }) => {
  useEffect(() => {
    // Update Title
    if (title) {
      document.title = `${title} | Soundbook`;
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    }

    // Update Description
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
    }

    // Update Image
    if (image) {
      document.querySelector('meta[property="og:image"]')?.setAttribute("content", image);
      document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", image);
    }

    // Update Type and URL
    if (type) {
      document.querySelector('meta[property="og:type"]')?.setAttribute("content", type);
    }
    if (url) {
      document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);
    }
  }, [title, description, image, type, url]);

  return null;
};

export default SEO;
