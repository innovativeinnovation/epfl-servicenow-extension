Contributing
============

Welcome, so you are thinking about contributing ?
Awesome, this a great place to start.

Setup
-----

```bash
git clone git@github.com:innovativeinnovation/epfl-servicenow-extension.git
cd epfl-servicenow-extension
gem install sass
npm i
```

Then, you need to create a `secret.json` file in the project main folder with
your Tequila identity.

```json
{
  "username": "...",
  "password": "..."
}
```

:warning: Never commit this file.

Test
----

```bash
npm t
```

Build
-----

```bash
npm run build
```

or

```bash
npm run serve
```

to update source continuously.

Run
---

Chrome:

  1. Open Tools -> Extensions
  2. Check the "Developer Mode" option (if not already)
  3. Select "Load unpacked extension"
  4. Navigate to the project `epfl-servicenow-extension/dist/chrome` and click
     select

Firefox:

  1. Open Tools -> Add-ons
  2. Click "Debug Add-ons"
  3. Check the "Enable add-on debugging" option (if not already)
  4. Select "Load Temporary Add-on"
  5. Navigate to the project `epfl-servicenow-extension/dist/firefox` and
     click open
  
Opera:

  1. View -> Show Extensions
  2. Click on "Developer Mode" button (if not already)
  3. Click on "Load Unpacked Extension..."
  4. Navigate to the project `epfl-servicenow-extension/dist/chrome` and
     click select

Release
-------

  1. Bump the correct version in the file [package.json](package.json)
     (`npm version [<newversion> | major | minor | patch]`)
  2. Bump the correct version in the files [manifest.json](src/manifest.json)
     and [manifest.firefox.json](src/manifest.firefox.json)
  3. Update the file [CHANGELOG.md](CHANGELOG.md)
  4. Create the tag (`git tag -a v<version> -m "Tagging the v<version> release"`)

License
-------

Apache License 2.0

Original work (c) ECOLE POLYTECHNIQUE FEDERALE DE LAUSANNE, Switzerland, VPSI, 2017-2018.  
Modified work (c) William Belle, 2018.

See the [LICENSE](LICENSE) file for more details.
