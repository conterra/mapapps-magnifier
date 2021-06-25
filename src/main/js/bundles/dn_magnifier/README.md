# Magnifier
The Magnifier allows end users to show a portion of the view as a magnified image.

## Usage
**Requirement: map.apps 4.4.0**

1. First you need to add the bundle dn_magnifier to your app.
2. Then you can configure it.

To make the functions of this bundle available to the user, the following tool can be added to a toolset:

| Tool ID             | Component           | Description              |
|---------------------|---------------------|--------------------------|
| magnifierToggleTool | MagnifierToggleTool | Show or hide the widget. |

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
            "x": 60,
            "y": 60
        },
        "overlayEnabled": true,
        "overlayUrl": null,
        "size": 120,
        "visible": false
    }
}
```
```
// Stronger magnification and larger magnified area
"Config": {
    "properties": {
        "factor": 5,
        "maskEnabled": true,
        "maskUrl": null,
        "offset": {
            "x": 128,
            "y": 128
        },
        "overlayEnabled": true,
        "overlayUrl": null,
        "size": 256,
        "visible": false
    }
}
```

| Property       | Type                      | Possible Values               | Default                  | Description                                                                                                                                             |
|----------------|---------------------------|-------------------------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| factor         | number                    |                               | ```1.5```                | Controls the amount of magnification to display.                                                                                              |
| maskEnabled    | boolean                   | ```true``` &#124; ```false``` | ```true```               | Indicates whether the mask image is enabled.                                                                                     |
| maskUrl        | string                    |                               | ```null```               | The mask url points to an image that determines the visible area of the magnified image (alpha channel).                                                                                                                    |
| offset         | esri/geometry/ScreenPoint |                               | ```{"x": 60, "y": 60}``` | The offset of the magnifier in pixels.                    |
| overlayEnabled | boolean                   | ```true``` &#124; ```false``` | ```true```               | Indicates whether the overlay image is enabled.  |
| overlayUrl     | string                    |                               | ```null```               | The overlay url points to an image that is displayed on top of the magnified image.                                                                                              |
| size           | number                    |                               | ```120```                | The size of the magnifier in pixels.                                                                                                                    |
| visible        | boolean                   | ```true``` &#124; ```false``` | ```false```              | Indicates whether the magnifier is visible. |
