// popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners for mouse interactions
    const contentElement = document.querySelector('body');

    contentElement.addEventListener('click', function (event) {
        // Handle click events here
        console.log('Mouse clicked at:', event.clientX, event.clientY);
    });

    contentElement.addEventListener('mousemove', function (event) {
        // Handle mousemove events here
        console.log('Mouse moved to:', event.clientX, event.clientY);
    });

    // Add more event listeners as needed
});
