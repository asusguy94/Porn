<?php
include('../_class.php');

if (isset($_POST['videoID']) && isset($_POST['age'])) {
	if (!empty($_POST['videoID']) && !empty($_POST['age'])) {
		$videoID = $_POST['videoID'];
		$age = $_POST['age'];

		global $pdo;
		$query = $pdo->prepare("UPDATE videos SET starAge = ? WHERE id = ?");
		$query->bindValue(1, $age);
		$query->bindValue(2, $videoID);
		$query->execute();
	}
}