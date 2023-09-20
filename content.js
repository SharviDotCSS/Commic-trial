    //content.js
    
    // JavaScript to toggle active tab content
    const tabs = document.querySelectorAll('.tab-content');

    export function showTab(tabId) {
      console.log("inside showtab");
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });

      const selectedTab = document.getElementById(tabId);
      selectedTab.classList.add('active');
    }

    // Event listeners for tab clicks
    const imagesTab = document.getElementById('images-tab');
    const svgsTab = document.getElementById('svgs-tab');
    const iconsTab = document.getElementById('icons-tab');

    imagesTab.addEventListener('click', () => {
      showTab('images-tab');
    });

    svgsTab.addEventListener('click', () => {
      showTab('svgs-tab');
    });

    iconsTab.addEventListener('click', () => {
      showTab('icons-tab');
    });