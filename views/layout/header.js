var headerLoaded = false;

window.onloadHeader = function() {
    if (!headerLoaded) {
        initMenu();
        headerLoaded = true;
    }
};

function initMenu() {
    const menuItems = document.querySelectorAll(".menu-items");
    const currentPath = window.location.pathname.replace(/\/$/, '');
  
    menuItems.forEach(item => {
        const itemHref = item.querySelector('a').getAttribute('href');
        const itemPath = new URL(itemHref, window.location.origin).pathname.replace(/\/$/, '');

        if (itemHref === '/' && currentPath === '') {
            item.style.fontWeight = 'bold';
        } else if (itemPath === currentPath) {
            item.style.fontWeight = 'bold';            
        }
    
    });
};

  window.onloadHeader();