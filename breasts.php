<?php
	include('_class.php');
	$basic = new Basic();
?>

<!doctype html>
<html>
	<head>
		<?php $basic->head('Breasts Table', array('bootstrap')) ?>
	</head>

	<body>
		<nav>
			<?php $basic->navigation() ?>
		</nav>

		<main class="container-fluid">
			<section class="row">
				<div class="col">
					<div class="list-group">
					</div>
				</div>
			</section>
		</main>
	</body>
</html>