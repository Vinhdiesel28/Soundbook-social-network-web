import React, { useEffect } from 'react';

/**
 * A simpler wrapper to update document meta tags dynamically without installing react-helmet.
 * Useful for SEO and sharing to social media since it updates the <head> tags accurately.
 */
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

    // Update Image (for link previews)
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

  return null; // This component does not render any UI
};

export default SEO;
