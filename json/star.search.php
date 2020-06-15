<?php
	include('../_class.php');

	global $pdo;
	$sql = "
            SELECT stars.id AS starID, stars.name, stars.image, stars.haircolor, stars.breast, videostars.videoID,
                   stars.ethnicity, stars.country, DATEDIFF(NOW(), stars.birthdate) AS age, 
                   websites.name AS websiteName, sites.name AS siteName,
              (SELECT COUNT(videostars.id) FROM videostars WHERE videostars.starID = stars.id) AS videoCount
            	FROM stars
            	LEFT JOIN videostars ON videostars.starID = stars.id
            	LEFT JOIN videowebsites ON videowebsites.videoID = videostars.videoID
            	LEFT JOIN websites ON websites.id = videowebsites.websiteID
            	LEFT JOIN videosites ON videowebsites.videoID = videosites.videoID
            	LEFT JOIN sites ON videosites.siteID = sites.id
            	ORDER BY stars.name, videoID
          ";
	
	$query = $pdo->prepare($sql);
	$query->execute();
	$result = $query->fetchAll(PDO::FETCH_OBJ);

	print '{';
	print '"stars": [';
	for ($i = 0, $len = count($result), $website_arr = [], $site_arr = []; $i < $len; $i++) {
		$starID = $result[$i]->starID;
		$starName = $result[$i]->name;
		$starImage = $result[$i]->image;
		$breast = $result[$i]->breast;
		$hair = $result[$i]->haircolor;
		$ethnicity = $result[$i]->ethnicity;
		$country = $result[$i]->country;
		$starAge = $result[$i]->age;
		$videoCount = $result[$i]->videoCount;

		/* Array */
		$websiteName = $result[$i]->websiteName;
		$siteName = $result[$i]->siteName;

		/* Duplicate Check */
		$nextIsDuplicate = ($i < $len - 1 && ($result[$i + 1]->starID == $starID));
		$prevIsDuplicate = ($i > 0 && ($result[$i - 1]->starID == $starID));


		if (!$prevIsDuplicate) { // first star of the bunch
			print '{';

			print "\"starID\": $starID,";
			print "\"starName\": \"$starName\",";
			print "\"image\": \"$starImage\",";
			print "\"breast\": \"$breast\",";
			print "\"hair\": \"$hair\",";
			print "\"ethnicity\": \"$ethnicity\",";
			print "\"age\": \"$starAge\",";
			print "\"country\": \"$country\",";
			print "\"videoCount\": \"$videoCount\",";
		}

		// Website INIT
		if (!is_null($websiteName)) {
			if (!in_array($websiteName, $website_arr)) array_push($website_arr, $websiteName);
		}

		// Site INIT
		if (!is_null($siteName)) {
			if (!in_array($siteName, $site_arr)) array_push($site_arr, $siteName);
		}

		// Duplicate Check
		if (!$nextIsDuplicate) { // last star of the bunch
			// Website
			print '"website": [';
			if (count($website_arr)) {
				for ($j = 0; $j < count($website_arr); $j++) {
					print "\"$website_arr[$j]\"";
					if ($j < count($website_arr) - 1) print ',';
				}
			}
			print '],';

			// Site
			print '"site": [';
			if (count($site_arr)) {
				for ($j = 0; $j < count($site_arr); $j++) {
					print "\"$site_arr[$j]\"";
					if ($j < count($site_arr) - 1) print ',';
				}
			}
			print ']';

			if ($i < $len - 1) print '},';
			else print '}';

			/* RESETS */
			$website_arr = [];
			$site_arr = [];
		}
	}

	print ']';
	print '}';