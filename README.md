# Stream Deck plugin for Twitchat

This is a complete revamp of the Stream Deck plugin for [Twitchat.fr](https://twitchat.fr/).  
It uses latest Elgato SDK with much cleaner code structure.  
  
It also creates a Websocket server that Twitchat will automatically connect with to avoid relying on OBS-websocket. This makes it much easier for the end user and opens the possibility to use it even if not using OBS.

## Pre resquisite
Install elgato CLI:
```
npm install -g @elgato/cli@latest
```
More details here: https://docs.elgato.com/streamdeck/cli/intro/

Enable dev mode on your stream deck:
```
sd dev
```
  
Link local dev plugin with Stream Deck app for easier debugging:
```
sd link fr.twitchat.sdPlugin
```

## Live reload
To make it so the plugin automatically reloads after modifying its code, run this:
```
npm run watch
```

## Build plugin
Build plugin for production:
```
npm run build
```
This will also first validate the plugin.


## Add a new plugin action
Action creation has been made easier thanks to a custom script.  
Just create a new icon under `icons_source` folder and run:
```
node generate-actions.js
```
This will automatically create an entry in `fr.twitchat.sdPlugin/manifest.json` that you'll need to complete Specifically `Tooltip` and optionally a better `Name`.  
It will also create a dedicated action file under `src/actions` and the property inspector template under `fr.twitchat.sdPlugin/ui`. Customize both these files depending on what the action should do.

## Get live exectution logs
This will show you live logs of the stream deck plugin execution:
```
npm run logs
```

## Validate plugin manually
```
sd validate fr.twitchat.sdPlugin
```

## Test plugin manually
Restart plugin to see latest changes:  
```
sd restart fr.twitchat
```