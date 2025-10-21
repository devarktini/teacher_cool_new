const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getCompleteUrl = (url:string) => {
    
  if (!url) {
    return '/default-image.png'; // Fallback image if URL is missing
  }
  if (url.startsWith("https") || url.startsWith("http")) {
    return url;
  } else {
    return `${baseUrl}${url}`;
  }
};