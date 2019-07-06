<?php
include('../_class.php');

if (isset($_POST['starID']) && isset($_POST['aliasName'])) {
	if (!empty($_POST['starID']) && !empty($_POST['aliasName'])) {
		$starID = $_POST['starID'];
		$aliasName = $_POST['aliasName'];

		global $pdo;
		$query = $pdo->prepare("SELECT id FROM staralias WHERE name = ? LIMIT 1");
		$query->bindValue(1, $aliasName);
		$query->execute();
		if (!$query->rowCount()) {
			$query = $pdo->prepare("SELECT id FROM stars WHERE name = ? LIMIT 1");
			$query->bindValue(1, $aliasName);
			$query->execute();
			if (!$query->rowCount()) {
				$query = $pdo->prepare("INSERT INTO staralias(starID, name) VALUES(:starID, :aliasName)");
				$query->bindParam(':starID', $starID);
				$query->bindParam(':aliasName', $aliasName);
				$query->execute();
			}
		}
	}
}