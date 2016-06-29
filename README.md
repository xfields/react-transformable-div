# react-transformable-widget
---
A transformable (dragable, scalable, rotatable) wrapper.

## Install
npm install git+https://github.com/xiefei89/react-transformable-div.git

## Usage
```js
import TransformableDiv from 'react-transformable-div'

render() {
  return (
    <div>
      <TransformableDiv
        initWidth="960"
        initHeight="540">
        <img style={{width: '100%', height: '100%'}} src="your.img.src"/>
      </TransformableDiv>
    </div>
  )
}
```

## API

props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| initWidth | initial width of div | Number or String | 100 |
| initHeight | initial height of div | Number or String | 100 |
| initTopOffset | initial top offset of div | Number or String | 0 |
| initLeftOffset | initial left offset of div | Number or String | 0 |
| enableRotate| whether enable rotate | Boolean | true |
| enableDrag| whether enable drag | Boolean | true |
| enableZoom| whether enable zoom | Boolean | true |
| rotateWise | rotate clockwise | 'clockwise' or 'anticlockwise' | 'clockwise' |
| zoomRange| minimum and maximum ratio of scale | Boolean | [0.01, 50] |
| onRotate| called when div is rotated | Function | - |
| onDrag| called when div is dragged | Function | - |
| onZoom| called when div is zoomed | Function | - |

## Development

```
npm install
npm start
```

## Example

http://localhost:8003/examples/

## License

react-transformable-widget is released under the MIT license.
