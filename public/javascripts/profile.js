// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Add active class to the clicked tab and corresponding panel
            this.classList.add('active');
            const panelId = this.getAttribute('data-tab');
            document.getElementById(panelId).classList.add('active');
        });
    });
});
