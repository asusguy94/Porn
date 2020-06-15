const videoWrapper = document.getElementById('video')
const videoPlayer = document.getElementsByTagName('video')[0]
const hlsSource = document.querySelector('source[data-type="hls"]')
const dashSource = document.querySelector('source[data-type="dash"]')
const videoID = new URL(location.href).searchParams.get('id')

const vtt_source = `vtt/${videoID}.vtt`
const bookmark = document.getElementsByClassName('bookmark')
const videoTitle = document.getElementById('video-name')

const relatedVideosSection = false

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 9) {
        e.preventDefault()
        $('#next')[0].click()
    }
})

function getTime() {
    let seconds = videoPlayer.currentTime
    if (typeof localStorage.bookmark !== "undefined" && localStorage.video === videoID) {
        seconds = Number(localStorage.bookmark)
    }

    return seconds
}

function videoStats() {
    let seconds = getTime()

    if (localStorage.video !== videoID) {
        localStorage.video = videoID
        localStorage.bookmark = seconds
        localStorage.playing = 0

        $(videoPlayer).one('play', function () {
            addPlay()
        })
    }

    if (seconds) videoPlayer.currentTime = seconds
    if (localStorage.playing === "1") {
        setTimeout(function () {
            videoPlayer.play()
        }, 100)
    }
}

const plyrPlayer = new Plyr(videoPlayer, {
    controls: ['play-large', 'play', 'current-time', 'progress', 'duration', 'settings', 'fullscreen'],
    settings: ['custom-quality'],
    ratio: '21:9',
    invertTime: false,
    toggleInvert: false,
    seekTime: 1,
    previewThumbnails: {enabled: !!$('#vtt').length, src: vtt_source},
    hideControls: false // never hide controls
})

if (dashSource) {
    const dash = dashjs.MediaPlayer().create()
    const url = dashSource.getAttribute('src')
    dash.initialize(videoPlayer, url, false)
} else if (hlsSource && Hls.isSupported()) {
    const hls = new Hls({autoStartLoad: false})
    hls.loadSource(hlsSource.getAttribute('src'))
    hls.attachMedia(videoPlayer)

    hls.on(Hls.Events.MANIFEST_PARSED, (e, data) => {
        const dataLevels = data['levels'].length - 1

        let levels = {360: 0, 480: 1, 720: 2, 1080: 3}
        let maxStartLevel = levels[720]
        let maxLevel = levels[720]

        let desiredStartLevel = maxLevel - 1
        if (desiredStartLevel > maxStartLevel) desiredStartLevel = maxStartLevel
        if (desiredStartLevel > dataLevels) desiredStartLevel = dataLevels - 1
        if (desiredStartLevel < 0) desiredStartLevel = 0

        hls.startLevel = desiredStartLevel
        hls.autoLevelCapping = maxLevel
        hls.startLoad(getTime())
    })
}

videoWrapper.addEventListener('wheel', function (e) {
    e.preventDefault()

    let speed = 10
    if (e.deltaY < 0) plyrPlayer.forward(speed)
    else plyrPlayer.rewind(speed)
})

videoPlayer.addEventListener('timeupdate', () => {
    localStorage.bookmark = Math.round(videoPlayer.currentTime)
})

videoPlayer.addEventListener('playing', () => {
    localStorage.playing = 1
})

videoPlayer.addEventListener('pause', () => {
    localStorage.playing = 0
})

$(bookmark).on('click', function () {
    playFrom(this.getAttribute('data-bookmark-time'))
})

autoComplete()

bookmarkCollision()
onFocus(videoStats)

document.onkeydown = e => {
    e = e || window.event

    if (!$('input').is(':focus')) {
        switch (e.keyCode) {
            case 37:
                plyrPlayer.rewind()
                break
            case 39:
                plyrPlayer.forward()
                break
            case 32:
                playPause()
                break
        }
    }
}

const playPause = () => {
    if (!isPlaying()) videoPlayer.play()
    else videoPlayer.pause()
}

const isPlaying = () => !videoPlayer.paused

const playFrom = seconds => {
    videoPlayer.currentTime = seconds
    videoPlayer.play()
}

const addPlay = () => {
    ajax('ajax/video_addplay.php', [
        {'videoID': videoID}
    ], () => {
        console.log('play added')
    })
}

