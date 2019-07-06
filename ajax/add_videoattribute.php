<?php
include('../_class.php');

if (isset($_POST['attributeID']) && isset($_POST['videoID'])) {
	if (!empty($_POST['attributeID']) && !empty($_POST['videoID'])) {
		$videoID = $_POST['videoID'];
		$attributeID = $_POST['attributeID'];

		global $pdo;
		$query = $pdo->prepare("SELECT id FROM videoattributes WHERE attributeID = :attributeID AND videoID = :videoID");
		$query->bindParam(':videoID', $videoID);
		$query->bindParam(':attributeID', $attributeID);
		$query->execute();
		if (!$query->rowCount()) {
			$query = $pdo->prepare("INSERT INTO videoattributes(attributeID, videoID) VALUES(:attributeID, :videoID)");
			$query->bindParam(':videoID', $videoID);
			$query->bindParam(':attributeID', $attributeID);
			$query->execute();

			$query = $pdo->prepare("SELECT id FROM videoattributes WHERE videoID = :videoID AND attributeID = :attributeID LIMIT 2");
			$query->bindParam(':videoID', $videoID);
			$query->bindParam(':attributeID', $attributeID);
			$query->execute();
			$id = $query->fetch()['id'];
			if ($query->rowCount() == 1) {
				print $id;
			}
		}
	}
}
