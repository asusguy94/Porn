<?php
	include('_class.php');

	$basic = new Basic();
	$ffmpeg = new FFMPEG();
?>

    <!doctype html>
    <html>
        <head>
			<?php $basic->head('Create Thumbnails', ['bootstrap', 'main'], []) ?>
        </head>

        <body>
            <nav>
				<?php $basic->navigation() ?>
            </nav>
        </body>
    </html>

<?php
	global $pdo;
	$query = $pdo->prepare("SELECT * FROM videos");
	$query->execute();
	foreach ($query->fetchAll() AS $result) {
		if (file_exists("videos/$result[path]")) {
			if (!file_exists("images/videos/$result[id].jpg")) { // FULL RES
				$ffmpeg->generateThumbnail($result['path'], $result['id'], THUMBNAIL_START);
			}
			if (!file_exists(sprintf("images/videos/$result[id]-%s.jpg", THUMBNAIL_RES))) { // THUMBNAIL RES
				$ffmpeg->generateThumbnail($result['path'], $result['id'], THUMBNAIL_START, THUMBNAIL_RES);
			}
		}
	}

	header('Location: add_videos.php');
?>