const fixDate = () => {
    ajax('ajax/fix_date.php', [
        {'videoID': videoID}
    ], (data) => {
        let dateEl = document.getElementsByClassName('date')[0]
        dateEl.textContent = data.responseText
    })
}

const fixSite = () => {
    ajax('ajax/fix_site.php', [
        {'videoID': videoID}
    ], (data) => {
        console.log(data.responseText)
    })
}

const addLocation = locationID => {
    ajax('ajax/add_videolocation.php', [
        {'videoID': videoID},
        {'locationID': locationID}
    ])
}

const removeLocation = locationID => {
    ajax('ajax/remove_videolocation.php', [
        {'videoID': videoID},
        {'locationID': locationID}
    ], () => {
        let locationEl = document.querySelector(`.location[data-location-id="${locationID}"]`)
        locationEl.remove()
    })
}

const addAttribute = attributeID => {
    ajax('ajax/add_videoattribute.php', [
        {'videoID': videoID},
        {'attributeID': attributeID}
    ])
}

const removeAttribute = attributeID => {
    ajax('ajax/remove_videoattribute.php', [
        {'videoID': videoID},
        {'attributeID': attributeID}
    ], () => {
        let attributeEl = document.querySelector(`.attribute[data-attribute-id="${attributeID}"]`)
        attributeEl.remove()
    })
}

const renameVideo = videoName => {
    ajax('ajax/rename_video.php', [
        {'videoID': videoID},
        {'videoName': videoName}
    ])
}

const renameFile = videoPath => {
    ajax('ajax/rename_file.php', [
        {'videoID': videoID},
        {'videoPath': videoPath}
    ])
}

const addBookmark = (categoryID, categoryName) => {
    let seconds = Math.round(videoPlayer.currentTime)
    localStorage.bookmark = seconds

    ajax('ajax/add_bookmark.php', [
        {'seconds': seconds},
        {'categoryID': categoryID},
        {'videoID': videoID}
    ], (data) => {
        if (!$('#timeline').length) {
            let div = document.createElement('div')
            div.id = 'timeline'

            insertBefore(document.getElementById('videoDetails'), div)
        }
        let wrapper = document.getElementById('timeline')

        addBookmarkCore(wrapper, data, seconds, categoryID, categoryName)
    })
}

const bookmark_editCategory = (bookmarkID, categoryID) => {
    ajax('ajax/bookmark_editCategory.php', [
        {'bookmarkID': bookmarkID},
        {'categoryID': categoryID}
    ])
}

const bookmark_editTime = bookmarkID => {
    let seconds = Math.round(videoPlayer.currentTime)
    localStorage.bookmark = seconds

    ajax('ajax/bookmark_editTime.php', [
        {'bookmarkID': bookmarkID},
        {'seconds': seconds}
    ], () => {
        let btn = document.querySelector(`.bookmark[data-bookmark-id="${bookmarkID}"]`)
        btn.style.marginLeft = `${getOffset(seconds)}%`
        btn.setAttribute('data-bookmark-time', seconds.toString())

        animation('checkbox.png')
        bookmarkCollision()
    })
}

const removeBookmark = id => {
    ajax('ajax/remove_bookmark.php', [
        {'id': id}
    ])
}

const removeBookmarks = () => {
    ajax('ajax/remove_bookmarks.php', [
        {'videoID': videoID}
    ])
}

const removeVideoCategory = (videoID, categoryID) => {
    ajax('ajax/remove_videocategory.php', [
        {'videoID': videoID},
        {'categoryID': categoryID}
    ])
}

const removeVideoStar = (videoID, starID) => {
    ajax('ajax/remove_videostar.php', [
        {'videoID': videoID},
        {'starID': starID}
    ])
}

