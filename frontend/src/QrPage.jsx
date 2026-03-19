import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function TableQR() {
  return (
    <div>
      <h2>Table 1</h2>
      <QRCodeCanvas
        value="https://dineexpress.netlify.app/?table=1"
        size={180}
      />
    </div>
  );
}
