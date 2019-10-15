import React, { Component } from 'react'
import './styles.css'
import Upload from './upload/index'

class FileUploader extends Component {
  render() {
    return (
      <div className="App">
        <div className="Card">
          <Upload />
        </div>
      </div>
    )
  }
}

export default FileUploader
