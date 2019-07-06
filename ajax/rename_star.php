<?php
include('../_class.php');

if (isset($_POST['starID']) && isset($_POST['starName'])) {
	if (!empty($_POST['starID']) && !empty($_POST['starName'])) {
		$starID = $_POST['starID'];
		$starName = $_POST['starName'];

		global $pdo;
		$query = $pdo->prepare("SELECT id FROM stars WHERE name = ?");
		$query->bindValue(1, $starName);
		$query->execute();
		if(!$query->rowCount()){
			$query = $pdo->prepare("UPDATE stars SET name = ? WHERE id = ?");
			$query->bindValue(1, $starName);
			$query->bindValue(2, $starID);
			$query->execute();
		}
	}
}