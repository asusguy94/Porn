<?php
include('../_class.php');

$ffmpeg = new FFMPEG();

if (isset($_POST['videoID']) && !empty($_POST['videoID'])) {
	if (isset($_POST['seconds']) && !empty($_POST['seconds'])) {
		$seconds = $_POST['seconds'];
	}else{
		$seconds = THUMBNAIL_START;
	}
	$videoID = $_POST['videoID'];


	global $pdo;
	$query = $pdo->prepare("SELECT path FROM videos WHERE id = ? LIMIT 1");
	$query->bindValue(1, $videoID);
	$query->execute();
	if ($query->rowCount()) {
		$path = $query->fetch()['path'];
		$ffmpeg->generateThumbnail($path, $videoID, $seconds);
		$ffmpeg->generateThumbnail($path, $videoID, $seconds, THUMBNAIL_RES);
	}
}