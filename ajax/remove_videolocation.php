<?php
include('../_class.php');

if (isset($_POST['locationID']) && isset($_POST['videoID'])) {
	if (!empty($_POST['locationID']) && !empty($_POST['videoID'])) {
		$videoID = $_POST['videoID'];
		$locationID = $_POST['locationID'];

		global $pdo;
		$query = $pdo->prepare("DELETE FROM videolocations WHERE videoID = :videoID AND locationID = :locationID");
		$query->bindParam(':videoID', $videoID);
		$query->bindParam(':locationID', $locationID);
		$query->execute();
	}
}
