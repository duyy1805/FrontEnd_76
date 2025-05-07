import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Modal, Button, Table, Tag, message, Tooltip } from "antd";
import axios from "axios";
import "antd/dist/antd.css";
import "./Qr.css";

const API_URL = "http://localhost:5000/api/thietbi";
const API_UPDATE_RESULT = "http://localhost:5000/api/capnhatketquakiemtra"; // API để cập nhật kết quả kiểm tra

function Qr() {
    const [devices, setDevices] = useState([]);
    const [scannedData, setScannedData] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showDeviceList, setShowDeviceList] = useState(false);
    const scannerRef = useRef(null);

    // Lấy danh sách thiết bị từ API
    const fetchDevices = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log("Danh sách thiết bị:", response.data);
            setDevices(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu từ API:", error);
            message.error("Không thể tải danh sách thiết bị");
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchDevices();
    }, []);


    // Chỉ khởi tạo scanner khi devices đã có dữ liệu
    useEffect(() => {
        if (devices.length > 0 && !scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scannerRef.current.render(
                (decodedText) => {
                    console.log("QR Code Scanned:", decodedText);
                    setScannedData(decodedText);

                    try {
                        const scannedDevice = JSON.parse(decodedText);
                        console.log("Scanned Device:", scannedDevice);

                        // Tìm thiết bị trong danh sách
                        const deviceList = devices.filter(d => d.MaThietBi === scannedDevice.MaThietBi);
                        console.log(devices);
                        if (deviceList.length > 0) {
                            setSelectedDevice(deviceList);
                            setModalVisible(true);
                        } else {
                            message.warning("Thiết bị không tồn tại trong danh sách.");
                        }
                    } catch (error) {
                        message.error("QR Code không hợp lệ!");
                    }
                },
                (error) => {
                    console.error("QR Scan Error:", error);
                }
            );
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
                scannerRef.current = null;
            }
        };
    }, [devices]); // Chỉ chạy khi `devices` thay đổi
    // Tạo nội dung QR Code
    const generateQRCode = (device) => {
        return JSON.stringify({ MaThietBi: device.MaThietBi, LoaiPhuongTien: device.LoaiPhuongTien });
    };

    // Hàm cập nhật kết quả kiểm tra
    const updateTestResult = async (IDNoiDungKiemTra, KetQua) => {
        try {
            await axios.post(API_UPDATE_RESULT, { IDNoiDungKiemTra, KetQua });
            message.success(`Cập nhật kết quả thành công: ${KetQua}`);
            // Gọi lại API để cập nhật dữ liệu mới
            fetchDevices();

        } catch (error) {
            console.error("Lỗi khi cập nhật kết quả:", error);
            message.error("Không thể cập nhật kết quả kiểm tra.");
        }
    };

    // Cột bảng hiển thị nội dung kiểm tra
    const columns = [
        {
            title: "Nội Dung Kiểm Tra",
            dataIndex: "NoiDungKiemTra",
            key: "NoiDungKiemTra",
        },
        {
            title: "Kết Quả",
            dataIndex: "KetQua",
            key: "KetQua",
            render: (text) => (
                text ? <Tag color={text === "Đạt" ? "green" : "red"}>{text}</Tag> : <Tag color="gray">Chưa kiểm tra</Tag>
            )
        },
        {
            title: "Thời Gian Kiểm Tra",
            dataIndex: "ThoiGianKiemTra",
            key: "ThoiGianKiemTra",
            render: (text) =>
                text
                    ? new Date(text).toISOString().replace("T", " ").replace("Z", "").split(".")[0]
                    : "-"
        },
        {
            title: "Thao Tác",
            key: "action",
            render: (text, record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            updateTestResult(record.IDNoiDungKiemTra, "Đạt");
                            // Cập nhật lại kết quả và thời gian trong bảng
                            const updatedDevice = selectedDevice.map(d =>
                                d.NoiDungKiemTra === record.NoiDungKiemTra
                                    ? { ...d, KetQua: "Đạt", ThoiGianKiemTra: new Date().toISOString().replace("T", " ").replace("Z", "").split(".")[0] } // cập nhật thời gian mới
                                    : d
                            );
                            setSelectedDevice(updatedDevice);
                        }}
                        disabled={record.KetQua === "Đạt"}
                    >
                        Đạt
                    </Button>
                    <Button
                        type="primary" danger
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                            updateTestResult(record.IDNoiDungKiemTra, "Không đạt");
                            // Cập nhật lại kết quả và thời gian trong bảng
                            const updatedDevice = selectedDevice.map(d =>
                                d.NoiDungKiemTra === record.NoiDungKiemTra
                                    ? { ...d, KetQua: "Không đạt", ThoiGianKiemTra: new Date().toISOString().replace("T", " ").replace("Z", "").split(".")[0] }
                                    : d
                            );
                            setSelectedDevice(updatedDevice);
                        }}
                        disabled={record.KetQua === "Không đạt"}
                    >
                        Không đạt
                    </Button>
                </div>
            )
        }

    ];


    const createFilters = (key) => {
        const uniqueValues = [...new Set(devices.map((item) => item[key]))];
        return uniqueValues.map((value) => ({
            text: value,
            value,
        }));
    };

    // Tạo bộ lọc
    const LPTFilters = createFilters('LoaiPhuongTien');
    const columns_ = [
        {
            title: "Loại Phương Tiện",
            dataIndex: "LoaiPhuongTien",
            key: "LoaiPhuongTien",
            filters: LPTFilters,
            filterSearch: true,
            onFilter: (value, record) => record.LoaiPhuongTien.includes(value),
            ellipsis: { showTitle: false },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
        },
        {
            title: "Vị Trí",
            dataIndex: "ViTri",
            key: "ViTri",
            render: (text) => text || "Không xác định",
        },
        {
            title: "QR Code",
            dataIndex: "QRCode",
            key: "QRCode",
            render: (_, record) => <QRCodeCanvas value={generateQRCode(record)} size={64} />,
        },
    ];



    return (
        <div className="Qr">
            <h1>Kiểm Tra Thiết Bị</h1>

            {/* Quét QR Code */}
            <div className="qr-reader">
                <h2>Quét QR Code</h2>
                <div id="qr-reader" style={{ width: "100%" }}></div>
            </div>

            {/* Nút hiển thị danh sách thiết bị */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                <Button type="primary" onClick={() => setShowDeviceList(true)}>
                    Hiển Thị Danh Sách Thiết Bị
                </Button>
            </div>

            {/* Modal hiển thị danh sách thiết bị */}
            <Modal
                title="Danh Sách Thiết Bị"
                open={showDeviceList}
                onCancel={() => setShowDeviceList(false)}
                footer={[<Button key="close" onClick={() => setShowDeviceList(false)}>Đóng</Button>]}
            >
                <Table
                    dataSource={Array.from(new Set(devices.map(d => d.MaThietBi))).map((MaThietBi) => {
                        const deviceGroup = devices.find(d => d.MaThietBi === MaThietBi);
                        return {
                            key: MaThietBi,
                            MaThietBi: MaThietBi,
                            LoaiPhuongTien: deviceGroup?.LoaiPhuongTien,
                            ViTri: deviceGroup?.ViTri,
                            QRCode: deviceGroup
                        };
                    })}
                    columns={columns_}
                    pagination={false}
                    scroll={{ y: 400 }}
                />
            </Modal>


            {/* Modal hiển thị nội dung kiểm tra thiết bị */}
            <Modal
                title="Thông Tin Kiểm Tra"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                width={window.innerWidth < 768 ? "90%" : "50%"} // 90% màn hình trên mobile
                footer={[<Button key="close" onClick={() => setModalVisible(false)}>Đóng</Button>]}
            >
                {selectedDevice && (
                    <div style={{ overflowX: 'auto' }}>
                        <h3>{selectedDevice[0]?.LoaiPhuongTien}</h3>
                        <Table
                            dataSource={selectedDevice}
                            columns={columns}
                            rowKey="NoiDungKiemTra"
                            pagination={false}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Qr;
