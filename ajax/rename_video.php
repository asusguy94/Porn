<?php
include('../_class.php');

if (isset($_POST['videoID']) && isset($_POST['videoName'])) {
	if (!empty($_POST['videoID']) && !empty($_POST['videoName'])) {
		$videoID = $_POST['videoID'];
		$videoName = $_POST['videoName'];

		global $pdo;
		$query = $pdo->prepare("UPDATE videos SET name = ? WHERE id = ?");
		$query->bindValue(1, $videoName);
		$query->bindValue(2, $videoID);
		$query->execute();
	}
}