<?php
include('../_class.php');

if (isset($_POST['videoID']) && isset($_POST['categoryID'])) {
	if (!empty($_POST['videoID']) && !empty($_POST['categoryID'])) {
		$categoryID = $_POST['categoryID'];
		$videoID = $_POST['videoID'];

		global $pdo;
		$query = $pdo->prepare("DELETE FROM videocategories WHERE videoID = ? AND categoryID = ?");
		$query->bindValue(1, $videoID);
		$query->bindValue(2, $categoryID);
		$query->execute();
	}
}