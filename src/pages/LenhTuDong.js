
import apiConfig from '../../src/apiConfig.json'
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Spin } from 'antd';
import axios from 'axios';

// Hàm gọi API lấy dữ liệu layout kho theo yêu cầu
const callAPILayoutKho_BTP = async () => {
    try {
        const response = await axios.post(
            `${apiConfig.API_BASE_URL}/layoutkho/btp`,
            {
                tenNha: "Kho K3",
                idKho: 5,
                maVung: "B"
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        throw error;
    }
};

const LenhTuDong = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [hiddenModalVisible, setHiddenModalVisible] = useState(false);
    const [hiddenItems, setHiddenItems] = useState({}); // Lưu danh sách key của các dòng ẩn theo nhóm (theo selectedRow.key)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await callAPILayoutKho_BTP();

                // Giả sử API trả về dữ liệu trong response.data (mảng các đối tượng)
                // Tính tuổi tồn và các tổng tồn
                const today = new Date();
                const tuoiTonBTP = response.data.map(item => {
                    if (!item.ngayNhapBTP || item.ton === 0) return 0;
                    const ngayNhap = new Date(item.ngayNhapBTP);
                    return Math.floor((today - ngayNhap) / (1000 * 60 * 60 * 24));
                });

                // Tính tổng tồn theo mã đơn hàng (MDH) cho mỗi ItemCode - Tên sản phẩm - MDH
                const tonSanPhamMap = response.data.reduce((acc, item) => {
                    const key = `${item.itemCode}-${item.tenSanPham}-${item.maDonHang}`;
                    acc[key] = (acc[key] || 0) + item.ton;
                    return acc;
                }, {});

                // Tính tổng tồn theo sản phẩm (gộp theo ItemCode - Tên sản phẩm)
                const tonSanPham = response.data.reduce((acc, item) => {
                    const key = `${item.itemCode}-${item.tenSanPham}`;
                    acc[key] = (acc[key] || 0) + item.ton;
                    return acc;
                }, {});

                // Thêm thuộc tính tổng tồn và tuổi tồn vào mỗi phần tử
                const dataWithTonSanPham = response.data.map((item, index) => ({
                    ...item,
                    Ton_SanPhamTheoMDH: tonSanPhamMap[`${item.itemCode}-${item.tenSanPham}-${item.maDonHang}`],
                    Ton_SanPham: tonSanPham[`${item.itemCode}-${item.tenSanPham}`],
                    tuoiTonBTP: tuoiTonBTP[index]
                }));

                // Format lại dữ liệu theo từng dòng dựa trên vị trí kho
                const MaViTriKho = dataWithTonSanPham.map(item => item.maViTriKho);
                const PhanTram = dataWithTonSanPham.map(item => item.phanTram);
                const ItemCode = dataWithTonSanPham.map(item => item.itemCode);
                const Checkv = dataWithTonSanPham.map(item => item.checkv);
                const Ten_SanPham = dataWithTonSanPham.map(item => item.tenSanPham);
                const Ma_DonHang = dataWithTonSanPham.map(item => item.maDonHang);
                const Ton = dataWithTonSanPham.map(item => item.ton);
                const Ngay_NhapBTP = dataWithTonSanPham.map(item => item.ngayNhapBTP);
                const TongTonTheoMDH = dataWithTonSanPham.map(item => item.Ton_SanPhamTheoMDH);
                const TongTon = dataWithTonSanPham.map(item => item.Ton_SanPham);

                const formattedData = MaViTriKho.map((MaViTriKhoValue, index) => ({
                    rowTitle: `Hàng ${MaViTriKhoValue.slice(0, -2)}`, // Giả sử cắt 2 ký tự cuối
                    maViTriKho: MaViTriKhoValue,
                    phanTram: PhanTram[index],
                    details: {
                        data: [{
                            itemCode: ItemCode[index],
                            checkv: Checkv[index],
                            maDonHang: Ma_DonHang[index],
                            tenSanPham: Ten_SanPham[index],
                            ton: Ton[index],
                            tuoiTonBTP: tuoiTonBTP[index],
                            ngayNhapBTP: Ngay_NhapBTP[index],
                            tongTonTheoMDH: TongTonTheoMDH[index],
                            tongTon: TongTon[index],
                        }]
                    }
                }));

                // Nhóm dữ liệu theo rowTitle và maViTriKho để gom lại các item có cùng vị trí kho
                const groupedData = formattedData.reduce((acc, item) => {
                    const key = `${item.rowTitle}-${item.maViTriKho}`;
                    if (!acc[key]) {
                        acc[key] = {
                            rowTitle: item.rowTitle,
                            maViTriKho: item.maViTriKho,
                            phanTram: item.phanTram,
                            details: []
                        };
                    }
                    acc[key].details = [...acc[key].details, ...item.details.data];
                    return acc;
                }, {});

                const finalGroupedData = Object.values(groupedData).map((item, index) => ({
                    ...item,
                    key: index.toString(),
                    details: item.details.map((detail, idx) => ({ ...detail, key: `${index}-${idx}` }))
                }));

                setDataSource(finalGroupedData);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Khi nhấn vào hàng của bảng chính, hiển thị modal chi tiết
    const handleRowClick = (record) => {
        setSelectedRow(record);
        setModalVisible(true);
    };

    // Ẩn một dòng chi tiết trong bảng chi tiết
    const handleHideItem = (key) => {
        if (!selectedRow) return;
        const recordKey = selectedRow.key;
        setHiddenItems({
            ...hiddenItems,
            [recordKey]: [...(hiddenItems[recordKey] || []), key],
        });
    };

    // Hiện lại một dòng chi tiết đã bị ẩn
    const handleShowItem = (key) => {
        if (!selectedRow) return;
        const recordKey = selectedRow.key;
        setHiddenItems({
            ...hiddenItems,
            [recordKey]: (hiddenItems[recordKey] || []).filter(hiddenKey => hiddenKey !== key),
        });
    };

    // Các cột cho bảng chính (danh sách vị trí kho)
    const columns = [
        { title: 'Row Title', dataIndex: 'rowTitle', width: '30%' },
        { title: 'Mã Vị Trí Kho', dataIndex: 'maViTriKho', width: '30%' },
        { title: 'Phần Trăm', dataIndex: 'phanTram', width: '30%' },
    ];

    // Các cột cho bảng chi tiết (ItemCode trong từng nhóm)
    const detailColumns = [
        { title: 'Item Code', dataIndex: 'itemCode' },
        { title: 'Check V', dataIndex: 'checkv' },
        { title: 'Mã Đơn Hàng', dataIndex: 'maDonHang' },
        { title: 'Tên Sản Phẩm', dataIndex: 'tenSanPham' },
        { title: 'Tồn', dataIndex: 'ton' },
        { title: 'Tuổi Tồn BTP', dataIndex: 'tuoiTonBTP' },
        { title: 'Ngày Nhập BTP', dataIndex: 'ngayNhapBTP' },
        { title: 'Tổng Tồn Theo MDH', dataIndex: 'tongTonTheoMDH' },
        { title: 'Tổng Tồn', dataIndex: 'tongTon' },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <Button
                    danger
                    size="small"
                    onClick={() => handleHideItem(record.key)}
                >
                    Hide
                </Button>
            )
        },
    ];

    return (
        <div>
            {loading ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowClassName="clickable-row"
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record)
                    })}
                    pagination={false}
                />
            )}

            {/* Modal hiển thị bảng chi tiết của nhóm được chọn */}
            <Modal
                title={`Chi Tiết Vị Trí Kho: ${selectedRow?.maViTriKho}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={1500}
            >
                <Table
                    dataSource={
                        selectedRow
                            ? selectedRow.details.filter(
                                (item) => !(hiddenItems[selectedRow.key] || []).includes(item.key)
                            )
                            : []
                    }
                    columns={detailColumns}
                    pagination={false}
                />
                <Button
                    style={{ marginTop: 16 }}
                    type="primary"
                    onClick={() => setHiddenModalVisible(true)}
                >
                    Show Hidden Rows
                </Button>
            </Modal>

            {/* Modal hiển thị các dòng chi tiết đã bị ẩn */}
            <Modal
                title={`Các dòng đã ẩn của Vị Trí Kho: ${selectedRow?.maViTriKho}`}
                open={hiddenModalVisible}
                onCancel={() => setHiddenModalVisible(false)}
                footer={null}
                width={1500}
            >
                <Table
                    dataSource={
                        selectedRow
                            ? selectedRow.details.filter(
                                (item) => (hiddenItems[selectedRow.key] || []).includes(item.key)
                            )
                            : []
                    }
                    columns={[
                        { title: 'Item Code', dataIndex: 'itemCode' },
                        { title: 'Check V', dataIndex: 'checkv' },
                        { title: 'Mã Đơn Hàng', dataIndex: 'maDonHang' },
                        { title: 'Tên Sản Phẩm', dataIndex: 'tenSanPham' },
                        { title: 'Tồn', dataIndex: 'ton' },
                        { title: 'Tuổi Tồn BTP', dataIndex: 'tuoiTonBTP' },
                        { title: 'Ngày Nhập BTP', dataIndex: 'ngayNhapBTP' },
                        { title: 'Tổng Tồn Theo MDH', dataIndex: 'tongTonTheoMDH' },
                        { title: 'Tổng Tồn', dataIndex: 'tongTon' },
                        {
                            title: 'Action',
                            dataIndex: 'action',
                            render: (_, record) => (
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => handleShowItem(record.key)}
                                >
                                    Show Again
                                </Button>
                            )
                        }
                    ]}
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default LenhTuDong;
