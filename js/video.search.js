const sort_radio = document.querySelectorAll('input[name="sort"]')
const title_input = document.querySelector('input[name="title"]')
const star_input = document.querySelector('input[name="star"]')
const website_select = document.querySelector('#websites > select')
const category_checkbox = document.querySelectorAll('input[name^="category_"]')
const attributes_checkbox = document.querySelectorAll('input[name^="attribute_"]')
const locations_checkbox = document.querySelectorAll('input[name^="location_"]')

const existing_checkbox = document.querySelector('input[name="existing"]')
const specialchar_checkbox = document.querySelector('input[name="special_char"]')
const exclude_checkbox = document.querySelector('input[name="exclude"]')
const addedToday_checkbox = document.querySelector('input[name="added-today"]')

const loader = document.getElementById('loader')
const updBtn = document.getElementById('update')

function daysToYears(days) {
    return Math.floor(days / 365)
}

// Initialize PrevState for checkbox
$(category_checkbox).attr('data-state', 0)
$(attributes_checkbox).attr('data-state', 0)
$(locations_checkbox).attr('data-state', 0)
// TODO use jQuery.data() instead of JS.setAttribute()/JQuery.attr()
// TODO checkbox style: https://stackoverflow.com/questions/10270987/change-checkbox-check-image-to-custom-image

// ToolTip
$('[data-toggle="tooltip"]').tooltip()

// Pretty DropDown
$('select.pretty').prettyDropdown({
    height: 30,
    classic: true,
    hoverIntent: -1
})

