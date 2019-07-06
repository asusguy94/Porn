<?php
include('../_class.php');

if (isset($_POST['videoID']) && isset($_POST['categoryID']) && isset($_POST['seconds'])) {
	if (!empty($_POST['videoID']) && !empty($_POST['categoryID']) && !empty($_POST['seconds'])) {
		$videoID = $_POST['videoID'];
		$categoryID = $_POST['categoryID'];
		$seconds = $_POST['seconds'];

		global $pdo;
		$query = $pdo->prepare("SELECT id FROM videocategories WHERE videoID = ? AND categoryID = ? LIMIT 1");
		$query->bindValue(1, $videoID);
		$query->bindValue(2, $categoryID);
		$query->execute();
		if (!$query->rowCount()) {
			$query = $pdo->prepare("INSERT INTO videocategories(videoID, categoryID) VALUES(?, ?)");
			$query->bindValue(1, $videoID);
			$query->bindValue(2, $categoryID);
			$query->execute();
		}

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