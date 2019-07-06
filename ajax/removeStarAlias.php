<?php
include('../_class.php');

if (isset($_POST['aliasID'])) {
	if (!empty($_POST['aliasID'])) {
		$aliasID = $_POST['aliasID'];

		global $pdo;
		$query = $pdo->prepare("DELETE FROM staralias WHERE id = ?");
		$query->bindValue(1, $aliasID);
		$query->execute();
	}
}