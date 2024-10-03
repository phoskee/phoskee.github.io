"use client"
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Input } from '~/components/ui/input';

export default function QrCodeGenerator() {
  const [qrText, setQrText] = useState('');

  const handleInputChange = (e) => {
    setQrText(e.target.value);
  };

  return (
    <div>

      <QRCodeCanvas value={qrText} size={300} level={"H"} marginSize ={2} />
      <Input
        type="text"
        placeholder="Inserisci il testo per il QR code"
        value={qrText}
        onChange={handleInputChange}
        className="mt-4"
      />

      
    </div>
  );
}
