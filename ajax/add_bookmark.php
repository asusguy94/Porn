<?php
include('../_class.php');

if (isset($_POST['seconds']) && isset($_POST['categoryID']) && isset($_POST['videoID'])) {
	if (!empty($_POST['seconds']) && !empty($_POST['categoryID']) && !empty($_POST['videoID'])) {
		$seconds = $_POST['seconds'];
		$categoryID = $_POST['categoryID'];
		$videoID = $_POST['videoID'];

		global $pdo;
		$query = $pdo->prepare("SELECT id FROM bookmarks WHERE videoID = ? AND categoryID = ? AND start = ? LIMIT 1");
		$query->bindValue(1, $videoID);
		$query->bindValue(2, $categoryID);
		$query->bindValue(3, $seconds);
		$query->execute();
		if (!$query->rowCount()) {
			$query = $pdo->prepare("INSERT INTO bookmarks(videoID, categoryID, start) VALUES(?, ?, ?)");
			$query->bindValue(1, $videoID);
			$query->bindValue(2, $categoryID);
			$query->bindValue(3, $seconds);
			$query->execute();

			$query = $pdo->prepare("SELECT id FROM bookmarks WHERE videoID = ? AND categoryID = ? AND start = ? LIMIT 2");
			$query->bindValue(1, $videoID);
			$query->bindValue(2, $categoryID);
			$query->bindValue(3, $seconds);
			$query->execute();
			$bookmarkID = $query->fetch()['id'];
			if($query->rowCount() == 1) {
				print $bookmarkID;
			}
		}
	}
}
