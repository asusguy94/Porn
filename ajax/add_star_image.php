<?php
include('../_class.php');
$basic = new Basic();
$stars = new Star();

if (isset($_POST['id']) && isset($_POST['image'])) {
	if (!empty($_POST['id']) && !empty($_POST['image'])) {
		$id = $_POST['id'];
		$image = $_POST['image'];

		$ext = $basic->getExtension($image);
		if ($ext === 'jpe' || $ext === 'jpeg') $ext = 'jpg';

		if ($stars->downloadImage($image, $id)) {
			global $pdo;
			$query = $pdo->prepare("UPDATE stars SET image = ? WHERE id = ?");
			$query->bindValue(1, "$id.$ext");
			$query->bindValue(2, $id);
			$query->execute();

			$ext = $basic->getExtension($image);
			if ($ext === 'jpe' || $ext === 'jpeg') $ext = 'jpg';
			echo md5_file("../images/stars/$id.$ext");
		}
	}
}