const loadData = function () {
    fetch('json/video.search.php').then(function (jsonData) {
        return jsonData.json()
    }).then(function (data) {
        const wrapper = document.getElementById('videos')

        const row = document.createElement('div')
        row.classList.add('row', 'justify-content-center')

        for (let i = 0, elem = data['videos']; i < elem.length; i++) {
            let thumbnail = elem[i]['thumbnail']

            let existing = elem[i]['existing']

            let videoID = elem[i]['videoID']
            let videoName = elem[i]['videoName']
            let videoDate = elem[i]['videoDate']
            let videoAdded = elem[i]['videoAdded']
            let websiteName = elem[i]['websiteName']
            let siteName = elem[i]['siteName']
            let ageInVideo = elem[i]['ageInVideo']
            let star = elem[i]['star']

            let category = elem[i]['category']
            if (!category.length) category.push('0')

            let attribute = elem[i]['attribute']
            if (!attribute.length) attribute.push('0')

            let location = elem[i]['location']
            if (!location.length) location.push('0')

            let a = document.createElement('a')
            a.classList.add('video', 'ribbon-container', 'card')
            a.href = `video.php?id=${videoID}`
            a.setAttribute('data-video-id', videoID)
            a.setAttribute('data-video-date', videoDate)
            a.setAttribute('data-video-added', videoAdded)
            a.setAttribute('data-ageinvideo', ageInVideo)
            a.setAttribute('data-title', videoName)
            a.setAttribute('data-star', star)
            a.setAttribute('data-website', websiteName)
            a.setAttribute('data-site', siteName)
            a.setAttribute('data-existing', existing)
            a.setAttribute('data-category-name', `["${category}"]`)
            a.setAttribute('data-attribute-name', `["${attribute}"]`)
            a.setAttribute('data-location-name', `["${location}"]`)

            let img = document.createElement('img')
            img.classList.add('lazy', 'card-img-top')
            img.setAttribute('data-src', thumbnail)

            let span = document.createElement('span')
            span.classList.add('title', 'card-title')
            span.textContent = videoName

            a.appendChild(img)
            a.appendChild(span)

            if (ageInVideo) {
                let ribbon = document.createElement('span')
                ribbon.classList.add('ribbon')
                ribbon.textContent = daysToYears(ageInVideo).toString()

                a.appendChild(ribbon)
            }
            row.appendChild(a)
        }
        wrapper.appendChild(row)
    }).then(function () {
        loader.remove()

        window.video = document.getElementsByClassName('video')
        window.video_query = document.querySelectorAll('.video')
        window.videoLength = video.length
        window.$video = $(video)
    }).then(function () {
        setVideoCount(videoLength)

        // Class Change
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    setVideoCount($('.video:visible').length)
                }
            })
        })
        observer.observe($video[0], {attributes: true})

        // TODO observer catches category-null twice when checked, and 0 times when unchecked
        // TODO observer catches 0 times when indeterminate
    }).then(function () {
        /** FILTER **/
        /* Title Search */
        exclude_checkbox.parentElement.addEventListener('click', titleSearch)
        specialchar_checkbox.parentNode.addEventListener('click', titleSearch)
        title_input.addEventListener('keyup', titleSearch)

        function titleSearch() {
            let input = title_input.value.toLowerCase()
            if (specialchar_checkbox.checked) input = input
                .replace(/[<>:/\\|?*%]/g, '')
                .replace(/"/g, "'")
                .replace(/ {2}/g, ' ')

            $video.removeClass('hidden-title')
            if (input.length) {
                if (!exclude_checkbox.checked) {
                    $video.not(function () {
                        return this.getAttribute('data-title').toLowerCase().indexOf(input) > -1
                    }).addClass('hidden-title')
                } else {
                    $video.filter(function () {
                        return this.getAttribute('data-title').toLowerCase().indexOf(input) > -1
                    }).addClass('hidden-title')
                }
            }
        }

        /* Custom Filter */
        addedToday_checkbox.parentNode.addEventListener('click', function () {
            $video.removeClass('hidden-date-added')

            if (addedToday_checkbox.checked) {
                let date_now = new Date().setHours(0, 0, 0, 0)
                $video.filter(function () {
                    let date_item = new Date(this.getAttribute('data-video-added')).setHours(0, 0, 0, 0)

                    return (date_now - date_item)
                }).addClass('hidden-date-added')
            }
        })

        /* Star Search */
        star_input.addEventListener('keyup', function () {
            let input = star_input.value.toLowerCase()
            $video.removeClass('hidden-star')

            $video.not(function () {
                return this.getAttribute('data-star').toLowerCase().indexOf(input) > -1
            }).addClass('hidden-star')
        })

        /* Existing */
        existing_checkbox.addEventListener('change', function () {
            $video.removeClass('hidden-existing')

            if (this.checked) {
                for (let i = 0; i < videoLength; i++) {
                    if (video[i].getAttribute('data-existing') === '0') {
                        video[i].classList.add('hidden-existing')
                    }
                }
            }
        })

        /* Website - Site */
        if (website_select) {
            const prettyWebsite_select = document.querySelectorAll('#websites > .prettydropdown')
            $(prettyWebsite_select).on('change', function () {
                $video.removeClass('hidden-website hidden-site')

                let dropdown = website_select.options[website_select.selectedIndex]
                let selectedWebsite = dropdown.getAttribute('data-wsite')
                let selectedSite = dropdown.getAttribute('data-site')

                for (let i = 0; i < videoLength; i++) {
                    if (selectedWebsite) {
                        let dataWsite = video[i].getAttribute('data-website')
                        let dataSite = video[i].getAttribute('data-site')

                        if (selectedWebsite !== dataWsite) { // not matching wsite
                            video[i].classList.add('hidden-website')
                        } else if (selectedSite && selectedSite !== dataSite) { // site defined & not matching site
                            video[i].classList.add('hidden-site')
                        }
                    }
                }
            })
        }

        /* TODO Category */
        for (let i = 0, wrapperLen = category_checkbox.length; i < wrapperLen; i++) {
            category_checkbox[i].addEventListener('change', function () {
                indeterminateToggle(category_checkbox[i])

                let category = this.name.split('category_').pop()
                let category_class = category.replace(/ /g, '-')

                for (let j = 0; j < videoLength; j++) {
                    let category_arr = video[j].getAttribute('data-category-name').slice(2, -2).split(',')

                    indeterminateHandler(category_arr, category, this, j, true)
                }

                $video.removeClass(`hidden-category-${category_class}`)
                if (this.checked || this.indeterminate) $video.not('[data-tmp]').addClass(`hidden-category-${category_class}`)
                $video.removeAttr('data-tmp')
            })
        }

        /* TODO Attributes */
        for (let i = 0, wrapperLen = attributes_checkbox.length; i < wrapperLen; i++) {
            attributes_checkbox[i].addEventListener('change', function () {
                indeterminateToggle(attributes_checkbox[i])

                let attribute = this.name.split('attribute_').pop()
                let attribute_class = attribute.replace(/ /g, '-')

                for (let j = 0; j < videoLength; j++) {
                    let attribute_arr = video[j].getAttribute('data-attribute-name').slice(2, -2).split(',')

                    for (let k = 0, len = attribute_arr.length; k < len; k++) {
                        if (this.checked && (attribute_arr[k] === attribute)) {
                            tmp(j)
                            break
                        } else if (this.indeterminate && attribute_arr.indexOf(attribute) === -1) {
                            tmp(j)
                            break
                        }
                    }
                }

                $video.removeClass(`hidden-attribute-${attribute_class}`)
                if (this.checked || this.indeterminate) $video.not('[data-tmp]').addClass(`hidden-attribute-${attribute_class}`)
                $video.removeAttr('data-tmp') // remove leftover classes
            })
        }

        /* TODO Location */
        for (let i = 0, wrapperLen = locations_checkbox.length; i < wrapperLen; i++) {
            locations_checkbox[i].addEventListener('change', function () {
                indeterminateToggle(locations_checkbox[i])

                let location = this.name.split('location_').pop()
                let location_class = location.replace(/ /g, '-')

                for (let j = 0; j < videoLength; j++) {
                    let location_arr = video[j].getAttribute('data-location-name').slice(2, -2).split(',')

                    /*for (let k = 0, len = location_arr.length; k < len; k++) {
                        if (this.checked && (location_arr[k] === location)) {
                            tmp(j)
                            break
                        } else if (this.indeterminate && location_arr[k].indexOf(location) === -1) {
                            tmp(j)
                            break
                        }
                    }*/

                    indeterminateHandler(location_arr, location, this, j)
                }

                $video.removeClass(`hidden-location-${location_class}`)
                if (this.checked || this.indeterminate) $video.not('[data-tmp]').addClass(`hidden-location-${location_class}`)
                $video.removeAttr('data-tmp') // remove leftover classes
            })
        }

        /** SORT **/
        /* Sort Radio */
        for (let i = 0; i < sort_radio.length; i++) {
            sort_radio[i].addEventListener('change', function () {
                $(sort_radio).parent().removeClass('selected')
                sort_radio[i].parentElement.classList.add('selected')

                let label = this.id

                let alphabetically = (a, b) => {
                    let valA = a.querySelector('span').innerHTML.toLowerCase()
                    let valB = b.querySelector('span').innerHTML.toLowerCase()

                    return valA.localeCompare(valB, 'en')
                }

                let alphabetically_reverse = (a, b) => alphabetically(b, a)

                let added_alt = (a, b) => {
                    return a.getAttribute('data-video-id') - b.getAttribute('data-video-id')
                }

                let added_reverse_alt = (a, b) => added_alt(b, a)

                let added = (a, b) => {
                    return new Date(a.getAttribute('data-video-added')) - new Date(b.getAttribute('data-video-added'))
                }

                let added_reverse = (a, b) => added(b, a)

                let actor_age = (a, b) => {
                    return a.getAttribute('data-ageinvideo') - b.getAttribute('data-ageinvideo')
                }

                let actor_age_reverse = (a, b) => actor_age(b, a)

                let video_date = function (a, b) {
                    return new Date(a.getAttribute('data-video-date')) - new Date(b.getAttribute('data-video-date'))
                }

                let video_date_reverse = (a, b) => video_date(b, a)

                let star = (a, b) => {
                    let valA = a.getAttribute('data-star').toLowerCase()
                    let valB = b.getAttribute('data-star').toLowerCase()

                    return valA.localeCompare(valB, 'en')
                }

                let star_reverse = (a, b) => star(b, a)

                let site = (a, b) => {
                    let valA = `${a.getAttribute('data-website')}_${a.getAttribute('data-site')}`
                    let valB = `${b.getAttribute('data-website')}_${b.getAttribute('data-site')}`

                    return valA.toLowerCase().localeCompare(valB.toLowerCase(), 'en')
                }

                let site_reverse = (a, b) => site(b, a)

                switch (label) {
                    case 'alphabetically':
                        $video.sort(alphabetically)
                        break
                    case 'alphabetically_desc':
                        $video.sort(alphabetically_reverse)
                        break
                    case 'added':
                        $video.sort(added_alt)
                        break
                    case 'added_desc':
                        $video.sort(added_reverse_alt)
                        break
                    case 'date':
                        $video.sort(video_date)
                        break
                    case 'date_desc':
                        $video.sort(video_date_reverse)
                        break
                    case 'actor-age':
                        $video.sort(actor_age)
                        break
                    case 'actor-age_desc':
                        $video.sort(actor_age_reverse)
                        break
                    case 'star':
                        $video.sort(star)
                        break
                    case 'star_desc':
                        $video.sort(star_reverse)
                        break
                    case 'site':
                        $video.sort(site)
                        break
                    case 'site_desc':
                        $video.sort(site_reverse)
                        break
                    default:
                        console.log(`No sort method for: ${label}`)
                }

                for (let i = 0; i < videoLength; i++) {
                    $video[i].parentNode.appendChild($video[i])
                }
            })
        }
    }).then(function () {
        new LazyLoad({
            elements_selector: '.lazy',
            threshold: 300
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
    $('.video').remove()
}

function setVideoCount(length) {
    document.getElementById('video-count').textContent = length
}

function tmp(index) {
    video[index].setAttribute('data-tmp', '')
}

function indeterminateToggle(el) {
    switch (el.getAttribute('data-state')) {
        case '0': // checked
            el.setAttribute('data-state', '1')
            el.indeterminate = false
            el.checked = true

            // Set Label Class
            el.parentElement.classList.add('selected')
            break
        case '1': // indeterminate
            el.setAttribute('data-state', '-1')
            el.indeterminate = true
            el.checked = false

            // Set Label Class
            el.parentElement.classList.add('not')

            // Remove Label Class
            el.parentElement.classList.remove('selected')
            break
        case '-1': // not-checked
            el.setAttribute('data-state', '0')
            el.indeterminate = false
            el.checked = false

            // Remove Label Classes
            el.parentElement.classList.remove('not')
            break
    }
}

function indeterminateHandler(arr, item, parent, index, test = false) {
    if (!test) {
        for (let k = 0, len = arr.length; k < len; k++) {
            if ((parent.checked && (arr[k] === item)) || (parent.indeterminate && arr[k].indexOf(item) === -1)) {
                tmp(index)
                break
            }
        }
    } else {
        for (let k = 0, len = arr.length; k < len; k++) {
            console.log(parent.checked)
            if (parent.checked) {
                if ((item === 'NULL' && len === 1 && arr[k] === '0') || (arr[k] === item)) {
                    tmp(index)
                    break
                }
            } else if (parent.indeterminate) {
                if (item === 'NULL') {
                    if (arr.indexOf("0") === -1) {
                        tmp(index)
                        break
                    }
                } else if (arr.indexOf(item) === -1) {
                    tmp(index)
                    break
                }
            }
        }
    }
}