const addCategory_and_bookmark = (categoryID, categoryName) => {
    $('#dialog').dialog('close')

    let seconds = Math.round(videoPlayer.currentTime)
    localStorage.bookmark = seconds

    ajax('ajax/add_category_and_bookmark.php', [
        {'videoID': videoID},
        {'categoryID': categoryID},
        {'seconds': seconds}
    ], (data) => {
        if (!$('#timeline').length) {
            let div = document.createElement('div')
            div.id = 'timeline'

            insertBefore(document.getElementById('videoDetails'), div)
        }
        let wrapper = document.getElementById('timeline')

        if (!$('#categories').length) {
            let div = document.createElement('div')
            div.id = 'categories'

            insertBefore(document.querySelector('#videoDetails > div[style]'), div)
        }
        let categoriesWrapper = document.getElementById('categories')

        if (!$(`.category[data-category-id="${categoryID}"]`).length && !relatedVideosSection) {
            let cat = document.createElement('a')
            cat.classList.add('category', 'btn')
            cat.setAttribute('data-category-id', categoryID)
            cat.href = `category.php?id=${categoryID}`
            cat.textContent = categoryName

            categoriesWrapper.appendChild(cat)
        } else {
            location.reload() // This is required in so that the "Related"-section updates
        }

        addBookmarkCore(wrapper, data, seconds, categoryID, categoryName)
    })
}

const generateThumbnail = () => {
    ajax('ajax/video_generatethumbnail.php',
        {'videoID': videoID}
    )
}

const removeVideo = () => {
    animation('delete.png', 300, -1)

    ajax('ajax/remove_video.php', [
        {'videoID': videoID}
    ])
}

const setAge = age => {
    ajax('ajax/video_age.php', [
        {'videoID': videoID},
        {'age': age}
    ])
}

function ajax(url, params, callback = () => {
    location.href = `${location.href}`
}) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    if (params.length) {
        let data = new FormData()
        for (let i = 0; i < params.length; i++) {
            let param = params[i]

            let key = Object.keys(param)[0]
            let val = param[key]

            data.append(key, val)
        }
        xhr.send(data)
    } else {
        xhr.send()
    }

    xhr.onload = function () {
        callback(this)
    }
}

