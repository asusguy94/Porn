SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `attributes` (
                              `id` int(11) NOT NULL,
                              `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bookmarks` (
                             `id` int(11) NOT NULL,
                             `videoID` int(11) NOT NULL,
                             `categoryID` int(11) NOT NULL,
                             `start` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `categories` (
                              `id` int(11) NOT NULL,
                              `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `country` (
                           `id` int(11) NOT NULL,
                           `name` varchar(255) NOT NULL,
                           `code` char(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `locations` (
                             `id` int(11) NOT NULL,
                             `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `plays` (
                         `id` int(11) NOT NULL,
                         `videoID` int(11) NOT NULL,
                         `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `settings` (
                            `id` int(11) NOT NULL,
                            `similar_def` int(11) NOT NULL DEFAULT 8,
                            `similar_max` int(11) NOT NULL DEFAULT 60,
                            `similar_text` tinyint(1) NOT NULL DEFAULT 0,
                            `cdn` tinyint(1) NOT NULL DEFAULT 0,
                            `cdn_max` tinyint(1) NOT NULL DEFAULT 2,
                            `thumbnail_res` int(11) NOT NULL DEFAULT 290,
                            `thumbnail_start` int(11) NOT NULL DEFAULT 100,
                            `parser` tinyint(1) NOT NULL DEFAULT 0,
                            `enable_webm` tinyint(1) NOT NULL DEFAULT 0,
                            `enable_mkv` tinyint(1) NOT NULL DEFAULT 0,
                            `enable_fa` tinyint(1) NOT NULL DEFAULT 0,
                            `video_sql` varchar(255) DEFAULT NULL,
                            `enable_dash` tinyint(1) NOT NULL DEFAULT 0,
                            `enable_hls` tinyint(1) NOT NULL DEFAULT 0,
                            `enable_https` tinyint(1) NOT NULL DEFAULT 0,
                            `script_reload` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `sites` (
                         `id` int(11) NOT NULL,
                         `name` varchar(255) NOT NULL,
                         `websiteID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `staralias` (
                             `id` int(11) NOT NULL,
                             `starID` int(11) NOT NULL,
                             `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `stars` (
                         `id` int(11) NOT NULL,
                         `name` varchar(255) NOT NULL,
                         `image` varchar(255) DEFAULT NULL,
                         `haircolor` varchar(255) DEFAULT NULL,
                         `eyecolor` varchar(255) DEFAULT NULL,
                         `breast` varchar(255) DEFAULT NULL,
                         `ethnicity` varchar(255) DEFAULT NULL,
                         `country` varchar(255) DEFAULT NULL,
                         `birthdate` date DEFAULT NULL,
                         `height` int(11) DEFAULT NULL,
                         `weight` int(11) DEFAULT NULL,
                         `start` year(4) DEFAULT NULL,
                         `end` year(4) DEFAULT NULL,
                         `autoTaggerIgnore` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `videoattributes` (
                                   `id` int(11) NOT NULL,
                                   `videoID` int(11) NOT NULL,
                                   `attributeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `videocategories` (
                                   `id` int(11) NOT NULL,
                                   `videoID` int(11) NOT NULL,
                                   `categoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `videolocations` (
                                  `id` int(11) NOT NULL,
                                  `videoID` int(11) NOT NULL,
                                  `locationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `videos` (
                          `id` int(11) NOT NULL,
                          `name` varchar(255) NOT NULL,
                          `path` varchar(255) NOT NULL,
                          `date` date DEFAULT NULL,
                          `added` datetime NOT NULL DEFAULT current_timestamp(),
                          `duration` int(11) NOT NULL DEFAULT 0,
                          `starAge` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `videosites` (
                              `id` int(11) NOT NULL,
                              `videoID` int(11) NOT NULL,
                              `siteID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `videostars` (
                              `id` int(11) NOT NULL,
                              `starID` int(11) NOT NULL,
                              `videoID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `videowebsites` (
                                 `id` int(11) NOT NULL,
                                 `videoID` int(11) NOT NULL,
                                 `websiteID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `websites` (
                            `id` int(11) NOT NULL,
                            `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `websitesites` (
                                `id` int(11) NOT NULL,
                                `websiteID` int(11) NOT NULL,
                                `siteID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `attributes`
    ADD PRIMARY KEY (`id`),
    ADD KEY `name` (`name`);

ALTER TABLE `bookmarks`
    ADD PRIMARY KEY (`id`),
    ADD KEY `videoID` (`videoID`),
    ADD KEY `start` (`start`),
    ADD KEY `categoryID` (`categoryID`);

ALTER TABLE `categories`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `country`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `name` (`name`),
    ADD UNIQUE KEY `code` (`code`);

ALTER TABLE `locations`
    ADD PRIMARY KEY (`id`),
    ADD KEY `name` (`name`);

ALTER TABLE `plays`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `time` (`time`),
    ADD KEY `videoID` (`videoID`);

ALTER TABLE `settings`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `sites`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `name` (`name`),
    ADD KEY `websiteID` (`websiteID`);

ALTER TABLE `staralias`
    ADD PRIMARY KEY (`id`),
    ADD KEY `name` (`name`),
    ADD KEY `starID` (`starID`);

ALTER TABLE `stars`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `name` (`name`) USING BTREE,
    ADD UNIQUE KEY `image` (`image`),
    ADD KEY `breast` (`breast`),
    ADD KEY `haircolor` (`haircolor`) USING BTREE,
    ADD KEY `eyecolor` (`eyecolor`) USING BTREE,
    ADD KEY `ethnicity` (`ethnicity`),
    ADD KEY `country` (`country`),
    ADD KEY `birthdate` (`birthdate`),
    ADD KEY `height` (`height`),
    ADD KEY `weight` (`weight`),
    ADD KEY `start` (`start`),
    ADD KEY `end` (`end`),
    ADD KEY `autoTaggerIgnore` (`autoTaggerIgnore`);

ALTER TABLE `videoattributes`
    ADD PRIMARY KEY (`id`),
    ADD KEY `videoID` (`videoID`),
    ADD KEY `attributeID` (`attributeID`);

ALTER TABLE `videocategories`
    ADD PRIMARY KEY (`id`),
    ADD KEY `videoID` (`videoID`),
    ADD KEY `categoryID` (`categoryID`);

ALTER TABLE `videolocations`
    ADD PRIMARY KEY (`id`),
    ADD KEY `videoID` (`videoID`),
    ADD KEY `locationID` (`locationID`) USING BTREE;

ALTER TABLE `videos`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `path` (`path`),
    ADD KEY `name` (`name`),
    ADD KEY `date` (`date`),
    ADD KEY `duration` (`duration`),
    ADD KEY `starAge` (`starAge`),
    ADD KEY `added` (`added`);

ALTER TABLE `videosites`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `videoID` (`videoID`) USING BTREE,
    ADD KEY `siteID` (`siteID`);

ALTER TABLE `videostars`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `videoID` (`videoID`) USING BTREE,
    ADD KEY `starID` (`starID`);

ALTER TABLE `videowebsites`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `videoID` (`videoID`) USING BTREE,
    ADD KEY `websiteID` (`websiteID`);

ALTER TABLE `websites`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `websitesites`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `siteID` (`siteID`) USING BTREE,
    ADD KEY `websiteID` (`websiteID`);

ALTER TABLE `attributes`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `bookmarks`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `country`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `locations`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `plays`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `settings`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `sites`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `staralias`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `stars`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `videoattributes`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `videocategories`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `videolocations`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `videos`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `videosites`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `videostars`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `videowebsites`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `websites`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `websitesites`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;