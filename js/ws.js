/*** AJAX ***/
function rename_site(siteID) {
    /*ajax('ajax/rename_site', [
        {'siteID': siteID}
    ], () => {
        console.log('wsite renamed!')
    })*/
    console.log('renamed site')
}

function remove_site(siteID) {
    ajax('ajax/remove_site.php', [
        {'siteID': siteID}
    ])
}

function rename_wsite(wsiteID) {
    /*ajax('ajax/rename_wsite', [
        {'wsiteID': wsiteID}
    ], () => {
        console.log('wsite renamed!')
    })*/
    console.log('renamed wsite')
}

function remove_wsite(wsiteID) {
    /*ajax('ajax/remove_wsite', [
        {'wsiteID': wsiteID}
    ], () => {
        console.log('wsite removed!')
    })*/
    console.log('removed wsite')
}

function ajax(url, params, callback = function () {
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
/* Wsite */
$(function () {
    $.contextMenu({
        selector: '[data-wsite-id]:not("[data-site-id]")',
        items: {
            'rename_wsite': {
                name: 'Rename Website',
                icon: 'edit',
                callback: function (itemKey, options) {
                    let wsiteID = options.$trigger.attr('data-wsite-id')

                    rename_wsite(wsiteID)
                }
            }
        }
    })
})

/* Site */
$(function () {
    $.contextMenu({
        selector: `[data-wsite-id][data-site-id]:not("[data-count='0']")`,
        items: {
            'rename_site': {
                name: 'Rename Site',
                icon: 'edit',
                callback: function (itemKey, options) {
                    let siteID = options.$trigger.attr('data-site-id')

                    rename_site(siteID)
                }
            }
        }
    })
})

$(function () {
    $.contextMenu({
        selector: `[data-wsite-id][data-site-id]`,
        items: {
            'rename_site': {
                name: 'Rename Site',
                icon: 'edit',
                callback: function (itemKey, options) {
                    let siteID = options.$trigger.attr('data-site-id')

                    rename_site(siteID)
                }
            },
            'remove_site': {
                name: 'Remove Site',
                icon: 'delete',
                callback: function (itemKey, options) {
                    let siteID = options.$trigger.attr('data-site-id')

                    remove_site(siteID)
                }
            }
        }
    })
})