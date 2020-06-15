document.addEventListener('DOMContentLoaded', function () {
        const urlObj = new URL(location.href).searchParams
        const AUTO = urlObj.get('auto')
        const autoBtn = document.getElementsByName('auto')[0]

        const inputField = document.querySelector('input[name="star"]')
        const inputText = document.querySelectorAll('p.missing .name')

        if (inputText.length) {
            let data = inputText[0].textContent

            inputField.value = data
            if (AUTO === '1') {
                if (localStorage.current !== data) {
                    localStorage.current = data
                    $('input[name="addStar"]')[0].click()
                } else {
                    resetUrl()
                }
            }
        } else if (AUTO === '1') {
            resetUrl()
        }

        autoBtn.addEventListener('change', function () {
            if (this.checked) location.href = '?auto=1'
            else resetUrl()
        })
    }
)

function resetUrl() {
    localStorage.removeItem('current')
    location.href = location.pathname
}