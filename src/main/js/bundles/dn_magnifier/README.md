# dn_magnifier
The Magnifier allows end users to show a portion of the view as a magnified image.

## Usage
**Requirement: map.apps 4.4.0**

1. First you need to add the bundle dn_magnifier to your app.
2. Then you can configure it.

To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID             | Component           | Description              |
|---------------------|---------------------|--------------------------|
| magnifierToggleTool | magnifierToggleTool | Show or hide the widget. |

## Configuration Reference

### Config

#### Sample configurations
```
"Config": {
    "properties": {
        "factor": 1.5,
        "maskEnabled": true,
        "maskUrl": null,
        "offset": {
            "x": 0,
            "y": 0
        },
        "overlayEnabled": true,
        "overlayUrl": null,
        "position": null,
        "size": 120,
        "visible": false
    }
}
```
```
// Stronger magnification and larger magnified area, cursor no longer in magnification
"Config": {
    "properties": {
        "factor": 5,
        "maskEnabled": true,
        "maskUrl": null,
        "offset": {
            "x": 0,
            "y": 0
        },
        "overlayEnabled": true,
        "overlayUrl": null,
        "position": null,
        "size": 256,
        "visible": false
    }
}
```

| Property       | Type                    | Possible Values               | Default                | Description                                                                                                                                             |
|----------------|-------------------------|-------------------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| factor         | number                  |                               | ```1.5```              | The scale multiplier between the map and the overview map.                                                                                              |
| maskEnabled    | boolean                 | ```true``` &#124; ```false``` | ```true```             | Set fix overview map scale. If set scaleMultiplier will be ignored.                                                                                     |
| maskUrl        | string                  |                               | ```null```             | Enable rotation of the overview map.                                                                                                                    |
| offset         | esri.Screenpoint Object |                               | ```{"x": 0, "y": 0}``` | Choose one of the well known basemap IDs (https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap) or an own basemap config |
| overlayEnabled | boolean                 | ```true``` &#124; ```false``` | ```true```             | Add possible UI components to the overview map (https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html#components)  |
| overlayUrl     | string                  |                               | ```null```             | The scale multiplier between the map and the overview map.                                                                                              |
| position       | esri.Screenpoint Object |                               | ```null```             | Set fix overview map scale. If set scaleMultiplier will be ignored.                                                                                     |
| size           | number                  |                               | ```120```              | Enable rotation of the overview map.                                                                                                                    |
| visible        | boolean                 | ```true``` &#124; ```false``` | ```false```            | Choose one of the well known basemap IDs (https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap) or an own basemap config |
