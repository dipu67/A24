// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    const form = document.querySelector('#uploadImg')
    const file = document.querySelector('#profilePic')
    const editprofileBtn = document.querySelector('#editprofileBtn')
    const editprofileContainer = document.querySelector('#editprofileContainer')
    const close = document.querySelector('.close')

    editprofileBtn.addEventListener('click',()=>{
        editprofileContainer.style.display= 'flex'

    })
    close.addEventListener('click',()=>{
        editprofileContainer.style.display= 'none'

    })
    window.addEventListener('click',(event)=>{
        if(event.target == editprofileContainer){
            editprofileContainer.style.display= 'none'
        }

    })

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