/* Context Menu */
/* Title */
$(function () {
    $.contextMenu({
        selector: '#video > #video-title > #video-name',
        items: {
            'rename_title': {
                name: 'Rename',
                icon: 'edit',
                callback: function () {
                    const dialogWrapper = document.createElement('div')
                    dialogWrapper.id = 'dialog'
                    dialogWrapper.title = 'Edit Video'

                    document.body.appendChild(dialogWrapper)
                    $(function () {
                        const dialogQuery = $('#dialog')
                        dialogQuery.dialog({
                            close: function () {
                                $(this).dialog('close')
                                this.closest('.ui-dialog').remove()
                            },
                            width: 500
                        })

                        const dialogInput = document.createElement('input')
                        dialogInput.type = 'text'
                        dialogInput.name = 'videoName_edit'
                        dialogInput.value = videoTitle.textContent

                        dialogQuery.append(dialogInput)
                        dialogInput.focus()

                        document.querySelector('input[name="videoName_edit"]').addEventListener('keydown', function (e) {
                            if (e.keyCode === 13) {
                                renameVideo(this.value)
                            }
                        })
                    })
                }
            }, 'add_attribute': {
                name: 'Add Attribute',
                icon: 'fas fa-tag',
                callback: function () {
                    const dialogWrapper = document.createElement('div')
                    dialogWrapper.id = 'dialog'
                    dialogWrapper.title = 'Add Attrubute'

                    document.body.appendChild(dialogWrapper)
                    $(function () {
                        const dialogQuery = $('#dialog')
                        dialogQuery.dialog({
                            close: function () {
                                $(this).dialog('close')
                                this.closest('.ui-dialog').remove()
                            },
                            width: 250,
                            position: {my: "top", at: "top+150"}
                        })

                        searchField(dialogQuery)
                        const query = $('#attributes.hidden > .attribute')
                        for (let i = 0; i < query.length; i++) {
                            let attributeID = query.eq(i).attr('data-attribute-id')
                            let attributeName = query.eq(i).text()

                            let btn = document.createElement('div')
                            btn.classList.add('btn', 'unselectable')
                            btn.onclick = function () {
                                addAttribute(attributeID)
                            }
                            btn.textContent = attributeName

                            dialogQuery.append(btn)
                        }
                        searchData()
                    })
                }
            }, 'add_location': {
                name: 'Add Location',
                icon: 'fas fa-map-marker-alt',
                callback: function () {
                    const dialogWrapper = document.createElement('div')
                    dialogWrapper.id = 'dialog'
                    dialogWrapper.title = 'Add Location'

                    document.body.appendChild(dialogWrapper)
                    $(function () {
                        const dialogQuery = $('#dialog')
                        dialogQuery.dialog({
                            close: function () {
                                $(this).dialog('close')
                                this.closest('.ui-dialog').remove()
                            },
                            width: 250,
                            position: {my: "top", at: "top+150"}
                        })

                        searchField(dialogQuery)

                        const query = $('#locations.hidden > .location')
                        for (let i = 0; i < query.length; i++) {
                            let locationID = query.eq(i).attr('data-location-id')
                            let locationName = query.eq(i).text()

                            let btn = document.createElement('div')
                            btn.classList.add('btn', 'unselectable')
                            btn.onclick = function () {
                                addLocation(locationID)
                            }
                            btn.textContent = locationName

                            dialogQuery.append(btn)
                        }

                        searchData()
                    })
                }
            }, 'divider': '---',
            'copy_title': {
                name: 'Copy Title',
                icon: 'copy',
                callback: function (itemKey, options) {
                    let data = options.$trigger.text()

                    setClipboard(data)
                }
            },
            'copy_star': {
                name: 'Copy Star',
                icon: 'fas fa-user',
                callback: function () {
                    let source = $(videoPlayer).find('source').not('[type="video/webm"], [type="application/x-mpegURL"]').first().attr('src')

                    let fname = source.substring(source.lastIndexOf('/') + 1, source.length)
                    let starName = fname.substring(fname.indexOf(']') + 1, fname.indexOf('_')).trim()
                    setClipboard(starName)
                }
            }
        }
    })
})
/* Site & wSite */
$(function () {
    $.contextMenu({
        selector: '#video-site',
        items: {
            'update_site': {
                name: 'Fix Website & Site',
                icon: 'fas fa-sync-alt',
                callback: function () {
                    fixSite()
                }
            }
        }
    })
})
/* Bookmarks */
$(function () {
    $.contextMenu({
        selector: '.bookmark',
        items: {
            'edit': {
                name: 'Change Category',
                icon: 'edit',
                callback: function (itemKey, options) {
                    let bookmarkID = options.$trigger.attr('data-bookmark-id')
                    let bookmarkName = options.$trigger.text().trim()

                    const dialogWrapper = document.createElement('div')
                    dialogWrapper.id = 'dialog'
                    dialogWrapper.title = 'Change Category'

                    document.body.appendChild(dialogWrapper)
                    $(function () {
                        const dialogQuery = $('#dialog')
                        dialogQuery.dialog({
                            close: function () {
                                $(this).dialog('close')
                                this.closest('.ui-dialog').remove()
                            },
                            width: 250,
                            position: {my: "top", at: "top+150"}
                        })

                        searchField(dialogQuery)

                        const query = $('#category_list > option')
                        for (let i = 0; i < query.length; i++) {
                            let category = query.eq(i)
                            let categoryID = category.attr('data-category-id')
                            let categoryName = category.attr('value')

                            if (categoryName !== bookmarkName) {
                                let btn = document.createElement('div')
                                btn.classList.add('btn', 'unselectable')
                                btn.onclick = function () {
                                    bookmark_editCategory(bookmarkID, categoryID)
                                }
                                btn.textContent = categoryName

                                dialogQuery.append(btn)
                            }
                        }

                        searchData()
                    })
                }
            }, 'edit_time': {
                name: 'Change Time',
                icon: 'far fa-clock',
                callback: function (itemKey, options) {
                    bookmark_editTime(options.$trigger.attr('data-bookmark-id'))
                }
            },
            'divider': '---',
            'delete': {
                name: 'Delete',
                icon: 'delete',
                callback: function (itemKey, options) {
                    let id = options.$trigger.attr('data-bookmark-id')
                    removeBookmark(id)
                }
            }
        }
    })
})
/* Categories */
$(function () {
    $.contextMenu({
        selector: '.category',
        items: {
            'add_bookmark': {
                name: 'Add Bookmark',
                icon: 'add',
                callback: function (itemKey, options) {
                    let id = options.$trigger.attr('data-category-id')
                    let categoryName = options.$trigger.text()
                    addBookmark(id, categoryName)
                }
            },
            'divider': '---',
            'remove': {
                name: 'Remove',
                icon: 'delete',
                callback: function (itemKey, options) {
                    let id = options.$trigger.attr('data-category-id')
                    removeVideoCategory(videoID, id)
                }
            }
        }
    })
})
/* Star */
$(function () {
    $.contextMenu({
        selector: '.star[data-star-id]',
        items: {
            'add_bookmark': {
                name: 'Add Bookmark',
                icon: 'add',
                callback: function () {
                    const dialogWrapper = document.createElement('div')
                    dialogWrapper.id = 'dialog'
                    dialogWrapper.title = 'Add Bookmark'

                    document.body.appendChild(dialogWrapper)
                    $(function () {
                        const dialogQuery = $('#dialog')
                        dialogQuery.dialog({
                            close: function () {
                                $(this).dialog('close')
                                this.closest('.ui-dialog').remove()
                            },
                            width: 250,
                            position: {my: "right top", at: "right-160 top+250"}
                        })

                        searchField(dialogQuery)

                        const query = $('#category_list > option')
                        for (let i = 0; i < query.length; i++) {
                            let categoryID = query.eq(i).attr('data-category-id')
                            let categoryName = query.eq(i).attr('value')

                            let btn = document.createElement('div')
                            btn.classList.add('btn', 'unselectable')
                            btn.onclick = function () {
                                addCategory_and_bookmark(categoryID, categoryName)
                            }
                            btn.textContent = categoryName

                            dialogQuery.append(btn)
                        }

                        searchData()
                    })
                }
            },
            'divider': '---',
            'remove': {
                name: 'Remove',
                icon: 'delete',
                callback: function (itemKey, options) {
                    let id = options.$trigger.attr('data-star-id')
                    removeVideoStar(videoID, id)
                }
            }
        }
    })
})
/* Video */
$(function () {
    $.contextMenu({
        selector: '#video .plyr',
        zIndex: 3,
        items: {
            'toggle_controls': {
                name: 'Toggle Controls',
                icon: 'edit',
                callback: function () {
                    $('.plyr__controls, .plyr__control').toggleClass('hidden-controls')
                }
            },
            'set_age': {
                name: 'Set Age',
                icon: 'add',
                callback: function () {
                    const dialogWrapper = document.createElement('div')
                    dialogWrapper.id = 'dialog'
                    dialogWrapper.title = 'Set Age'

                    document.body.appendChild(dialogWrapper)
                    $(function () {
                        const dialogQuery = $('#dialog')
                        dialogQuery.dialog({
                            close: function () {
                                $(this).dialog('close')
                                this.closest('.ui-dialog').remove()
                            },
                            width: 50
                        })

                        const dialogInput = document.createElement('input')
                        dialogInput.type = 'number'
                        dialogInput.name = 'videoAge_set'
                        dialogInput.style.textAlign = 'center'

                        dialogQuery.append(dialogInput)
                        dialogInput.focus()

                        document.querySelector('input[name="videoAge_set"]').addEventListener('keydown', function (e) {
                            if (e.keyCode === 13) {
                                setAge(this.value)
                            }
                        })
                    })
                }
            },
            'rename_video': {
                name: 'Rename File',
                icon: 'edit',
                callback: function () {
                    let source = $(videoPlayer).find('source').not('[type="video/webm"], [type="application/x-mpegURL"]').first().attr('src')
                    let videoPath_current = `${source.split('/')[1]}/${source.split('/')[2]}`

                    const dialogWrapper = document.createElement('div')
                    dialogWrapper.id = 'dialog'
                    dialogWrapper.title = 'Edit File'

                    document.body.appendChild(dialogWrapper)
                    $(function () {
                        const dialogQuery = $('#dialog')
                        dialogQuery.dialog({
                            close: function () {
                                $(this).dialog('close')
                                this.closest('.ui-dialog').remove()
                            },
                            width: 1000
                        })

                        const dialogInput = document.createElement('input')
                        dialogInput.type = 'text'
                        dialogInput.name = 'videoFile_edit'
                        dialogInput.value = videoPath_current

                        dialogQuery.append(dialogInput)
                        dialogInput.focus()

                        document.querySelector('input[name="videoFile_edit"]').addEventListener('keydown', function (e) {
                            if (e.keyCode === 13) {
                                renameFile(this.value)
                            }
                        })
                    })
                }
            },
            'fix_thumbnail': {
                name: 'Fix Thumbnail',
                icon: 'edit',
                callback: function () {
                    generateThumbnail()
                }
            },
            'divider': '---',
            'remove_bookmarks': {
                name: 'Remove Bookmarks',
                icon: 'delete',
                callback: function () {
                    removeBookmarks()
                },
                disabled: hasNoBookmarks()
            },
            'remove_video': {
                name: 'Remove Video',
                icon: 'delete',
                callback: function () {
                    removeVideo()
                },
                disabled: !(hasNoStar() && hasNoBookmarks())
            }
        }
    })
})
/* Date */
$(function () {
    $.contextMenu({
        selector: '#video .date',
        items: {
            'update_date': {
                name: 'Fix Date',
                icon: 'fas fa-sync-alt',
                callback: function () {
                    fixDate()
                }
            }
        }
    })
})
/* Attribute */
$(function () {
    $.contextMenu({
        selector: '#video .attribute',
        items: {
            'remove_attribute': {
                name: 'Remove Attribute',
                icon: 'delete',
                callback: function (itemKey, options) {
                    let attributeID = options.$trigger.attr('data-attribute-id')

                    removeAttribute(attributeID)
                }
            }
        }
    })
})
/* Location */
$(function () {
    $.contextMenu({
        selector: '#video .location',
        items: {
            'remove_location': {
                name: 'Remove Location',
                icon: 'delete',
                callback: function (itemKey, options) {
                    let locationID = options.$trigger.attr('data-location-id')

                    removeLocation(locationID)
                }
            }
        }
    })
})

