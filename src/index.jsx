import React, {PropTypes, Component} from 'react'

class TransformableDiv extends Component {
  constructor(props) {
    super(props)
    this.state = this._getInitialState(props)
  }

  _getInitialState(props) {
    const {initWidth, initHeight, initTopOffset, initLeftOffset} = props
    return {
      rotate: 0,
      wrapTopOffset: initTopOffset,
      wrapLeftOffset: initLeftOffset,
      wrapSize: {
        width: initWidth,
        height: initHeight
      },
      ready4Drag: false,
      clientX: undefined, // mouse position
      clientY: undefined,
      zoom: 1
    }
  }

  static propTypes = {
    initWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    initHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    initTopOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    initLeftOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    enableRotate: PropTypes.bool,
    rotateWise: PropTypes.oneOf(['clockwise', 'unclockwise']),
    onRotate: PropTypes.func,
    enableDrag: PropTypes.bool,
    onDrag: PropTypes.func,
    enableZoom: PropTypes.bool,
    zoomRange: PropTypes.array,
    onZoom: PropTypes.func,
  }

  static defaultProps = {
    enableRotate: true,
    enableDrag: true,
    enableZoom: true,
    zoomRange: [0.01, 50],
    initWidth: 100,
    initHeight: 100,
    initTopOffset: 0,
    initLeftOffset: 0,
    rotateWise: 'clockwise'
  }

  rotate() {
    const {rotate} = this.state
    const {onRotate, enableRotate, rotateWise} = this.props
    if (enableRotate) {
      const increament = rotateWise === 'clockwise' ? 90 : -90
      const newRotate = (rotate + increament) % 360
      this.setState({
        rotate: newRotate
      })
      onRotate && onRotate({...this.state, rotate: newRotate})
    }
  }

  render() {
    const {enableDrag, enableZoom, className} = this.props

    const {rotate, wrapTopOffset, wrapLeftOffset, wrapSize} = this.state
    let rotateStyle = `rotate(${rotate}deg)`
    let wrapperStyle = {
      left: wrapLeftOffset,
      top: wrapTopOffset,
      'transform': rotateStyle,
      'msTransform': rotateStyle,
      'MozTransform': rotateStyle,
      'OTransform': rotateStyle,
      'WebkitTransform': rotateStyle
    }

    if (wrapSize) {
      if (wrapSize.width) {
        wrapperStyle.width = wrapSize.width
      }
      if (wrapSize.height) {
        wrapperStyle.height = wrapSize.height
      }
    }

    wrapperStyle = {
      position: 'absolute',
      cursor: 'move',
      ...wrapperStyle
    }

    return (
      <div
        ref="container"
        className={className}
        style={{position: 'relative'}}>
        <div
          ref={(c) => (this._imgWrap = c)}
          onDragStart={enableDrag ? ::this._handlePreventDefault : this._noop}
          onMouseDown={enableDrag ? ::this._handleDragStart : this._noop}
          onMouseMove={enableDrag ? ::this._handleDrag : this._noop}
          onMouseUp={enableDrag ? ::this._handleDragEnd : this._noop}
          onMouseOut={enableDrag ? ::this._handleMouseOut : this._noop}
          onWheel={enableZoom ? ::this._handleWheel : this._noop}
          style={wrapperStyle}>
          {this.props.children}
        </div>
      </div>
    )
  }

  _noop() {
    // no operation
  }

  _handleMouseOut() {
    this.setState({
      ready4Drag: false
    })
  }

  _handlePreventDefault(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  _handleDragStart(e) {
    this.setState({
      clientX: e.clientX,
      clientY: e.clientY,
      ready4Drag: true
    })
  }

  _handleDrag(e) {
    if (this.state.ready4Drag) {
      const {wrapLeftOffset, wrapTopOffset, clientX, clientY} = this.state
      let xOffset = wrapLeftOffset + e.clientX - clientX
      let yOffset = wrapTopOffset + e.clientY - clientY
      let newState = {
        clientX: e.clientX,
        clientY: e.clientY,
        wrapTopOffset: yOffset,
        wrapLeftOffset: xOffset
      }
      this.setState({ ...newState })
      const {onDrag} = this.props
      onDrag && onDrag({ ...this.state, ...newState })
    }
  }

  _handleDragEnd(e) {
    this.setState({
      ready4Drag: false
    })
  }

  _handleWheel(e) {
    e.preventDefault()
    const {zoom, wrapLeftOffset, wrapTopOffset, wrapSize} = this.state
    const {onZoom, zoomRange} = this.props
    const minRatio = zoomRange[0] || 0.01
    const maxRatio = zoomRange[1] || 50

    let step = 0.1
    let ratio, newZoom
    if (e.deltaY > 0) { // wheel down
      // if (wrapSize.width < 20 || wrapSize.height < 20) {
      //   onZoom && onZoom(this.state)
      //   return
      // }
      ratio = 1 / (1 + step)
    } else if (e.deltaY < 0) { // wheel up
      ratio = 1 + step
    }
    newZoom = zoom * ratio
    if (newZoom > maxRatio || newZoom < minRatio) {
      onZoom && onZoom(this.state)
      return
    }

    if (newZoom && wrapSize) {
      let newWidth = wrapSize.width * ratio
      let newHeight = wrapSize.height * ratio
      // adjust zoom center, ref: https://github.com/fengyuanchen/cropper
      let mX = e.pageX // mouse position
      let mY = e.pageY
      let {left: containerOffsetLeft, top: containerOffsetTop} = this._getContainerRect()
      let newOffset = {left: wrapLeftOffset, top: wrapTopOffset}
      newOffset.left -= (newWidth - wrapSize.width) * (
        ((mX - containerOffsetLeft) - newOffset.left) / wrapSize.width
      )

      newOffset.top -= (newHeight - wrapSize.height) * (
        ((mY - containerOffsetTop) - newOffset.top) / wrapSize.height
      )
      const newState = {
        zoom: newZoom,
        wrapSize: {...wrapSize, width: newWidth, height: newHeight},
        wrapLeftOffset: newOffset.left,
        wrapTopOffset: newOffset.top
      }
      this.setState({ ...newState })
      onZoom && onZoom({ ...this.state, ...newState })
    }
  }

  _getContainerRect() {
    return this.refs.container.getBoundingClientRect()
  }
}

export default TransformableDiv
