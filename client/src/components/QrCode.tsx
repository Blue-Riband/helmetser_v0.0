
import { useState } from "react";
import  QrReader from "react-web-qr-reader"
import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const QrCode: React.FC<any> = props =>  {
  let history = useHistory()
  const delay = 500;

  const previewStyle = {
    height: 240,
    width: 320
  };

  const [result, setResult] = useState<string>("");

  const handleScan = (res: any) => {
    console.log(res)
    
    if (res) {
      setResult(res.data);
    }
  };

  const handleError = (error: any) => {
    console.log(error);
  };

  useEffect(()=>{
    if(result != ""){
      history.push('/map')
    }
  },[result])

  return (
    <>
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{result}</p>
    </>
  );
};

export default QrCode;
