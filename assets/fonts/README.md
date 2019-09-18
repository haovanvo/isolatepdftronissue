### WebViewer configuration
In order to serve fonts to webviewer, you should set the custom font URL within your config file using 
```
CoreControls.setCustomFontURL("https://www.somealternateurl.com/chosensubpath/");
``` 
See https://www.pdftron.com/documentation/web/guides/fundamentals/config-files for more details about config files.

### Server configuration

The font server must be capable of serving via the https: protocol.

`fonts.json` and all the `.css` files should be placed into the same directory on the server (corresponding to the URL that was provided to setCustomFontURL above)

Depending on the situation and the client version, WebViewer will fetch either `fonts.json` or the `.css` files directly, after which the font URLs will be read from the `.css` files.

By default all the fonts will be served from `www.pdftron.com/webfonts/`. To change this, simply replace `www.pdftron.com/webfonts/` with your own server in all the `.css` files. 
