# Stream

This is a prototype version of reactive programming for rendering real time data on a web hosted application. The data is streamed from a twitter development account using your own auth and token keys. There is also an API Key required for Google Maps.

## Dependencies

- MeteorJS installed on your local computer from [here] (http://www.meteor.com) with sudo or root permissions
- Must have Twitter authoriztion keys for OAuth to work properly from [Twiiter] (https://dev.twitter.com/oauth/overview)
- Must have Google API key for maps from [here] (https://developers.google.com/maps/documentation/javascript/get-api-key)

## Installation
1. Install MeteorJS using thier site instructions
2. In the meteor install folder, run command line: meteor create stream
3. Once the <stream> folder is created locate source coude
3a. If the source us zipped, unzip the contents into the stream folder. Ensure the master contents of the application resides in the stream folder and not under a child stram folder.
3b. Or you can pull from [Github] (https://github.com/ginkenstein/stream)

## Configuration
1. Update private/twitter.json with your personal Twitter keys
2. Update private/googleapi.json with your personal Google API key

## Launch
1. In the meteor/stream folder, run command line: meteor
Note: on the initial install you may have to re-execute the meteor command once the packages are built
2. Open browser to http://localhost:3000 to see the app
...
http://localhost:3000
...
3. For MongoDB connectivity, open another command line in the meteor/stream folder, run command line:
...
meteor mongo
...
3a. Connect to MongoDB using an IDE (eg. robomongo) via [localhost:3000] (http://localhost:3001)

## Potenial Issues
1. You may have to update packages if they are incompatible with a newer Meteor version. Run meteor update
2. You may get NPM Require errors on the initial execution. Simply delete <packages> directory from the project and re-run the meteor command
3. Mozilla Firefox is the preferred browser, or > IE 11, Chrome