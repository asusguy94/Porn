<?php
include('../_class.php');

if (isset($_POST['siteID'])) {
	if (!empty($_POST['siteID'])) {
		$siteID = $_POST['siteID'];

		global $pdo;
		$query = $pdo->prepare("SELECT COUNT(videosites.siteID) AS total FROM sites LEFT JOIN videosites ON sites.id = videosites.siteID WHERE sites.id = :siteID GROUP BY sites.id HAVING total = 0 LIMIT 1");
		$query->bindParam(':siteID', $siteID);
		$query->execute();
		if($query->rowCount()) {
			$query = $pdo->prepare("DELETE FROM sites WHERE id = :siteID");
			$query->bindParam(':siteID', $siteID);
			$query->execute();
		}
	}
}