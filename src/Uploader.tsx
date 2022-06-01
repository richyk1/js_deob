import { Fade } from "@chakra-ui/react";
import React, { useState } from "react";

const Uploader = (props: any) => {
  // Initially, no file is selected
  const [selectedFile, setSelectedFile] = useState<File>();

  // On file select (from the pop up)
  const onFileChange = (event: any) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (selectedFile) {
      selectedFile.text().then((text) => {
        props.codeCallback(text);
      });
      return (
        <Fade in={true}>
          <div>
            <h2>File Details:</h2>
            <p>File Type: {selectedFile.type}</p>
            <p>File Name: {selectedFile.name}</p>
          </div>
        </Fade>
      );
    } else {
      return (
        <div>
          <br />
        </div>
      );
    }
  };

  return (
    <div>
      <h1>GeeksforGeeks</h1>
      <h3>File Upload using React!</h3>
      <div>
        <input type="file" onChange={onFileChange} />
      </div>
      {fileData()}
    </div>
  );
};

export default Uploader;
