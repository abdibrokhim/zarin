/**
 * Utility functions for image handling in chat
 */

/**
 * Converts a base64 string to a proper data URL that can be used in an <img> src attribute
 * If the string already starts with data:, it's returned as is
 * 
 * @param base64 Base64 encoded image data
 * @param mimeType MIME type of the image (default: image/png)
 * @returns Properly formatted data URL
 */
export function convertBase64ToImageSrc(base64: string, mimeType = 'image/png'): string {
  // If the string already starts with data:, it's already a data URL
  if (base64.startsWith('data:')) {
    return base64;
  }

  // If it starts with http:// or https://, it's a URL
  if (base64.startsWith('http://') || base64.startsWith('https://')) {
    return base64;
  }

  // Otherwise, create a data URL
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Gets the appropriate MIME type based on image content or extension
 * 
 * @param filename Optional filename with extension
 * @param defaultType Default MIME type to use if can't be determined (default: image/png)
 * @returns MIME type string
 */
export function getImageMimeType(filename?: string, defaultType = 'image/png'): string {
  if (!filename) return defaultType;

  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return defaultType;
  }
}

/**
 * Extracts dimensions from a base64 image
 * Note: This is an async function that creates an Image object to get dimensions
 * 
 * @param base64 Base64 encoded image data
 * @param mimeType MIME type of the image
 * @returns Promise resolving to dimensions object {width, height}
 */
export function getBase64ImageDimensions(base64: string, mimeType = 'image/png'): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = convertBase64ToImageSrc(base64, mimeType);
  });
} 