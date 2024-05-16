 const nav = document.querySelector('#rightNav')
        const icon = document.querySelector('i')
        let toogle = true
        icon.addEventListener('click', () => {
            if (toogle === true) {
                nav.style.display = 'block'
                toogle = false
            } else if (toogle === false) {
                nav.style.display = 'none'
                toogle = true

            }

        })