const convertToEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
  
      if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        if (urlObj.pathname === '/watch') {
          const videoId = urlObj.searchParams.get('v');
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } else if (urlObj.pathname.startsWith('/live/') || urlObj.pathname.startsWith('/embed/')) {
          const videoId = urlObj.pathname.split('/').pop();
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
      } else if (urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
    } catch (error) {
      console.error('Invalid YouTube URL:', error);
    }
    return null;
  };

module.exports = convertToEmbedUrl;