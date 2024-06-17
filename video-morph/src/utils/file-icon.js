import {
    BsFillCameraVideoFill,
  } from 'react-icons/bs';
  import { AiFillFile } from 'react-icons/ai';

  
  export default function fileToIcon(file_type) {
    if (file_type.includes('video')) return <BsFillCameraVideoFill />;
    else return <AiFillFile />;
  }
  