const searchField = (dialogQuery = $('#dialog')) => {
    const searchWrapper = document.createElement('span')
    searchWrapper.classList.add('search')
    const searchInner = document.createElement('span')
    searchInner.classList.add('inner')

    searchWrapper.appendChild(searchInner)
    dialogQuery.append(searchWrapper)
}

const searchData = () => {
    const CHAR_UP = 38
    const CHAR_DOWN = 40

    const CHAR_BACKSPACE = 8
    const CHAR_ENTER = 13
    const CHAR_SPACE = 32

    const CHAR_A = 65
    const CHAR_Z = 90

    let input = ''
    $('#dialog .btn:visible').first().addClass('selected')
    const search = e => {
        if (((e.which === CHAR_BACKSPACE && input.length) || e.which === CHAR_SPACE) || (e.which >= CHAR_A && e.which <= CHAR_Z)) {
            e.preventDefault() // SPACEBAR

            if (e.which === CHAR_BACKSPACE) {
                updateLabel(input = input.slice(0, -1))
            } else {
                updateLabel(input += String.fromCharCode(e.which).toLowerCase())
            }

            $('#dialog .btn').removeClass('no-match').not(function () {
                return this.textContent.toLowerCase().indexOf(input) !== -1
            }).addClass('no-match')

            $('#dialog .btn.selected').removeClass('selected')
            $('#dialog .btn:visible').first().addClass('selected')
        } else if (e.which === CHAR_ENTER || e.which === CHAR_UP || e.which === CHAR_DOWN) {
            e.preventDefault() // UP & DOWN

            if (e.which === CHAR_ENTER) {
                $('#dialog .btn.selected')[0].click()
            } else {
                let $currentItem = $('#dialog .btn.selected')
                let $items = $('#dialog .btn:visible')
                if (e.which === CHAR_DOWN) {
                    let $selectedItem
                    for (let i = $items.length - 1; i >= 0; i--) {
                        if (!$items.eq(i).hasClass('selected')) $selectedItem = $items.eq(i)
                        else break
                    }

                    if ($selectedItem !== undefined) {
                        $currentItem.removeClass('selected')
                        $selectedItem.addClass('selected')
                    }
                } else if (e.which === CHAR_UP) {
                    let $selectedItem
                    for (let i = 0; i < $items.length; i++) {
                        if (!$items.eq(i).hasClass('selected')) $selectedItem = $items.eq(i)
                        else break
                    }

                    if ($selectedItem !== undefined) {
                        $currentItem.removeClass('selected')
                        $selectedItem.addClass('selected')
                    }
                }
            }
        }

        function updateLabel(input) {
            if (document.querySelector('.search > .inner')) {
                document.querySelector('.search > .inner').textContent = input
            }
        }
    }
    document.querySelector('[role="dialog"]').addEventListener('keydown', search)
}

