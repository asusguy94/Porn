<?php
include('../_class.php');
$basic = new Basic();
$stars = new Star();

if(isset($_POST['starID']) && isset($_FILES['file']['name'][0])){
	if(!empty($_POST['starID']) && !empty($_FILES['file']['name'][0])) {
		$starID = $_POST['starID'];
		$file = $_FILES['file'];

		$ext = $basic->getExtension($file['name']);
		if($stars->downloadImage_local($file['tmp_name'], $starID, $ext)){
			global $pdo;
			$query = $pdo->prepare("UPDATE stars SET image = ? WHERE id = ?");
			$query->bindValue(1, "$starID.$ext");
			$query->bindValue(2, $starID);
			$query->execute();

			echo md5_file("../images/stars/$starID.$ext");
		}
	}
}