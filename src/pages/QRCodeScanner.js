import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { message } from "antd";
import "antd/dist/antd.css";

export default function QRCodeScanner() {
    const [qrData, setQrData] = useState(null);
    const [scanned, setScanned] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        const startScanning = async () => {
            if (scanner.isScanning) return; // Kiểm tra nếu đang chạy thì không restart

            try {
                await scanner.start(
                    { facingMode: "environment" }, // Dùng camera sau
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => handleBarCodeScanned(decodedText),
                    (errorMessage) => console.log("Lỗi quét:", errorMessage)
                );
            } catch (err) {
                console.error("Lỗi khởi chạy scanner:", err);
            }
        };

        startScanning();

        return () => {
            if (scanner.isScanning) {
                scanner.stop().catch(() => { }); // Chỉ dừng nếu đang chạy
            }
        };
    }, [scanned]);

    const handleBarCodeScanned = (data) => {
        if (scanned) return;

        setScanned(true);

        try {
            const qrObject = JSON.parse(data);
            setQrData(qrObject.MaPallet);
            message.success(`QR Code Scanned: Mã Pallet ${qrObject.MaPallet}`, 1.5);
        } catch (error) {
            message.error("Invalid QR Data: Không phải định dạng JSON hợp lệ!", 1.5);
        }

        setTimeout(() => {
            setScanned(false);
        }, 1000);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Quét QR Code</h2>
            <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
            {qrData && <p><strong>Mã QR:</strong> {qrData}</p>}
        </div>
    );
}
