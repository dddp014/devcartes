document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-items');
    
    menuItems.forEach(item => {
        const itemHref = item.querySelector('a').getAttribute('href');
        const currentPath = window.location.pathname.replace(/\/$/, '');
    
        // 루트 경로 '/'에 대한 처리
        if (currentPath === '' && itemHref === '/') {
            item.classList.add('active');
        } else if (currentPath === itemHref) {
            item.classList.add('active');
        }
    });
});