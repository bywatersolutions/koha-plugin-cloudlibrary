# Introduction

Koha’s Plugin System (available in Koha 3.12+) allows for you to add additional tools and reports to [Koha](http://koha-community.org) that are specific to your library. Plugins are installed by uploading KPZ ( Koha Plugin Zip ) packages. A KPZ file is just a zip file containing the perl files, template files, and any other files necessary to make the plugin work. Learn more about the Koha Plugin System in the [Koha 3.22 Manual](http://manual.koha-community.org/3.22/en/pluginsystem.html) or watch [Kyle’s tutorial video](http://bywatersolutions.com/2013/01/23/koha-plugin-system-coming-soon/).

# Downloading

From the [release page](https://github.com/bywatersolutions/koha-plugin-cloudlibrary/releases) you can download the relevant *.kpz file

# Installing

Koha's Plugin System allows for you to add additional tools and reports to Koha that are specific to your library. Plugins are installed by uploading KPZ ( Koha Plugin Zip ) packages. A KPZ file is just a zip file containing the perl files, template files, and any other files necessary to make the plugin work.

The plugin system needs to be turned on by a system administrator.

To set up the Koha plugin system you must first make some changes to your install.

* Change `<enable_plugins>0<enable_plugins>` to `<enable_plugins>1</enable_plugins>` in your koha-conf.xml file
* Confirm that the path to `<pluginsdir>` exists, is correct, and is writable by the web server
* Restart your webserver

Once set up is complete you will need to alter your UseKohaPlugins system preference. On the Tools page you will see the Tools Plugins and on the Reports page you will see the Reports Plugins.

# Setup

Once installed this plugin will need to be configured with data supplied by CloudLibrary:
* Client ID:
* Client Secret:
* Library ID:
* Library Name: (used to build links to your collection, if left blank links will be supplied via CloudLibrary and may have varying URLs in a consortium)
Item type (code) for imported records:
* ID to send to Cloud Library: ( Default: cardnumber) Cardnumber / UserID / PatronAttribute

The tool method for this plugin allows the user to directly harvest from CloudLibrary - by default it will fetch from the last date fetched, or user can supply a date

There is also a command line/cronjob option for fetching records.
You can add the 'cloudlibrary_cronjob.pl' to your cron tab. 
If no --date option is provided it wil fetch records since the last run. See the script for more details.
