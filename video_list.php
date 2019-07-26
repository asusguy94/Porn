<?php
include('_class.php');
$basic = new Basic();
$videos = new Video();
?>

<!doctype html>
<html>
    <head>
		<?php $basic->head('Videos', array('bootstrap')) ?>
    </head>

    <body>
        <nav>
			<?php $basic->navigation() ?>
        </nav>

        <main class="container-fluid">
            <section class="row">
                <div class="col">
                    <div class="list-group">
						<?php $videos->fetchVideos(24, ["selector" => 'li', "className" => 'list-group-item list-group-item-action']) ?>
                    </div>
                </div>
            </section>
        </main>
    </body>
</html>