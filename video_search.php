<?php
include('_class.php');
$basic = new Basic();
$video = new Video();
$date = new Date();
global $pdo;
?>

<!doctype html>
<html>
    <head>
		<?php $basic->head('Video Search', array('bootstrap', 'prettydropdown', 'search'), array('bootstrap', 'lazyload', 'prettydropdown', 'video.search')) ?>
    </head>

    <body>
        <nav>
			<?php $basic->navigation() ?>
        </nav>

        <main class="container-fluid">
            <div class="row">
                <aside class="col-2">
                    <div class="input-wrapper">
                        <input type="text" name="title" placeholder="Title" autofocus>
                    </div>

                    <div class="input-wrapper" data-toggle="tooltip" data-placement="right" title="Remove special characters from search field">
                        <input type="checkbox" name="special_char" data-toggle="switchbutton" data-onlabel="Special Char" data-offlabel="Regular">
                    </div>

                    <div class="input-wrapper">
                        <input type="text" name="star" placeholder="Star">
                    </div>

                    <div class="input-wrapper" data-toggle="tooltip" data-placement="right" title="Check if file exists">
                        <input type="checkbox" name="existing" data-toggle="switchbutton" data-onlabel="Existing" data-offlabel="Any" data-width="100" disabled>
                    </div>

                    <h2>Sort</h2>
                    <div class="input-wrapper selected">
                        <input id="alphabetically" type="radio" name="sort" checked>
                        <label for="alphabetically">A-Z</label>
                    </div>

                    <div class="input-wrapper">
                        <input id="alphabetically_desc" type="radio" name="sort">
                        <label for="alphabetically_desc">Z-A</label>
                    </div>

                    <div class="input-wrapper">
                        <input id="added" type="radio" name="sort">
                        <label for="added">Old Upload</label>
                    </div>

                    <div class="input-wrapper">
                        <input id="added_desc" type="radio" name="sort">
                        <label for="added_desc">Recent Upload</label>
                    </div>

                    <div class="input-wrapper">
                        <input id="actor-age" type="radio" name="sort">
                        <label for="actor-age">Teen</label>
                    </div>

                    <div class="input-wrapper">
                        <input id="actor-age_desc" type="radio" name="sort">
                        <label for="actor-age_desc">Milf</label>
                    </div>

                    <div class="input-wrapper">
                        <input id="date" type="radio" name="sort">
                        <label for="date">Oldest</label>
                    </div>

                    <div class="input-wrapper">
                        <input id="date_desc" type="radio" name="sort">
                        <label for="date_desc">Newest</label>
                    </div>

                    <h2>Website/Sites</h2>
					<?php
					$query = $pdo->prepare("SELECT websites.name, websites.id FROM websites JOIN videowebsites ON websites.id = videowebsites.websiteID GROUP BY name ORDER BY name");
					$query->execute();
					if ($query->rowCount()) {
						print '<div id="websites">';
						print '<select class="pretty">';
						print '<option>All</option>';
						foreach ($query->fetchAll() as $wsite) {
							print "<option data-wsite='" . Basic::encode($wsite['name']) . "'>$wsite[name]</option>";
							foreach (Website::getSites($wsite['id']) as $site) {
								print "<option data-wsite='" . Basic::encode($wsite['name']) . "' data-site='" . Basic::encode($site['name']) . "'>$wsite[name]_$site[name]</option>";
							}
						}
						print '</select>';
						print '</div>';
					}
					?>

                    <h2>Categories</h2>
					<?php
					$query = $pdo->prepare("SELECT * FROM categories ORDER BY name");
					$query->execute();
					if ($query->rowCount()) {
						print '<div id="categories">';
                        print "<div class='input-wrapper'><input type='checkbox' name='category_NULL'><label for='category_NULL'>NULL</label></div>";
						foreach ($query->fetchAll() as $data) {
							print '<div class="input-wrapper">';
							print "<input type='checkbox' name='category_$data[name]'>";
							print "<label for='category_$data[name]'>$data[name]</label>";
							print '</div>';
						}
						print '</div>';
					}
					?>

                    <h2>Attributes</h2>
					<?php
					$query = $pdo->prepare("SELECT * FROM attributes ORDER BY name");
					$query->execute();
					if ($query->rowCount()) {
						print '<div id="attributes">';
						foreach ($query->fetchAll() as $data) {
							print '<div class="input-wrapper">';
							print "<input type='checkbox' name='attribute_$data[name]'>";
							print "<label for='attribute_$data[name]'>$data[name]</label>";
							print '</div>';
						}
						print '</div>';
					}
					?>

                    <h2>Locations</h2>
					<?php
					$query = $pdo->prepare("SELECT * FROM locations ORDER BY name");
					$query->execute();
					if ($query->rowCount()) {
						print '<div id="locations">';
						foreach ($query->fetchAll() as $data) {
							print '<div class="input-wrapper">';
							print "<input type='checkbox' name='location_$data[name]'>";
							print "<label for='location_$data[name]'>$data[name]</label>";
							print '</div>';
						}
						print '</div>';
					}
					?>
                </aside>

                <section id="videos" class="col-10">
                    <div id="update" class="col btn btn-outline-primary d-none">Update Data</div>
                    <div id="loader"></div>
                </section>
            </div>
        </main>
    </body>
</html>