const hasNoStar = () => {
    return !$('.star').length
}

const hasNoBookmarks = () => {
    return !$('.bookmark').length
}

/* Bookmark Collision Check */
function collisionCheck(a, b) {
    const distance_min = {
        x: 7,
    }

    if (typeof a === "undefined" || typeof b === "undefined") return false

    a = a.getBoundingClientRect()
    b = b.getBoundingClientRect()

    return !((a.x + a.width) < b.x - distance_min.x) || (a.x - distance_min.x > (b.x + b.width))
}

function bookmarkCollision() {
    bookmarkSort()

    $(bookmark).attr('data-level', 1)
    for (let i = 1, items = bookmark, LEVEL_MIN = 1, LEVEL_MAX = 12, level = LEVEL_MIN; i < items.length; i++) {
        let collision = false

        let first = items[i - 1]
        let second = items[i]

        if (collisionCheck(first, second)) {
            collision = true
        } else {
            collision = false

            for (let j = 1; j < i; j++) {
                if (collisionCheck(items[j], second)) collision = true
            }
        }

        if (collision && level < LEVEL_MAX) {
            if (level < LEVEL_MAX) level++
            second.setAttribute('data-level', level)
        } else {
            level = LEVEL_MIN
        }
    }
}

function bookmarkSort() {
    $(bookmark).sort(function (a, b) {
        let valA = a.getAttribute('data-bookmark-time')
        let valB = b.getAttribute('data-bookmark-time')

        return valA - valB
    })

    $(bookmark).parent().append($(bookmark))
}

