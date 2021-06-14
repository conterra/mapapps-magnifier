# Magnifier Bundle
The Overview Map gives better orientation to the user by showing the current extent of the map in a smaller scaled map within a separated window.

![Screenshot App](https://github.com/conterra/mapapps-magnifier/blob/master/screenshot.JPG)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_magnifier/index.html

## Installation Guide
**Requirement: map.apps 4.12.0**

[dn_magnifier Documentation](https://github.com/conterra/mapapps-magnifier/tree/master/src/main/js/bundles/dn_magnifier)

## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
