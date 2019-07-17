# Welcome
## Some information about the system
- The program is built on **HTML, PHP, MySQL & JavaScript**, so to use it you either have to run a local server or if you have another computer you could run the server from there
  - I'm running the server on a NAS...so most computers should be able to outperform my setup
- The program is dependent on some libraries/files, look under [Installation](#installation) for instructions on how to install them
- The program is heavily dependent on the structure of the files/folders, for more info check the [Wiki](../../wiki)
- This project is **early in development**
- If anyone needs help with anything regarding the project, don't hesitate to ask!
- This project is loosely based on a windows app called [Pornganizer](https://pornganizer.org)
  - This project uses some of the functionality similar to that program, but with a lot of folder/file automation.
- I also have another version of this project for a hentai-version of this organizer, if that is something that anyone wants to use as well, I can upload that too.
- Any help is appreciated...also with GitHub, as I'm quite new to the platform

## Requirements
- Server
  - **Linux**: LAMP
  - **WindowsXP**: XAMP
  - **Windows**: WAMP
  - **Mac**: MAMP
  - It is possible to run this app without either of these, but you need to have Apache, MySQL, and PHP configured in order for the system to work
- **Modern Web browser**: Chrome, Chromium, Firefox, etc..
- **Database name**: insert it into ```_class.php``` (or use default)
- **Database username**: insert into ```_class.php``` (or use default)
	- You will need to add a new user with that info in MySQL
- **Database password**: insert into ```_class.php``` (or use default)
	- You will need to add a new user with that info in MySQL
- If you want the DB-link in the navbar to work, you need to install phpmyadmin and move its install folder to phpMyAdmin inside the project folder


## Installation
1. Clone/download the project
2. Install [Node.JS](https://nodejs.org/)
3. Open the terminal of choice and CD into where you downloaded/cloned the project to
   - If you downloaded the file to `C:/downloads`, you can run `CD C:/downloads/porn-organizer`
4. Type `npm install -global gulp-cli` to install the required command line utility
5. Type `npm install` to download the required files
6. Type `gulp` to compile the necessary files

### Initialize Database & edit _class.php
This app requires a database to function properly, I recomend using [phpMyAdmin](https://www.phpmyadmin.net)
1. **Login to the administration console of your database management of choice**
	- You can usually use `root` for username and ` ` (no character) for password
2. **Create a new user (optional, as you can use the root account instead)**
	-  phpMyAdmin
		- Click on `User Accounts`
		- Click on `Add New User`
		- Type username in the text field
		- Type password in the text field, or choose no password in the dropdown menu
		- Scroll down to Global Privileges and click on `Check All`
		- Scroll down to the bottom and click on `Go`
3. **Create a database**
	- phpMyAdmin
		- Click on `Databases`
		- Choose a database name and type it in the text box
		- Click on `Create`
4. **Import tables into the database**
	- phpMyAdmin
		- Make sure the correct database is selected
			- If you've just created the database from the previous step, it should already be selected
			- The selected database will be displayed by a different color in the tree on the left,
			it will also be displayed on the top of the screen
			- If the selected database is incorrect, click on the correct database in the tree on the left
		- Click on `Import`
		- Click on `Choose File` and browse to `database.sql` included in this project
		- Scroll down to the bottom and click on `Go`
		- The tables will now be imported into the database
			- it might take some time to complete, just wait for it to finish
5. **Edit `_class.php`**
	- Open `_class.php` in any text editor
	- Find the line that says `define('DB', 'porn')` and replace `'porn'` with the name of your database
		- If you created a database with the name `'private'`, the line should be `define('DB', 'private')`
	- Find the line that says `define('DB_PORT', '3307')` and replace `'3307'` with the port number of your sql_driver
    	- It is usually `3307` for MariaDB and `3306` for MySQL
    - Find the line that says `define('DB_USER', 'porn.web_user')` and replace `'porn.web_user'` with your username
    	- If you have a username `'private_user'`, the line should be `define('DB_USER', 'private_user')`
    	- You can also use `'root'` as a username
    - Find the line that says `define('DB_PASS', 'Qnn3ANukory20UAQ')` and replace `'Qnn3ANukory20UAQ'` with your password
        - If have a password `'private_pass'`, the line should be `define('DB_PASS', 'private_pass')`
        - You can also use `''` as a password, if you used `'root'` as a username
6. **Save the file**

### Initialize Settings
When first starting out, the settings will be missing from the database, you will have to initialize the table yourself.
This app depends on values of the settings table, so choosing not to initialize the settings might break the app!
1. Go to the settings page (click on the Settings button on the navigation bar)
2. Make any initial changes (OPTIONAL)
3. Scroll to the bottom and click on the Save-button

## Upgrade dependencies
If you have been using this project for a while, after some time the dependencies might become outdated
1. Open the terminal of choice and CD into your working project eg `CD C:/downloads/porn-organizer`
2. Type `npm update` to refresh the dependencies

Usually doing this is not necessary, but if you've updated the project from a new commit you should always run the following commands
```
npm install
npm update
```
This will install any new packages added to the project & update any existing packages to the latest version

## TODO
- [ ] Implement Bootstrap 4
- [ ] Video-page bookmark-visuals are broken on smaller devices
- [x] Upload .SQL file for project
- [ ] Display indicator on search page for various counts
