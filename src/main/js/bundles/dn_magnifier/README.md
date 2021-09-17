# Magnifier
The Magnifier allows end users to show a portion of the view as a magnified image.

## Usage
**Requirement: map.apps 4.12.0**

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
        "offsetEnabled": true,
        "overlayEnabled": true,
        "overlayUrl": null,
        "size": 120,
        "showControlWidget": true
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
        "offsetEnabled": true,
        "overlayEnabled": true,
        "overlayUrl": null,
        "size": 200,
        "showControlWidget": true
    }
}
```

| Property          | Type                      | Possible Values               | Default                  | Description                                                                                                                                             |
|-------------------|---------------------------|-------------------------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| factor            | number                    |                               | ```1.5```                | Controls the amount of magnification to display.                                                                                                        |
| maskEnabled       | boolean                   | ```true``` &#124; ```false``` | ```true```               | Indicates whether the mask image is enabled.                                                                                                            |
| maskUrl           | string                    |                               | ```null```               | The mask url points to an image that determines the visible area of the magnified image (alpha channel).                                                |
| offsetEnabled     | boolean                   | ```true``` &#124; ```false``` | ```true```               | Enable or disable the offset.                                                                                                                           |
| overlayEnabled    | boolean                   | ```true``` &#124; ```false``` | ```true```               | Indicates whether the overlay image (magnifier border) is enabled.                                                                                      |
| overlayUrl        | string                    |                               | ```null```               | The overlay url points to an image that is displayed on top of the magnified image.                                                                     |
| size              | number                    |                               | ```120```                | The size of the magnifier in pixels.                                                                                                                    |
| showControlWidget | boolean                   | ```true``` &#124; ```false``` | ```false```              | Indicates whether the magnifierControlWidget is visible.                                                                                                |
