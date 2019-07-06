<?php
include('../_class.php');

if (isset($_POST['bookmarkID']) && isset($_POST['seconds'])) {
	if (!empty($_POST['bookmarkID']) && !empty($_POST['seconds'])) {
		$bookmarkID = $_POST['bookmarkID'];
		$seconds = $_POST['seconds'];

		global $pdo;
		$query = $pdo->prepare("SELECT id FROM bookmarks WHERE id = :bookmarkID LIMIT 1");
		$query->bindParam(':bookmarkID', $bookmarkID);
		$query->execute();
		if ($query->rowCount()) {
			$query = $pdo->prepare("SELECT id FROM bookmarks WHERE id = :bookmarkID AND start = :seconds LIMIT 1");
			$query->bindParam(':bookmarkID', $bookmarkID);
			$query->bindParam(':seconds', $seconds);
			$query->execute();
			if (!$query->rowCount()) {
				$query = $pdo->prepare("UPDATE bookmarks SET start = :seconds WHERE id = :bookmarkID");
				$query->bindParam(':bookmarkID', $bookmarkID);
				$query->bindParam(':seconds', $seconds);
				$query->execute();
			}
		}
	}
}
