import React, { useEffect, useRef, useState } from "react";
import PresentationComponent from './styles';

function PresentationContainer() {
  const customBgSelectorRef = useRef(null);
  const canvasRef = useRef(null);
  const MIME_TYPES_ALLOWED = [".pdf",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".txt",".rtf",".odt",".ods",".odp",".odg",".odc",".odi",".jpg",".jpeg",".png",".webp"];
  const [selectedFile, setSelectedFile] = useState(null);
  
  const prstInput = () => {
    if(customBgSelectorRef.current){
      customBgSelectorRef.current.click();
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setSelectedFile(URL.createObjectURL(file));
  };

  useEffect(() => {
    if(selectedFile) {
      const img = new Image();
      img.onload = function() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        canvas.style.display = 'block';
      }
      img.src = selectedFile;
    }
  }, [selectedFile]);
	
	return (
    <div style={{ position : "relative" }}>
      <canvas ref={canvasRef} style={{ display: 'none', position: 'fixed', top: '50%', left: '67.5%', transform: 'translate(-50%, -50%)' }} />
      <PresentationComponent onClick={prstInput} />
      <input
        ref={customBgSelectorRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept={MIME_TYPES_ALLOWED.join(', ')}
      />
    </div>
	);
};

export default PresentationContainer;