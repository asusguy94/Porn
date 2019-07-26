<?php
include('_class.php');
$basic = new Basic();
?>

<!doctype html>
<html>
    <head>
		<?php $basic->head('WS Editor', array('bootstrap', 'contextmenu'), array('jquery', 'contextmenu', 'ws')) ?>
    </head>

    <body>
        <nav>
			<?php $basic->navigation() ?>
        </nav>

        <main class="container-fluid">
            <section class="row">
                <div class="col">
                    <div class="list-group">
						<?php
						$websiteArr = wsEditor::getWebsites();

						print '<h2>Websites</h2>';
						foreach ($websiteArr as $website) {
							print "<li class='list-group-item' data-wsite-id='$website[id]' data-count='$website[total]'>
										<span class='badge badge-primary badge-pill'>$website[total]</span>
										<span class='col-10'>$website[name]</span>
									</li>";
						}

						print '<h2>Sites</h2>';
						foreach ($websiteArr as $website) {
							foreach (wsEditor::getSites($website['id']) as $site) {
								print "<li class='list-group-item' data-wsite-id='$website[id]' data-site-id='$site[id]' data-count='$site[total]'>
                                        <span class='badge badge-primary badge-pill'>$site[total]</span>
									    <span class='col-10'>$website[name]_$site[name]</span>
									</li>";
							}
						}
						?>
                    </div>
                </div>
            </section>
        </main>
    </body>
</html>