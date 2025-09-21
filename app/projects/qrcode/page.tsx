"use client";

import React, { useState, type ChangeEvent } from "react";
import { QRCodeCanvas } from "qrcode.react";

import { Input } from "~/components/ui/input";

export default function QrCodeGenerator() {
  const [qrText, setQrText] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQrText(event.target.value);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <QRCodeCanvas value={qrText || "phoskee"} size={300} level="H" includeMargin />
      <Input
        type="text"
        placeholder="Inserisci il testo per il QR code"
        value={qrText}
        onChange={handleInputChange}
        className="max-w-sm"
      />
    </div>
  );
}
