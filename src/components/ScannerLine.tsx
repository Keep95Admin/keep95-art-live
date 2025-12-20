// src/components/ScannerLine.tsx ← THIS ONE WORKED
import React from 'react';

export default function ScannerLine() {
  return (
    <div className="relative h-px w-full overflow-hidden bg-black">
      <div className="absolute top-0 h-px w-52 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_8px_#06b6d4] scanner-bar" />
    </div>
  );
}