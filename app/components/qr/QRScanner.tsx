'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, X, ShieldCheck, Zap, Info } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop scanner:', err);
      }
    }
  }, [isScanning]);

  const startScanning = useCallback(async () => {
    if (!containerRef.current || isInitialized.current) return;
    
    setError(null);
    setHasPermission(null);
    
    try {
      const devices = await Html5Qrcode.getCameras();
      
      if (devices && devices.length) {
        const backCamera = devices.find(device => device.label.toLowerCase().includes('back')) || devices[0];
        
        scannerRef.current = new Html5Qrcode('qr-reader-container');
        
        await scannerRef.current.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // On successful scan
            stopScanning();
            onScan(decodedText);
          },
          (errorMessage) => {
            // This fires frequently when no QR is in view, so we don't set error state here
            console.log('QR Scan error:', errorMessage);
          }
        );
        
        setIsScanning(true);
        setHasPermission(true);
        isInitialized.current = true;
      } else {
        setError('Nenhuma câmera encontrada');
        setHasPermission(false);
      }
    } catch (err) {
      console.error('Camera permission error:', err);
      setHasPermission(false);
      setError('Permissão de câmera negada. Por favor, permita o acesso à câmera.');
    }
  }, [onScan, stopScanning]);

  useEffect(() => {
    startScanning();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
      }
      isInitialized.current = false;
    };
  }, [startScanning]);

  const handleRefresh = () => {
    stopScanning().then(() => {
      isInitialized.current = false;
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      startScanning();
    });
  };

  const handleManualPhoto = () => {
    // Trigger file input for image-based QR scanning
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && scannerRef.current) {
        try {
          const result = await scannerRef.current.scanFile(file, true);
          onScan(result);
        } catch (err) {
          setError('Não foi possível ler o QR Code da imagem');
        }
      }
    };
    fileInput.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-shark-950 flex flex-col items-center justify-between p-6"
    >
      {/* Header Controls */}
      <div className="w-full flex justify-between items-center z-20">
        <button 
          onClick={() => {
            stopScanning();
            onClose();
          }}
          className="p-3 bg-shark-800/50 backdrop-blur-md rounded-full text-white hover:bg-shark-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-white font-bold uppercase tracking-widest text-sm">Check-in SharkBJJ</h2>
        <button 
          onClick={handleRefresh}
          disabled={isScanning}
          className={`p-3 bg-shark-800/50 backdrop-blur-md rounded-full text-white hover:bg-shark-700 transition-colors ${isScanning ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {/* Scanner Viewport */}
      <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center">
        {/* Camera Feed Container */}
        <div className="absolute inset-0 bg-shark-900 rounded-[2.5rem] overflow-hidden border-2 border-shark-800">
          <div 
            id="qr-reader-container" 
            ref={containerRef}
            className="w-full h-full object-cover"
            style={{ 
              position: 'absolute',
              inset: 0,
              backgroundColor: '#0a0a0a'
            }}
          />
          
          {/* Fallback gradient when no permission */}
          {hasPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-shark-900">
              <div className="text-center p-6">
                <ShieldCheck className="w-16 h-16 text-shark-600 mx-auto mb-4" />
                <p className="text-shark-300 text-sm">{error || 'Permissão de câmera necessária'}</p>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {hasPermission === null && (
            <div className="absolute inset-0 flex items-center justify-center bg-shark-900">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-shark-700 rounded-full mb-4" />
                <p className="text-shark-400 text-sm">Iniciando câmera...</p>
              </div>
            </div>
          )}
        </div>

        {/* Scanning Frame Overlay */}
        <div className="relative w-[80%] h-[80%] z-10 pointer-events-none">
          {/* Corner Borders */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary-500 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary-500 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary-500 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary-500 rounded-br-3xl" />

          {/* Scanning Line Animation */}
          {isScanning && (
            <motion.div 
              animate={{ 
                top: ["5%", "95%", "5%"],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
            />
          )}

          {/* Central Hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <ShieldCheck className={`w-24 h-24 ${isScanning ? 'text-primary-500' : 'text-shark-600'}`} />
          </div>
        </div>

        {/* Scan Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-tighter flex items-center gap-2 shadow-xl transition-colors ${
            isScanning ? 'bg-primary-600 text-white' : 'bg-shark-700 text-shark-300'
          }`}
        >
          <Zap className={`w-3 h-3 fill-current ${isScanning ? 'animate-pulse' : ''}`} />
          {isScanning ? 'Escaneando...' : hasPermission === false ? 'Câmera Bloqueada' : 'Iniciando...'}
        </motion.div>
      </div>

      {/* Instructions & Footer */}
      <div className="w-full max-w-xs space-y-6 z-20 mb-8">
        <div className="bg-shark-800/40 border border-shark-700/50 p-4 rounded-2xl backdrop-blur-sm">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary-400 shrink-0" />
            <p className="text-shark-300 text-sm leading-relaxed">
              {error || 'Posicione o QR Code gerado no seu app dentro da moldura para confirmar presença.'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleManualPhoto}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-medium transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Camera className="w-5 h-5" />
          Tirar Foto Manual
        </button>
      </div>

      {/* Progress Circles Decor */}
      <div className="absolute bottom-[-5%] left-[-10%] w-64 h-64 bg-primary-900/10 blur-[100px] rounded-full pointer-events-none" />
    </motion.div>
  );
}