<?php
include('../_class.php');

if (isset($_POST['starID'])) {
	if (!empty($_POST['starID'])) {
		$starID = $_POST['starID'];

		global $pdo;
		$query = $pdo->prepare("UPDATE stars SET autoTaggerIgnore = 1 WHERE id = ?");
		$query->bindValue(1, $starID);
		$query->execute();
	}
}
