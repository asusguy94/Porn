const label_input = document.getElementsByTagName('label')

const star_input = document.querySelector('input[name="star-name"]')

const breast_radio = document.querySelectorAll('input[name="breast"]')
const hair_radio = document.querySelectorAll('input[name="hair"]')
const ethnicity_radio = document.querySelectorAll('input[name="ethnicity"]')
const country_select = document.querySelector('#countries > select')

const website_select = document.querySelector('#websites > select')
const websiteEx_select = document.querySelector('#websites_exclude > select')

const sort_radio = document.querySelectorAll('input[name="sort"]')

const exclude_checkbox = document.querySelector('input[name="exclude"]')

const loader = document.getElementById('loader')
const updBtn = document.getElementById('update')

function daysToYears(days) {
    return Math.floor(days / 365)
}

// ToolTip
$('[data-toggle="tooltip"]').tooltip()

// Pretty DropDown
$('select.pretty').prettyDropdown({
    height: 30,
    classic: true,
    hoverIntent: -1
})

const loadData = function () {
    fetch('json/star.search.php').then(function (jsonData) {
        return jsonData.json()
    }).then(function (data) {
        const wrapper = document.getElementById('stars')

        const row = document.createElement('div')
        row.classList.add('row')

        const elem = data['stars']
        for (let i = 0; i < elem.length; i++) {
            let starID = elem[i]['starID']
            let starName = elem[i]['starName']
            let breast = elem[i]['breast']
            let hair = elem[i]['hair']
            let ethnicity = elem[i]['ethnicity']
            let country = elem[i]['country']
            let starAge = elem[i]['age']

            let videoCount = elem[i]['videoCount']
            let thumbnail = `images/stars/${elem[i]['image']}`

            let website = elem[i]['website']
            let site = elem[i]['site']

            let a = document.createElement('a')
            a.classList.add('star', 'card')
            a.style.display = 'inline-block'
            a.href = `star.php?id=${starID}`
            a.setAttribute('data-star-id', starID)
            a.setAttribute('data-badge', videoCount)
            a.setAttribute('data-age', starAge)
            a.setAttribute('data-breast', breast)
            a.setAttribute('data-country', breast)
            a.setAttribute('data-hair', hair)
            a.setAttribute('data-ethnicity', ethnicity)
            a.setAttribute('data-country', country)
            a.setAttribute('data-website-name', `["${website}"]`)
            a.setAttribute('data-site-name', `["${site}"]`)
            a.classList.add(`badge-${'x'.repeat(videoCount.length)}`)

            let img = document.createElement('img')
            img.classList.add('card-img-top')
            if(elem[i]['image'].length) {
                img.classList.add('lazy')
                img.setAttribute('data-src', thumbnail)
            }
            img.style.width = '200px'
            img.style.height = '275px'

            let span = document.createElement('span')
            span.classList.add('name', 'card-title')
            span.textContent = starName

            a.appendChild(img)
            a.appendChild(span)

            if (starAge) {
                let ribbon = document.createElement('span')
                ribbon.classList.add('ribbon')
                ribbon.textContent = daysToYears(starAge).toString()

                a.appendChild(ribbon)
            }
            row.appendChild(a)
        }
        wrapper.appendChild(row)
    }).then(function () {
        loader.remove()

        window.stars = document.getElementsByClassName('star')
        window.starLength = stars.length

        window.$stars = $(stars)
    }).then(function () {
        setStarCount(starLength)

        // Class Change
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    setStarCount($('.star:visible').length)
                }
            })
        })
        observer.observe($stars[0], {attributes: true})
    }).then(function () {
        /** Label Click **/
        for (let i = 0; i < label_input.length; i++) {
            label_input[i].addEventListener('click', function () {
                $(label_input[i].previousSibling).click()
            })
        }

        /* Star Search */
        exclude_checkbox.parentNode.addEventListener('click', starSearch)
        star_input.addEventListener('keyup', starSearch)

        function starSearch() {
            let input = star_input.value.toLowerCase()
            $stars.removeClass('hidden-name')

            if (input.length) {
                if (!exclude_checkbox.checked) {
                    $stars.not(function () {
                        return $(this).find('.name').text().toLowerCase().indexOf(input) > -1
                    }).addClass('hidden-name')
                } else {
                    $stars.filter(function () {
                        return $(this).find('.name').text().toLowerCase().indexOf(input) > -1
                    }).addClass('hidden-name')
                }
            }
        }

        /* Breast Radio Buttons */
        for (let i = 0, wrapperLen = breast_radio.length; i < wrapperLen; i++) {
            let selectedBreast = $('#breasts label').eq(i).text()

            //countBreast(selectedBreast, i)
            breast_radio[i].addEventListener('click', function () {
                $(breast_radio).parent().removeClass('selected')
                breast_radio[i].parentElement.classList.add('selected')

                $stars.removeClass('hidden-breast')

                for (let j = 0; j < starLength; j++) {
                    let breast = stars[j].getAttribute('data-breast')
                    if (selectedBreast !== 'NULL' && breast !== selectedBreast) {
                        stars[j].classList.add('hidden-breast')
                    } else if (selectedBreast === 'NULL' && breast !== '') {
                        stars[j].classList.add('hidden-breast')
                    }
                }

                //countBreast(selectedBreast, i)
            })

            breast_radio[i].oncontextmenu = function () {
                $(breast_radio).parent().removeClass('selected')
                $stars.removeClass('hidden-breast')
                for (let j = 0; j < wrapperLen; j++) {
                    breast_radio[j].checked = false
                }
                return false
            }
        }

        function countBreast(selectedBreast, i) {
            $(breast_radio).eq(i).find('count').remove()

            let count = 0
            for (let j = 0; j < starLength; j++) {
                let el = stars[j]
                let breast = el.getAttribute('data-breast')

                // check if element has class starting with .hidden
                // exclude if element has .hidden-breast
                if (breast === selectedBreast) {
                    let check = $(el).not('[class*="hidden"]').length
                    if (check) count++
                }
            }

            if (count) {
                let countEl = document.createElement('span')
                countEl.classList.add('count')
                countEl.textContent = count.toString()
                breast_radio[i].parentNode.append(countEl)
            }
        }

        /* Hair Radio Buttons */
        for (let i = 0, wrapperLen = hair_radio.length; i < wrapperLen; i++) {
            hair_radio[i].addEventListener('change', function () {
                $(hair_radio).parent().removeClass('selected')
                hair_radio[i].parentElement.classList.add('selected')

                $stars.removeClass('hidden-hair')
                let selectedHair = $('#hair label').eq(i).text()

                for (let j = 0; j < starLength; j++) {
                    let hair = stars[j].getAttribute('data-hair')
                    if (selectedHair !== 'NULL' && hair !== selectedHair) {
                        stars[j].classList.add('hidden-hair')
                    } else if (selectedHair === 'NULL' && hair !== '') {
                        stars[j].classList.add('hidden-hair')
                    }
                }
            })

            hair_radio[i].oncontextmenu = function () {
                $(hair_radio).parent().removeClass('selected')
                $stars.removeClass('hidden-hair')
                for (let j = 0; j < wrapperLen; j++) {
                    hair_radio[j].checked = false
                }
                return false
            }
        }

        /* Ethnicity Radio Buttons */
        for (let i = 0, wrapperLen = ethnicity_radio.length; i < wrapperLen; i++) {
            ethnicity_radio[i].addEventListener('change', function () {
                $(ethnicity_radio).parent().removeClass('selected')
                ethnicity_radio[i].parentElement.classList.add('selected')

                $stars.removeClass('hidden-ethnicity')
                let selectedEthnicity = $('#ethnicity label').eq(i).text()

                for (let j = 0; j < starLength; j++) {
                    let ethnicity = stars[j].getAttribute('data-ethnicity')
                    if (selectedEthnicity !== 'NULL' && ethnicity !== selectedEthnicity) {
                        stars[j].classList.add('hidden-ethnicity')
                    } else if (selectedEthnicity === 'NULL' && ethnicity !== '') {
                        stars[j].classList.add('hidden-ethnicity')
                    }
                }
            })

            ethnicity_radio[i].oncontextmenu = function () {
                $(ethnicity_radio).parent().removeClass('selected')
                $stars.removeClass('hidden-ethnicity')
                for (let j = 0; j < wrapperLen; j++) {
                    ethnicity_radio[j].checked = false
                }
                return false
            }
        }

        /* Country */
        if (country_select) {
            const prettyCountry_select = document.querySelectorAll('#countries > .prettydropdown')
            $(prettyCountry_select).on('change', function () {
                $stars.removeClass('hidden-country')

                let selectedCountry = country_select.options[country_select.selectedIndex].textContent
                for (let i = 0; i < starLength; i++) {
                    if ((stars[i].getAttribute('data-country') !== selectedCountry) && selectedCountry !== 'All') {
                        stars[i].classList.add('hidden-country')
                    }
                }
            })
        }

        /* Website - Site */
        if (website_select) {
            const prettyWebsite_select = document.querySelectorAll('#websites > .prettydropdown')
            $(prettyWebsite_select).on('change', function () {
                $stars.removeClass('hidden-website hidden-site')

                let dropdown = website_select.options[website_select.selectedIndex]
                let selectedWebsite = dropdown.getAttribute('data-wsite')
                let selectedSite = dropdown.getAttribute('data-site')

                for (let i = 0; i < starLength; i++) {
                    if (selectedWebsite) {
                        let dataWsite_arr = stars[i].getAttribute('data-website-name').slice(2, -2).split(',')
                        let dataSite_arr = stars[i].getAttribute('data-site-name').slice(2, -2).split(',')

                        if (dataWsite_arr.indexOf(selectedWebsite) === -1) {
                            stars[i].classList.add('hidden-website')
                        } else if (selectedSite && (dataSite_arr.indexOf(selectedSite) === -1)) {
                            stars[i].classList.add('hidden-site')
                        }
                    }
                }
            })
        }

        /* Website (Exclude) */
        if (websiteEx_select) {
            const prettyWebsiteEx_select = document.querySelectorAll('#websites_exclude > .prettydropdown')
            $(prettyWebsiteEx_select).on('change', function () {
                $stars.removeClass('hidden-website-exclude')

                let dropdown = websiteEx_select.options[websiteEx_select.selectedIndex]
                let selectedWebsite = dropdown.getAttribute('data-wsite')

                for (let i = 0; i < starLength; i++) {
                    if (selectedWebsite) {
                        let dataWsite_arr = stars[i].getAttribute('data-website-name').slice(2, -2).split(',')
                        if (dataWsite_arr.indexOf(selectedWebsite) !== -1) {
                            stars[i].classList.add('hidden-website-exclude')
                        }
                    }
                }
            })
        }

        /** SORT **/
        /* Sort Radio */
        for (let i = 0; i < sort_radio.length; i++) {
            sort_radio[i].addEventListener('change', function () {
                $(sort_radio).parent().removeClass('selected')
                sort_radio[i].parentElement.classList.add('selected')

                let label = this.id

                let alphabetically = function (a, b) {
                    return a.querySelector('span').textContent.toLowerCase().localeCompare(b.querySelector('span').textContent.toLowerCase(), 'en')
                }

                let alphabetically_reverse = function (a, b) {
                    return b.querySelector('span').textContent.toLowerCase().localeCompare(a.querySelector('span').textContent.toLowerCase(), 'en')
                }

                let added = function (a, b) {
                    return a.getAttribute('data-star-id') - b.getAttribute('data-star-id')
                }

                let added_reverse = function (a, b) {
                    return b.getAttribute('data-star-id') - a.getAttribute('data-star-id')
                }

                let actor_age = function (a, b) {
                    return a.getAttribute('data-age') - b.getAttribute('data-age')
                }

                let actor_age_reverse = function (a, b) {
                    return b.getAttribute('data-age') - a.getAttribute('data-age')
                }

                let video_count = function (a, b) {
                    return a.getAttribute('data-badge') - b.getAttribute('data-badge')
                }

                let video_count_reverse = function (a, b) {
                    return b.getAttribute('data-badge') - a.getAttribute('data-badge')
                }


                switch (label) {
                    case 'alphabetically':
                        $stars.sort(alphabetically)
                        break
                    case 'alphabetically_desc':
                        $stars.sort(alphabetically_reverse)
                        break
                    case 'added':
                        $stars.sort(added)
                        break
                    case 'added_desc':
                        $stars.sort(added_reverse)
                        break
                    case 'actor-age':
                        $stars.sort(actor_age)
                        break
                    case 'actor-age_desc':
                        $stars.sort(actor_age_reverse)
                        break
                    case 'videocount':
                        $stars.sort(video_count)
                        break
                    case 'videocount_desc':
                        $stars.sort(video_count_reverse)
                        break
                    default:
                        console.log(`No sort method for: ${label}`)
                }

                for (let i = 0; i < starLength; i++) {
                    $stars[i].parentNode.appendChild($stars[i])
                }
            })
        }
    }).then(function () {
        new LazyLoad({
            elements_selector: '.lazy'
        })
    })
}

loadData()

updBtn.addEventListener('click', function () {
    resetData()
    loadData()
})

/* TODO Does not reset sidebar */
function resetData() {
    $('.star').remove()
}

function setStarCount(length) {
    document.getElementById('video-count').textContent = length
}