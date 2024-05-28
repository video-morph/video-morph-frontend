"use client"

import React from 'react';
import ReactDropzone from 'react-dropzone';

const Dropzone = () => {
  return (
    <ReactDropzone>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Dropzone</p>
        </div>
      )}
    </ReactDropzone>
  );
}

export default Dropzone;

