import * as React from 'react';
import {Html5QrcodeScanner} from "html5-qrcode"
import { useState } from 'react';
import { useEffect } from 'react';

function QRScanner() {
  const [scannerResult, setScannerResult] = useState(null);

   useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox:{
        width:250,
        height:250,
      },
      fps: 5,
    })
    scanner.render(success, error)
  
    function success(result){
      scanner.clear();
      setScannerResult(result)
    }
  
    function error(err){
      console.warn(err)
    }
   },[])

  

  return (
    <div>
    {scannerResult 
      ?<div>success: <a href={'http://'+scannerResult}>{scannerResult}</a></div>
      :<div id="reader"></div>
    }
    
    </div>
  );
  
}

export default QRScanner; 


