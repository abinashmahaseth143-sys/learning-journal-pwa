// Facebook Share Functionality
document.addEventListener('DOMContentLoaded', function() {
    const facebookShareBtn = document.getElementById('facebook-share');
    
    if (facebookShareBtn) {
        facebookShareBtn.addEventListener('click', function() {
            // Get the current page URL
            const currentUrl = encodeURIComponent(window.location.href);
            
            // Create Facebook share URL
            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
            
            // Open share dialog in a new window
            window.open(facebookShareUrl, 'facebook-share-dialog', 
                'width=800,height=600,resizable=yes,scrollbars=yes');
        });
    }
});