function onFocus(callback) {
    if (document.hasFocus()) callback()

    window.addEventListener('focus', function () {
        callback()
    })
}

function autoComplete() {
    let stars = []

    const starQuery = $('.star-autocomplete')
    for (let i = 0; i < starQuery.length; i++) stars.push(starQuery.eq(i).text())
    $('input[name="star"]').autocomplete({source: [stars]})
}

const getOffset = start => {
    const offset_decimal = start / videoPlayer.duration
    const offset_mx = 1.01

    let offset = offset_decimal * 100
    offset *= offset_mx

    return offset
}

const animation = (src, duration_start = 300, duration_end = duration_start) => {
    let img = document.createElement('img')
    img.src = `css/images/${src}`
    img.classList.add('symbol')

    if (duration_start > -1) {
        insertBefore(document.getElementsByClassName('plyr')[0], img)
        $(img).fadeIn(duration_start, () => {
            if (duration_end > -1) {
                $(this).fadeOut(duration_end, () => {
                    img.remove()
                })
            }
        })
    }
}

const insertBefore = (parentNode, newNode) => {
    parentNode.insertBefore(newNode, parentNode.firstChild)
}

const setClipboard = data => {
    const el = document.createElement("textarea")

    el.value = data
    el.setAttribute("readonly", "")
    el.style.position = "absolute"
    el.style.left = "-9999px"

    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
}

const addBookmarkCore = (wrapper, data, seconds, categoryID, categoryName) => {
    if (!$(`.bookmark[data-bookmark-time="${seconds}"][data-category-id="${categoryID}"]`).length) {
        let a = document.createElement('a')
        a.classList.add('bookmark', 'btn')
        a.setAttribute('data-category-id', categoryID)
        a.setAttribute('data-bookmark-id', data.responseText)
        a.setAttribute('data-bookmark-time', seconds.toString())
        a.setAttribute('data-level', '1')
        a.href = 'javascript:;'
        a.style.marginLeft = `${getOffset(seconds)}%`
        a.textContent = categoryName

        wrapper.appendChild(a)
    }

    animation('checkbox.png')

    $(bookmark).on('click', function () {
        playFrom($(this).attr('data-bookmark-time'))
    })

    bookmarkCollision()
}