// preview.js
document.addEventListener('DOMContentLoaded', () => {
    // Get the comic artwork data URL from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const comicImageDataUrl = urlParams.get('comicDataUrl');
  
    // Set the comic artwork as the source of the <img> element
    const comicPreview = document.getElementById('comic-preview');
    comicPreview.src = comicImageDataUrl;
  
    // Add event listener for the "Download" button
    const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', () => {
      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = comicImageDataUrl;
      downloadLink.download = 'comic_artwork.png';
      downloadLink.click();
    });
  
    // Add event listener for the "Share" button (customize as needed)
    const shareButton = document.getElementById('share-button');
    shareButton.addEventListener('click', () => {
      // Implement sharing functionality, e.g., share on social media
      // You can use third-party sharing libraries or APIs for this.
    });
  });
  