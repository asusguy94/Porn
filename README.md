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

## Upgrade dependencies
If you have been using this project for a while, after some time the dependencies might become outdated.
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
- [ ] Upload .SQL file for project
