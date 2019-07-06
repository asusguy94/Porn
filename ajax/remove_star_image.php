<?php
include('../_class.php');

if (isset($_POST['id'])) {
	if (!empty($_POST['id'])) {
		$id = $_POST['id'];

		global $pdo;

		$query = $pdo->prepare("SELECT image FROM stars WHERE id = ? LIMIT 1");
		$query->bindValue(1, $id);
		$query->execute();
		$image = $query->fetch()['image'];

		$query = $pdo->prepare("UPDATE stars SET image = NULL WHERE id = ?");
		$query->bindValue(1, $id);
		$query->execute();

		unlink('../images/stars/' . $image);
	}
}