<?php
include('../_class.php');

if (isset($_POST['attributeID']) && isset($_POST['videoID'])) {
	if (!empty($_POST['attributeID']) && !empty($_POST['videoID'])) {
		$videoID = $_POST['videoID'];
		$attributeID = $_POST['attributeID'];

		global $pdo;
		$query = $pdo->prepare("DELETE FROM videoattributes WHERE videoID = :videoID AND attributeID = :attributeID");
		$query->bindParam(':videoID', $videoID);
		$query->bindParam(':attributeID', $attributeID);
		$query->execute();
	}
}
