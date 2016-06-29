import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import TransformableDiv from '../index.jsx'

class Test extends React.Component {
  state = {
    zoom: 0,
    wrapTopOffset: 0,
    wrapLeftOffset: 0,
    wrapSize: {
      width: 960,
      height: 540
    },
    rotate: 0
  }

  render() {
    const {state} = this

    return (
      <div style={{margin: 20}}>
        <ul>
          <li>Wheel up to zoom in</li>
          <li>Wheel down to zoom out</li>
          <li>Drag to move</li>
          <li>Click rotate to rotate</li>
        </ul>
        <div style={{margin: 20}}>
          <button onClick={this._handleRotate.bind(this)}>Rotate</button>
        </div>
        <div style={{position: 'relative', overflow: 'hidden', height: 500}}>
          <TransformableDiv
            ref="widget"
            initWidth="960"
            initHeight="540"
            rotateWise="anticlockwise"
            onDrag={this._update.bind(this)}
            onRotate={this._update.bind(this)}
            onZoom={this._update.bind(this)}
            enableZoom>
            <img style={{width: '100%', height: '100%'}} src="http://s.cn.bing.net/az/hprichbg/rb/KansasCropCircles_ZH-CN9416992875_1920x1080.jpg"/>
          </TransformableDiv>
        </div>
        <ul>
          <li>zoom: {state.zoom}</li>
          <li>rotate: {state.rotate}</li>
          <li>size: {`${parseInt(state.wrapSize.width)} * ${parseInt(state.wrapSize.height)}`}</li>
          <li>offset: {`${parseInt(state.wrapTopOffset)}, ${parseInt(state.wrapLeftOffset)}`}</li>
        </ul>
      </div>
    )
  }

  _update(s) {
    this.setState({
      ...s
    })
  }

  _handleRotate() {
    this.refs.widget && this.refs.widget.rotate()
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'))
