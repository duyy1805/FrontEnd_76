
import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from "react-apexcharts";
import {
    Typography, Table,
    Tooltip, Modal, Row, Col,
    Card, Input, Button, Select, Space,
    List, Breadcrumb, notification, Dropdown
} from "antd";
import {
    MinusOutlined, SearchOutlined,
    StarOutlined,
    TwitterOutlined,
    FacebookFilled,
    FullscreenOutlined, FullscreenExitOutlined,
} from "@ant-design/icons";
import axios from 'axios';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import "../assets/styles/Style.css"
import ApexCharts from 'apexcharts'
import apiConfig from '../../src/apiConfig.json'
import { NavLink, Link, useLocation } from "react-router-dom";
import Countdown from "react-countdown";

//Gọi API layout kho
const callAPILayoutKho_BTP = async () => {
    try {

        const response = await axios.post(
            `${apiConfig.API_BASE_URL}/layoutkho/btp`,
            {
                tenNha: "Kho N16",
                idKho: 5,
                maVung: "A"
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return (response)
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
}
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed, restart }) => {
    if (completed) {
        // Restart the countdown
        restart();
        return <Completionist />;
    } else {
        // Render a countdown
        return (
            <span>
                {minutes}:{seconds}
            </span>
        );
    }
};
const generateColors = (count) => {
    const colors = [];
    while (colors.length < count) {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        if (!colors.includes(randomColor)) { // Đảm bảo màu không bị trùng
            colors.push(randomColor);
        }
    }
    return colors;
};

//Thông tin mã vị trí khi dùng Modal
const columnsMaVT = [
    {
        title: 'Item Code',
        dataIndex: 'ItemCode',
        key: 'ItemCode',
        align: 'center',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'Ten_SanPham',
        key: 'Ten_SanPham',
        align: 'center',
        ellipsis: {
            showTitle: false, // Ẩn tooltip mặc định
        },
        render: (text) => (
            <Tooltip placement="topLeft" title={text}>
                {text}
            </Tooltip>
        ),
        width: "30%"
    },
    {
        title: 'Mã đơn hàng',
        dataIndex: 'Ma_DonHang',
        key: 'Ma_DonHang',
        align: 'center',
        ellipsis: {
            showTitle: false, // Ẩn tooltip mặc định
        },
        render: (text) => (
            <Tooltip placement="topLeft" title={text}>
                {text}
            </Tooltip>
        ),
        width: "30%"
    },
    {
        title: 'Tổng Tồn',
        dataIndex: 'TongTonTheoMDH',
        key: 'TongTonTheoMDH',
        align: 'center',
    },
    {
        title: 'Tồn tại vị trí',
        dataIndex: 'Ton',
        key: 'Ton',
        align: 'center',
    },
    // {
    //   title: 'Tuổi tồn',
    //   dataIndex: 'tuoiTonBTP',
    //   key: '',
    //   align: 'center',
    // },
];

const colorsArray = generateColors(50);
//Fucntion ở đây
const KhoN16 = (props) => {
    const tableRef = useRef(null);
    const tableRef_ = useRef(null);
    const [scale, setScale] = useState(1);
    const [scale_, setScale_] = useState(1);
    //==============useState
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedMaViTriKho, setSelectedMaviTriKho] = useState(null);
    const [selectedMaViTri, setselectedMaViTri] = useState([]);
    const [data, setData] = useState([]);
    const [inputLenhXuatVT, setInputLenhXuatVT] = useState("");
    const [inputMaVatTu, setInputMaVatTu] = useState("");
    const [viTri, setViTri] = useState([]);
    const [highlightedCell, setHighlightedCell] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedChamLC, setSelectedChamLC] = useState([]);
    const [columnsMaVT_, setColumnsMaVT_] = useState(columnsMaVT);
    const [showTuoiTon, setShowTuoiTon] = useState(false);


    const [highlightedRows, setHighlightedRows] = useState([]);
    const [listData, setListData] = useState([]);
    const [height, setHeight] = useState(window.innerHeight);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDivVisible, setIsDivVisible] = useState(true);
    //==
    const [tenSP, setTenSP] = useState("");
    const [tongTon, setTongTon] = useState("");
    const [tong, setTong] = useState([]);
    const [chamLC, setChamLC] = useState(undefined);
    const [ngayChamLC, setNgayChamLC] = useState(179)

    const { pathname } = useLocation();
    const page = pathname.replace("/", "");
    // Hàm xử lý toggle

    const [key, setKey] = useState(0);
    const keyRef = useRef(key);

    const handleRestart = () => {
        keyRef.current += 1;
        setKey(keyRef.current);
    };

    const items = [
        {
            key: '1',
            label: (
                <NavLink to="/KhoN1">
                    <span
                        className="icon"
                    >
                    </span>
                    <span className="label">Kho N1</span>
                </NavLink>
            ),
        },
        {
            key: '2',
            label: (
                <NavLink to="/KhoK3">
                    <span
                        className="icon"
                    >
                    </span>
                    <span className="label">Kho K3</span>
                </NavLink>
            ),
        },
    ];
    const buttonRefScreen = useRef(null);

    const toggleDiv = () => {
        setIsDivVisible(!isDivVisible);
        setTimeout(() => {
            if (tableRef.current) {
                const tableWidth = tableRef.current.offsetWidth;
                const screenWidth = window.innerWidth;
                const newScale = isFullScreen
                    ? tableWidth / (screenWidth - 10)
                    : tableWidth / (screenWidth * 0.9);
                setScale(newScale);
            }
            if (tableRef_.current) {
                const tableWidth = tableRef_.current.offsetWidth;
                const screenWidth = window.innerWidth;
                const newScale_ = isFullScreen
                    ? tableWidth / (screenWidth - 280)
                    : tableWidth / ((screenWidth - 280) * 0.9);
                setScale_(newScale_);
            }
        }, 0);
    };
    //bật tắt tuổi tồn
    const toggleColumn = () => {
        setShowTuoiTon((prev) => !prev);
        if (showTuoiTon) {
            setColumnsMaVT_((prevColumns) =>
                prevColumns.filter((col) => col.dataIndex !== "tuoiTonBTP")
            );
        } else {
            setColumnsMaVT_((prevColumns) => [
                ...prevColumns,
                {
                    title: "Tuổi tồn",
                    dataIndex: "tuoiTonBTP",
                    key: "tuoiTonBTP",
                    align: "center",
                },
            ]);
        }
    };
    // Xử lý bật/tắt chế độ toàn màn hình
    const toggleFullScreen = () => {
        if (!isFullScreen) {
            const element = document.documentElement; // Lấy thẻ HTML để kích hoạt fullscreen
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };
    // api tìm kiếm
    const callAPISearch_ = async () => {
        try {
            // Gửi yêu cầu POST tới API
            const response = await axios.post(
                `${apiConfig.API_BASE_URL}/layoutkho/bylenhxuatbtp`,
                {
                    soLenhXuatBTP: inputLenhXuatVT, // LXBTP-2024-11-3423
                    itemCode: inputMaVatTu // 4957326.B
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } catch (error) {
            if (error.response) {
                // Hiển thị thông báo lỗi bằng Ant Design notification
                notification.error({
                    message: `Lỗi API: ${error.response.status}`,
                    description: error.response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
                    duration: 5,
                });
            } else {
                notification.error({
                    message: 'Lỗi kết nối',
                    description: 'Lỗi kết nối hoặc yêu cầu. Vui lòng kiểm tra kết nối mạng hoặc thử lại.',
                    duration: 5,
                });
            }
        }
    };


    // Lọc và nhóm dữ liệu với tuoiTonBTP > 100
    const overdueItems = data.flatMap(item =>
        item.ItemCode.filter(subItem => subItem.tuoiTonBTP > ngayChamLC)
    );

    const overdueGroupedByProduct = overdueItems.reduce((acc, item) => {
        const { Ten_SanPham, Ton } = item;
        acc[Ten_SanPham] = (acc[Ten_SanPham] || 0) + Ton;
        return acc;
    }, {});

    //Dữ liệu khi nhấn vào vị trí
    const DataMaViTri = selectedMaViTri.map((item, index) => ({
        key: index,
        ItemCode: item.ItemCode,
        Checkv: item.Checkv,
        Ma_DonHang: item.Ma_DonHang,
        Ten_SanPham: item.Ten_SanPham,
        Ton: item.Ton,
        tuoiTonBTP: item.tuoiTonBTP,
        TongTonTheoMDH: item.TongTonTheoMDH
    }));


    const updateHeight = () => {
        setHeight(window.innerHeight);
    };

    // hàng chậm luân chuyển

    //Chọn tên sản phẩm
    const ChangeSelectTenSP = (value) => {
        setSelectedProduct(value);
        // Lọc các dòng phù hợp với Ten_SanPham
        const matchedRows = data.filter((record) =>
            record.ItemCode.some((item) => item.Ten_SanPham === value)
        );

        // Sắp xếp matchedRows trước theo tuoiTonBTP, sau đó theo maViTriKho
        const sortedMatchedRows = matchedRows.sort((a, b) => {
            // Lấy tuổi tồn lớn nhất của Ten_SanPham từ từng record
            const maxA = Math.max(
                ...a.ItemCode
                    .filter((item) => item.Ten_SanPham === value)
                    .map((item) => item.tuoiTonBTP || 0)
            );

            const maxB = Math.max(
                ...b.ItemCode
                    .filter((item) => item.Ten_SanPham === value)
                    .map((item) => item.tuoiTonBTP || 0)
            );

            // So sánh tuổi tồn
            if (maxB !== maxA) {
                return maxB - maxA; // Tuổi tồn giảm dần
            }

            // Nếu tuổi tồn bằng nhau, so sánh theo mã vị trí kho
            const [charA, numA] = [a.MaViTriKho[0], parseInt(a.MaViTriKho.slice(1), 10)];
            const [charB, numB] = [b.MaViTriKho[0], parseInt(b.MaViTriKho.slice(1), 10)];

            // So sánh chữ cái (A, B, C)
            if (charA !== charB) {
                return charA.localeCompare(charB); // A < B < C
            }

            // So sánh số (101, 102, ...)
            return numA - numB; // Số tăng dần
        });


        const x = data
            .map((record) =>
                record.ItemCode
                    .filter((item) => item.Ten_SanPham === value) // Lọc các phần tử trong ItemCode thỏa mãn điều kiện
                    .map((item) => item.TongTon) // Lấy ra thuộc tính TongTon của các phần tử đã lọc
            )
            .flat();
        setTenSP(value);
        setTongTon(x[0])
        setTong({ Ten_SanPham: value, TongTon: x[0] });
        setChamLC(undefined)
        setListData(value === undefined ? data : matchedRows)
    }

    const handleInputLenhXuatVTChange = (e) => {
        setInputLenhXuatVT(e.target.value);
    };

    const handleInputMaVatTuChange = (e) => {
        setInputMaVatTu(e.target.value);
    };

    const handleClick = (key, key2, key3) => {
        setSelectedKey(key); // Lưu trữ key của ô được nhấp
        setselectedMaViTri(key2)
        setSelectedMaviTriKho(key3)
        setIsModalVisible(true); // Hiển thị modal
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedKey(null); // Xóa key sau khi đóng modal
    };

    const handleModalClose1 = () => {
        setIsModalVisible1(false);
    };
    const [threshold, setThreshold] = useState(null);


    const handleThresholdChange = (e) => {
        const value = e.target.value;
        setThreshold(value);
    };

    const handleClear = () => {
        setViTri([])
        setTongTon(undefined)
        setChamLC(undefined)
        setListData(data)
    }

    const handleSubmit = async () => {
        try {
            const response = await callAPISearch_();
            const map = new Map();
            const uniqueData = response.data.filter((item) => {
                const key = `${item.idViTriKho}_${item.maViTriKho}_${item.itemCode}`;
                if (!map.has(key)) {
                    map.set(key, true);
                    return true;
                }
                return false;
            });
            setViTri(inputMaVatTu === '' && inputLenhXuatVT === '' ? [] : uniqueData);

            const uniqueMaViTriKho = uniqueData.map(item => item.maViTriKho); // Lấy tất cả MaViTriKho từ uniqueData

            const listData = data.filter((item) => uniqueMaViTriKho.includes(item.MaViTriKho));

            const sortedMatchedRows = listData.sort((a, b) => {
                // Lấy tuổi tồn lớn nhất của Ten_SanPham từ từng record
                const maxA = Math.max(
                    ...a.ItemCode
                        .filter((item) => item.ItemCode === inputMaVatTu)
                        .map((item) => item.tuoiTonBTP || 0)
                );

                const maxB = Math.max(
                    ...b.ItemCode
                        .filter((item) => item.ItemCode === inputMaVatTu)
                        .map((item) => item.tuoiTonBTP || 0)
                );

                // So sánh tuổi tồn
                if (maxB !== maxA) {
                    return maxB - maxA; // Tuổi tồn giảm dần
                }

                // Nếu tuổi tồn bằng nhau, so sánh theo mã vị trí kho
                const [charA, numA] = [a.MaViTriKho[0], parseInt(a.MaViTriKho.slice(1), 10)];
                const [charB, numB] = [b.MaViTriKho[0], parseInt(b.MaViTriKho.slice(1), 10)];

                // So sánh chữ cái (A, B, C)
                if (charA !== charB) {
                    return charA.localeCompare(charB); // A < B < C
                }

                // So sánh số (101, 102, ...)
                return numA - numB; // Số tăng dần
            });
            if (inputLenhXuatVT === "" && inputMaVatTu !== "") {
                const x = data
                    .map((record) =>
                        record.ItemCode
                            .filter((item) => item.ItemCode === inputMaVatTu) // Lọc các phần tử trong ItemCode thỏa mãn điều kiện
                            .map((item) => ({
                                TongTon: item.TongTon,
                                Ten_SanPham: item.Ten_SanPham,
                            }))
                    )
                    .flat();
                setTenSP(x[0].Ten_SanPham);
                setTongTon(x[0].TongTon)
            }

            if (inputLenhXuatVT !== "") {
                const filteredData = data
                    .flatMap((record) =>
                        (record.ItemCode || []) // Đảm bảo ItemCode là một mảng
                            .filter((item) =>
                                uniqueData.some((unique) => unique.itemCode === item.ItemCode) // So khớp itemCode
                            )
                            .map((item) => ({
                                TongTon: item.TongTon,
                                Ten_SanPham: item.Ten_SanPham,
                            }))
                    );

                setTenSP(filteredData[0].Ten_SanPham);
                setTongTon(filteredData[0].TongTon)
            }
            if (inputLenhXuatVT === "" && inputMaVatTu === "") {
                setTongTon(null)
            }
            setChamLC(undefined)
            setListData(inputMaVatTu === '' && inputLenhXuatVT === '' ? data : listData)
        }
        catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    }

    // Gọi API và xử lý dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await callAPILayoutKho_BTP();
                const MaViTriKho = response.data.map(item => item.maViTriKho);
                const PhanTram = response.data.map(item => item.phanTram);
                const ItemCode = response.data.map(item => item.itemCode);
                const Checkv = response.data.map(item => item.checkv);
                const Ten_SanPham = response.data.map(item => item.tenSanPham);
                const Ma_DonHang = response.data.map(item => item.maDonHang);
                const Ton = response.data.map(item => item.ton);
                const Ngay_NhapBTP = response.data.map(item => item.ngayNhapBTP);

                const today = new Date();
                const tuoiTonBTP = response.data.map(item => {
                    if (!item.ngayNhapBTP || item.ton === 0) return 0;
                    const ngayNhap = new Date(item.ngayNhapBTP);
                    return Math.floor((today - ngayNhap) / (1000 * 60 * 60 * 24));
                });

                const tonSanPhamMap = response.data.reduce((acc, item) => {
                    const key = `${item.itemCode}-${item.tenSanPham}-${item.maDonHang}`;
                    acc[key] = (acc[key] || 0) + item.ton;
                    return acc;
                }, {});

                const tonSanPham = response.data.reduce((acc, item) => {
                    const key = `${item.itemCode}-${item.tenSanPham}`;
                    acc[key] = (acc[key] || 0) + item.ton;
                    return acc;
                }, {});

                // Thêm thuộc tính Ton_SanPham vào mỗi phần tử
                const dataWithTonSanPham = response.data.map(item => ({
                    ...item,
                    Ton_SanPhamTheoMDH: tonSanPhamMap[`${item.itemCode}-${item.tenSanPham}-${item.maDonHang}`],
                    Ton_SanPham: tonSanPham[`${item.itemCode}-${item.tenSanPham}`]
                }));

                const TongTonTheoMDH = dataWithTonSanPham.map(item => item.Ton_SanPhamTheoMDH);
                const TongTon = dataWithTonSanPham.map(item => item.Ton_SanPham);

                const formattedData = MaViTriKho.map((MaViTriKho, index) => ({
                    rowTitle: `Hàng ${MaViTriKho.slice(0, -2)}`,
                    MaViTriKho,
                    PhanTram: PhanTram[index],
                    ItemCode: ItemCode[index],
                    Checkv: Checkv[index],
                    Ten_SanPham: Ten_SanPham[index],
                    Ma_DonHang: Ma_DonHang[index],
                    Ton: Ton[index],
                    tuoiTonBTP: tuoiTonBTP[index],
                    Ngay_NhapBTP: Ngay_NhapBTP[index],
                    TongTonTheoMDH: TongTonTheoMDH[index],
                    TongTon: TongTon[index]
                }));

                const groupedData = formattedData.reduce((acc, item) => {
                    const key = `${item.rowTitle}-${item.MaViTriKho}`;
                    if (!acc[key]) {
                        acc[key] = {
                            rowTitle: item.rowTitle,
                            MaViTriKho: item.MaViTriKho,
                            PhanTram: item.PhanTram,
                            ItemCode: [],
                        };
                    }
                    acc[key].ItemCode.push({
                        ItemCode: item.ItemCode,
                        Checkv: item.Checkv,
                        Ma_DonHang: item.Ma_DonHang,
                        Ten_SanPham: item.Ten_SanPham,
                        Ton: item.Ton,
                        tuoiTonBTP: item.tuoiTonBTP,
                        Ngay_NhapBTP: item.Ngay_NhapBTP,
                        TongTonTheoMDH: item.TongTonTheoMDH,
                        TongTon: item.TongTon
                    });
                    return acc;
                }, {});

                const finalGroupedData = Object.values(groupedData);
                setData(finalGroupedData);
                setListData(finalGroupedData);
                setTimeout(() => {
                    if (tableRef.current) {
                        const tableWidth = tableRef.current.offsetWidth;
                        const screenWidth = window.innerWidth;
                        const newScale = isFullScreen
                            ? tableWidth / (screenWidth - 10)
                            : tableWidth / (screenWidth * 0.9);
                        setScale(newScale);
                    }
                    if (tableRef_.current) {
                        const tableWidth = tableRef_.current.offsetWidth;
                        const screenWidth = window.innerWidth;
                        const newScale_ = isFullScreen
                            ? tableWidth / (screenWidth - 280)
                            : tableWidth / ((screenWidth - 280) * 0.9);
                        setScale_(newScale_);
                    }
                }, 0);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        fetchData();
        // const timer = setTimeout(() => {
        //   if (buttonRefScreen.current) {
        //     buttonRefScreen.current.click(); // Click button sau 10 giây
        //   }
        // }, 10000);
        // Đặt interval để gọi lại mỗi 30 phút
        const intervalId = setInterval(() => {
            const now = new Date();
            // Kiểm tra trong ngày (ví dụ từ 8:00 đến 18:00)
            if (now.getHours() >= 8 && now.getHours() <= 18) {
                fetchData();
            }
        }, 30 * 60 * 1000); // 30 phút
    }, []);

    // Lắng nghe thay đổi fullscreen
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(
                !!(
                    document.fullscreenElement ||
                    document.mozFullScreenElement ||
                    document.webkitFullscreenElement ||
                    document.msFullscreenElement
                )
            );
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
        document.addEventListener("mozfullscreenchange", handleFullScreenChange);
        document.addEventListener("msfullscreenchange", handleFullScreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
            document.removeEventListener("msfullscreenchange", handleFullScreenChange);
        };
    }, []);

    // Theo dõi resize và MutationObserver
    useEffect(() => {
        const handleResize = () => {
            if (tableRef.current) {
                const tableWidth = tableRef.current.offsetWidth;
                const screenWidth = window.innerWidth;
                const newScale = isFullScreen
                    ? (tableWidth) / ((screenWidth - 10))//Hơi đần tý :v
                    : (tableWidth) / ((screenWidth * 0.9));
                setScale(newScale);
            };
            if (tableRef_.current) {
                const tableWidth = tableRef_.current.offsetWidth;
                const screenWidth = window.innerWidth;
                const newScale_ = isFullScreen
                    ? (tableWidth) / ((screenWidth - 280))//Hơi đần tý :v
                    : (tableWidth) / ((screenWidth - 280) * 0.9);
                setScale_(newScale_);
            }
        };

        const observer = new MutationObserver(() => handleResize());

        if (tableRef.current) {
            observer.observe(tableRef.current, { childList: true, subtree: true });
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
        };
    }, [isFullScreen]);


    const top5TuoiTon = data
        .flatMap(item =>
            item.ItemCode.map(subItem => ({
                ItemCode: subItem.ItemCode,
                tuoiTonBTP: subItem.tuoiTonBTP,
                Ten_SanPham: subItem.Ten_SanPham,
                Ma_DonHang: subItem.Ma_DonHang,
                MaViTriKho: item.MaViTriKho
            }))
        ) // Biến đổi data để lấy tất cả các ItemCode từ mảng con
        .filter(item => item.tuoiTonBTP > 0) // Lọc các ItemCode có tuoiTonBTP lớn hơn 0
        .sort((a, b) => b.tuoiTonBTP - a.tuoiTonBTP) // Sắp xếp theo tuoiTonBTP giảm dần
        .slice(0, 10); // Lấy 5 phần tử đầu tiên

    const chartOptions = {
        chart: {
            type: "bar", // Loại biểu đồ
            toolbar: { show: false }, // Tắt các công cụ mặc định
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false, // Cột dọc
            },
        },
        dataLabels: {
            enabled: false, // Tắt số liệu trên cột
        },
        xaxis: {
            categories: top5TuoiTon.map(item => item.MaViTriKho), // MaViTriKho làm nhãn trục X
            title: {
                text: "Mã vị trí kho",
            },
        },
        yaxis: {
            title: {
                text: "Tuổi tồn BTP",
            },
        },
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex }) {
                const item = top5TuoiTon[dataPointIndex];
                return `
          <div style="padding: 10px; border: 1px solid #ccc; background: #fff;">
            <strong>Tên sản phẩm:</strong> ${item.Ten_SanPham || "N/A"}<br/>
            <strong>Mã vị trí kho:</strong> ${item.MaViTriKho}<br/>
            <strong>Tuổi tồn:</strong> ${item.tuoiTonBTP}
          </div>`;
            },
        },
    };

    const chartSeries = [
        {
            name: "Tuổi tồn BTP",
            data: top5TuoiTon.map(item => item.tuoiTonBTP), // tuoiTonBTP làm dữ liệu
        },
    ];


    useEffect(() => {

        ChamLuanchuyen();
    }, [ngayChamLC]); // Các phụ thuộc
    useEffect(() => {

        handleClear();
    }, []); // Các phụ thuộc
    const ChamLuanchuyen = () => {
        // Lọc các dòng phù hợp với Ten_SanPham
        const matchedRows = data.filter((record) =>
            record.ItemCode.some((item) => item.tuoiTonBTP > ngayChamLC)
        );

        // Sắp xếp matchedRows trước theo tuoiTonBTP, sau đó theo maViTriKho
        const sortedMatchedRows = matchedRows.sort((a, b) => {
            // Lấy tuổi tồn lớn nhất của Ten_SanPham từ từng record
            const maxA = Math.max(
                ...a.ItemCode
                    // .filter((item) => item.Ten_SanPham === value)
                    .map((item) => item.tuoiTonBTP || 0)
            );

            const maxB = Math.max(
                ...b.ItemCode
                    // .filter((item) => item.Ten_SanPham === value)
                    .map((item) => item.tuoiTonBTP || 0)
            );

            // So sánh tuổi tồn
            if (maxB !== maxA) {
                return maxB - maxA; // Tuổi tồn giảm dần
            }

            // Nếu tuổi tồn bằng nhau, so sánh theo mã vị trí kho
            const [charA, numA] = [a.MaViTriKho[0], parseInt(a.MaViTriKho.slice(1), 10)];
            const [charB, numB] = [b.MaViTriKho[0], parseInt(b.MaViTriKho.slice(1), 10)];

            // So sánh chữ cái (A, B, C)
            if (charA !== charB) {
                return charA.localeCompare(charB); // A < B < C
            }
            return numA - numB; // Số tăng dần
        });
        const map = new Map();
        const mavitri = Object.values(matchedRows).map(item => ({
            maViTriKho: item.MaViTriKho
        }));
        setViTri(mavitri)
        setTongTon(undefined)
        setChamLC(true)
        setListData(matchedRows)
    }
    // Biểu đồ hàng chậm luân chuyển
    const processDataForChart = (data) => {
        const date = ngayChamLC;
        // Lọc và nhóm dữ liệu với tuoiTonBTP > 100
        const overdueItems = data.flatMap(item =>
            item.ItemCode.filter(subItem => subItem.tuoiTonBTP > date)
        );

        const overdueGroupedByProduct = overdueItems.reduce((acc, item) => {
            const { Ten_SanPham, Ton } = item;
            acc[Ten_SanPham] = (acc[Ten_SanPham] || 0) + Ton;
            return acc;
        }, {});


        // Tổng số lượng tồn quá hạn
        const totalOverdueTon = Object.values(overdueGroupedByProduct).reduce((sum, ton) => sum + ton, 0);

        // Chuẩn bị dữ liệu hàng quá hạn
        const overdueChartData = Object.entries(overdueGroupedByProduct).map(([Ten_SanPham, Ton]) => ({
            name: `${Ten_SanPham}`,
            value: Ton
        }));

        // Lọc và tính tổng hàng trong hạn (tuoiTonBTP <= 100)
        const withinLimitItems = data.flatMap(item =>
            item.ItemCode.filter(subItem => subItem.tuoiTonBTP <= date)
        );
        const totalWithinLimitTon = withinLimitItems.reduce((sum, item) => sum + item.Ton, 0);

        // Tổng số lượng
        const totalTon = totalOverdueTon + totalWithinLimitTon;

        // Tính phần trăm nhóm hàng trong hạn
        const withinLimitChartData = {
            name: 'Trong hạn ',
            value: totalWithinLimitTon,
        };

        // Kết hợp dữ liệu
        const chartData = [
            ...overdueChartData,
        ];

        return chartData;
    };

    // Gọi hàm với dữ liệu
    const chartData = processDataForChart(data);

    const chartData_ = chartData.filter(item => item.name !== '');
    // Tăng số lượng màu khi có nhiều loại hơn danh sách `colors`

    const updateColors = (colors, length) => {
        // Nếu thiếu màu, thêm các màu ngẫu nhiên
        while (colors.length < length) {
            colors.push(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`); // Đảm bảo đủ 6 ký tự
        }
        // Nếu dư màu, cắt bỏ phần dư
        if (colors.length > length) {
            colors.length = length;
        }
        return colors;
    };


    const updatedColors = updateColors(colorsArray, chartData_.length);

    const chartOptions_TonQuaHan = {
        series: chartData_.map(item => item.value),
        options: {
            chart: {
                type: 'pie',
            },
            title: {
                text: 'Báo cáo hàng chậm luân chuyển',
                align: 'center',
                margin: 2,
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            legend: {
                // position: "right",
                // markers: {
                //   radius: 12, // Đổi hình tròn nhỏ trong legend
                // },
                formatter: function (legendName, opts) {
                    // Rút gọn tên nếu dài hơn 20 ký tự
                    const maxLength = 20;
                    return legendName.length > maxLength
                        ? `${legendName.substring(0, maxLength)}...`
                        : legendName;
                },
            },
            labels: chartData_.map(item => item.name),
            dataLabels: {
                enabled: true,
                drop: true,
                style: {
                    fontSize: '10px', // 
                },
                distance: '20px',
            },
            colors: updatedColors
        },
    };
    // Biểu đồ đầy kho
    const countEqual0 = data.filter(item => item.PhanTram == 0).length;
    const countGreaterThan0 = data.filter(item => item.PhanTram > 0 && item.PhanTram <= 85).length;
    const countLessThan100 = data.filter(item => item.PhanTram > 85 && item.PhanTram < 100).length;
    const countGreaterThan100 = data.filter(item => item.PhanTram >= 100).length;

    // Đưa về dạng { label, value }
    const result_Chart = [
        { label: 'Trống', value: countEqual0 },
        { label: 'Lớn hơn 0', value: countGreaterThan0 },
        { label: 'Lớn hơn 85', value: countLessThan100 },
        { label: 'Đầy', value: countGreaterThan100 },
    ];


    const labels = result_Chart.map(item => item.label);
    const series = result_Chart.map(item => item.value);

    const groupedData = data.reduce((acc, item) => {
        const prefix = item.MaViTriKho.slice(0, 2);

        // Bỏ qua các giá trị có độ dài chỉ 3 ký tự
        if (item.MaViTriKho.length > 3) {
            if (!acc[prefix]) {
                acc[prefix] = [];
            }
            acc[prefix].push(item);
        }
        return acc;
    }, {});
    const optionsSelect = Array.from(
        new Set(
            data
                .flatMap((item) =>
                    item.ItemCode?.map((code) => code.Ten_SanPham).filter((name) => name) || []
                )
        )
    ).map((uniqueName) => ({
        label: uniqueName,
        value: uniqueName,
    }));


    const sortedGroupedData = Object.entries(groupedData).map(([key, values]) => {
        // Sắp xếp mảng con theo MaViTriKho
        const sortedValues = values.sort((a, b) => {
            const maViTriKhoA = a.MaViTriKho;
            const maViTriKhoB = b.MaViTriKho;

            // Sắp xếp theo thứ tự số
            const numberA = parseInt(maViTriKhoA.slice(1), 10);
            const numberB = parseInt(maViTriKhoB.slice(1), 10);

            return numberA - numberB; // Tăng dần theo MaViTriKho
        });

        return { key, values: sortedValues };
    });
    //=================================================
    if (Object.keys(groupedData).length !== 0) {
        const nullValues = [null, null, null, null];
        const positions = [
            { key: "A1", target: "A133" }, { key: "A2", target: "A233" },
            { key: "A3", target: "A333" },
            { key: "B1", target: "B133" },
            { key: "B2", target: "B233" }, { key: "B3", target: "B333" },
            { key: "C1", target: "C133" }, { key: "C2", target: "C233" },
            { key: "C3", target: "C333" },
            { key: "D1", target: "D133" },
            { key: "D2", target: "D233" }, { key: "D3", target: "D333" },
            { key: "E1", target: "E133" }, { key: "E2", target: "E233" },
            { key: "E3", target: "E333" },
            { key: "F1", target: "F133" },
            { key: "F2", target: "F233" }, { key: "F3", target: "F333" },
            { key: "G1", target: "G133" }, { key: "G2", target: "G233" },
            { key: "G3", target: "G333" },
            { key: "H1", target: "H133" }, { key: "H2", target: "H233" },
            { key: "H3", target: "H333" },
            { key: "I1", target: "I133" }, { key: "I2", target: "I233" },
            { key: "I3", target: "I333" },
            { key: "J1", target: "J133" }, { key: "J2", target: "J233" },
            { key: "J3", target: "J333" },
            // { key: "K1", target: "K133" }, { key: "K2", target: "K233" },
            // { key: "K3", target: "K333" },
        ];

        positions.forEach(({ key, target }) => {
            const index = groupedData[key]?.findIndex(item => item.MaViTriKho === target);
            if (index !== -1 && index !== undefined) {
                groupedData[key].splice(index, 0, ...nullValues);
            } else {
                console.error(`Không tìm thấy phần tử với MaViTriKho là '${target}' trong nhóm '${key}'`);
            }
        });
        for (let i = 0; i <= 13; i++) {
            groupedData["H7"].splice(0, 0, ...nullValues);
        }
    }
    const createData = (groupedData, prefix, len) => {
        if (Object.keys(groupedData).length === 0) return null;

        return groupedData[`${prefix}4`]?.map((item, index) => {
            const entry = {};
            for (let i = 1; i <= len; i++) {
                const key = `${prefix}${i}`;
                entry[key] = groupedData[key][index]
                    ? {
                        MaViTriKho: groupedData[key][index]?.MaViTriKho,
                        PhanTram: groupedData[key][index]?.PhanTram,
                        ItemCode: groupedData[key][index]?.ItemCode,
                    }
                    : null;
            }
            return entry;
        });
    };

    // Sử dụng
    const data_A = createData(groupedData, 'A', 7);
    const data_B = createData(groupedData, 'B', 7);
    const data_C = createData(groupedData, 'C', 6);
    const data_D = createData(groupedData, 'D', 6);
    const data_E = createData(groupedData, 'E', 6);
    const data_F = createData(groupedData, 'F', 6);
    const data_G = createData(groupedData, 'G', 6);
    const data_H = createData(groupedData, 'H', 7);
    const data_I = createData(groupedData, 'I', 7);
    const data_J = createData(groupedData, 'J', 7);
    const data_K = createData(groupedData, 'K', 7);
    const data_L = createData(groupedData, 'L', 6);
    const createResult = (data, prefix) => {
        if (!data) return [];

        const result = [];
        for (let index = 0; index < data.length / 2; index++) {
            const values = [];
            for (let i = 1; i <= 7; i++) {
                values.push(data[index * 2][`${prefix}${i}`]);
                values.push(data[index * 2 + 1][`${prefix}${i}`]);
            }
            result.push({
                key: index,
                values,
            });
        }
        return result;
    };

    const createResult_L = (data, prefix) => {
        if (!data) return [];

        const result = [];
        for (let index = 0; index < data.length / 2; index++) {
            const values = [];
            for (let i = 1; i <= 7; i++) {
                values.push(data[index][`${prefix}${i}`]);
            }
            result.push({
                key: index,
                values,
            });
        }
        return result;
    };
    // Sử dụng
    const result_A = createResult(data_A, 'A');
    const result_A_1 = result_A.slice(0, 16);
    const result_A_2 = result_A.slice(16, 40);
    const result_B = createResult(data_B, 'B');
    const result_B_1 = result_B.slice(0, 16);
    const result_B_2 = result_B.slice(16, 40);
    const result_C = createResult(data_C, 'C');
    const result_C_1 = result_C.slice(0, 16);
    const result_C_2 = result_C.slice(16, 40);
    const result_D = createResult(data_D, 'D');
    const result_D_1 = result_D.slice(0, 16);
    const result_D_2 = result_D.slice(16, 40);
    const result_E = createResult(data_E, 'E');
    const result_E_1 = result_E.slice(0, 16);
    const result_E_2 = result_E.slice(16, 40);
    const result_F = createResult(data_F, 'F');
    const result_F_1 = result_F.slice(0, 16);
    const result_F_2 = result_F.slice(16, 40);
    const result_G = createResult(data_G, 'G');
    const result_G_1 = result_G.slice(0, 16);
    const result_G_2 = result_G.slice(16, 40);
    const result_H = createResult(data_H, 'H');
    const result_H_1 = result_H.slice(0, 16);
    const result_H_2 = result_H.slice(16, 40);
    const result_I = createResult(data_I, 'I');
    const result_I_1 = result_I.slice(0, 16);
    const result_I_2 = result_I.slice(16, 40);
    const result_J = createResult(data_J, 'J');
    const result_J_1 = result_J.slice(0, 16);
    const result_J_2 = result_J.slice(16, 40);
    const result_K = createResult(data_K, 'K');
    const result_K_1 = result_K.slice(0, 16);
    const result_K_2 = result_K.slice(16, 40);
    const result_L = createResult_L(data_L, 'L');
    //========================================

    const generateColumn = (keyPrefix, length) => {
        const columns = Array.from({ length: length }, (_, index) => {
            const key = `${keyPrefix}${index + 1}`;
            return {
                title: (
                    <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '3px' }}>
                        Tầng {index + 1}
                    </div>
                ),
                children: [
                    {
                        title: (
                            <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '3px' }}>
                                {key}
                            </div>
                        ),
                        children: [
                            {
                                header: false,
                                dataIndex: ['values', index * 2],
                                key: `${key}_even`,
                                render: (record) => {
                                    if (!record) {
                                        return (
                                            <div
                                                style={{
                                                    transform: 'rotate(90deg)',
                                                    whiteSpace: 'nowrap',
                                                    textAlign: 'center',
                                                    fontSize: '3px',
                                                }}
                                            >
                                            </div>
                                        );
                                    }
                                    const className = record.PhanTram >= 100
                                        ? 'red-background'
                                        : record.PhanTram > 85 && record.PhanTram < 100
                                            ? 'yellow-background'
                                            : record.PhanTram > 0 && record.PhanTram <= 85
                                                ? 'green-background'
                                                : 'white-background';
                                    const isHighlighted = viTri.some(
                                        (item) => item.maViTriKho === record.MaViTriKho
                                    );
                                    const isHighlighted2 = record.ItemCode.some(
                                        (item) => item.Ten_SanPham === selectedProduct
                                    );
                                    return (
                                        <div
                                            className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                                            style={{
                                                transform: 'rotate(90deg)',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                                fontSize: '3px',
                                                // outline: isHighlighted ? '2px solid blue' : 'none',
                                                // border: '1px solid #000'
                                            }}
                                            onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)}
                                        >
                                            {record.MaViTriKho}
                                        </div>
                                    )
                                },
                                width: 8,
                            },
                            {
                                header: false,
                                dataIndex: ['values', index * 2 + 1],
                                key: `${key}_odd`,
                                render: (record) => {
                                    if (!record) {
                                        return (
                                            <div
                                                style={{
                                                    transform: 'rotate(90deg)',
                                                    whiteSpace: 'nowrap',
                                                    textAlign: 'center',
                                                    fontSize: '3px',
                                                }}
                                            >
                                            </div>
                                        );
                                    }
                                    const className = record.PhanTram >= 100
                                        ? 'red-background'
                                        : record.PhanTram > 85 && record.PhanTram < 100
                                            ? 'yellow-background'
                                            : record.PhanTram > 0 && record.PhanTram <= 85
                                                ? 'green-background'
                                                : 'white-background';

                                    const isHighlighted = viTri.some(
                                        (item) => item.maViTriKho === record.MaViTriKho
                                    );
                                    const isHighlighted2 = record.ItemCode.some(
                                        (item) => item.Ten_SanPham === selectedProduct
                                    );
                                    return (
                                        <div
                                            className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                                            style={{
                                                transform: 'rotate(90deg)',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                                fontSize: '3px',
                                                // outline: isHighlighted ? '2px solid blue' : 'none',
                                                // border: '1px solid #000',
                                            }}
                                            onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)}
                                        >
                                            {record.MaViTriKho}
                                        </div>
                                    );
                                },
                                width: 8,
                            },
                        ],
                    }
                ]

            };
        });
        return [
            {
                title: <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '14px' }}>
                    Dãy {keyPrefix}
                </div>,
                children: columns
            },
        ];
    };
    const generateColumn_ = (keyPrefix, length) => {
        const columns = Array.from({ length: length }, (_, index) => {
            const key = `${keyPrefix}${length - index}`;
            return {
                title: (
                    <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '3px' }}>
                        Tầng {length - index}
                    </div>
                ),
                children: [
                    {
                        title: (
                            <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '3px' }}>
                                {key}
                            </div>
                        ),
                        children: [
                            {
                                title: null,
                                dataIndex: ['values', (length - 1 - index) * 2 + 1],
                                key: `${key}_even`,
                                render: (record) => {
                                    if (!record) {
                                        return (
                                            <div
                                                style={{
                                                    transform: 'rotate(90deg)',
                                                    whiteSpace: 'nowrap',
                                                    textAlign: 'center',
                                                    fontSize: '3px',
                                                }}
                                            >
                                            </div>
                                        );
                                    }
                                    const className = record.PhanTram >= 100
                                        ? 'red-background'
                                        : record.PhanTram > 85 && record.PhanTram < 100
                                            ? 'yellow-background'
                                            : record.PhanTram > 0 && record.PhanTram <= 85
                                                ? 'green-background'
                                                : 'white-background';
                                    const isHighlighted = viTri.some(
                                        (item) => item.maViTriKho === record.MaViTriKho
                                    );
                                    const isHighlighted2 = record.ItemCode.some(
                                        (item) => item.Ten_SanPham === selectedProduct
                                    );
                                    return (
                                        <div
                                            className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                                            style={{
                                                transform: 'rotate(90deg)',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                                fontSize: '3px',
                                                // outline: isHighlighted ? '2px solid blue' : 'none',
                                                // border: '1px solid #000'
                                            }}
                                            onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)}
                                        >
                                            {record.MaViTriKho}
                                        </div>
                                    )
                                },
                                width: 8,
                            },
                            {
                                title: null,
                                dataIndex: ['values', (length - 1 - index) * 2],
                                key: `${key}_odd`,
                                render: (record) => {
                                    if (!record) {
                                        return (
                                            <div
                                                style={{
                                                    transform: 'rotate(90deg)',
                                                    whiteSpace: 'nowrap',
                                                    textAlign: 'center',
                                                    fontSize: '3px',
                                                }}
                                            >
                                            </div>
                                        );
                                    }
                                    const className = record.PhanTram >= 100
                                        ? 'red-background'
                                        : record.PhanTram > 85 && record.PhanTram < 100
                                            ? 'yellow-background'
                                            : record.PhanTram > 0 && record.PhanTram <= 85
                                                ? 'green-background'
                                                : 'white-background';

                                    const isHighlighted = viTri.some(
                                        (item) => item.maViTriKho === record.MaViTriKho
                                    );
                                    const isHighlighted2 = record.ItemCode.some(
                                        (item) => item.Ten_SanPham === selectedProduct
                                    );
                                    return (
                                        <div
                                            className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                                            style={{
                                                transform: 'rotate(90deg)',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                                fontSize: '3px',
                                                // outline: isHighlighted ? '2px solid blue' : 'none',
                                                // border: '1px solid #000',
                                            }}
                                            onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)}
                                        >
                                            {record.MaViTriKho}
                                        </div>
                                    );
                                },
                                width: 8,
                            },
                        ],
                    }
                ]

            };
        });
        return [
            {
                title: <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '14px' }}>
                    Dãy {keyPrefix}
                </div>,
                children: columns
            },
        ];
    };
    const generateColumn_For_L = (keyPrefix, length) => {
        const columns = Array.from({ length: length }, (_, index) => {
            const key = `${keyPrefix}${length - index}`;
            return {
                title: (
                    <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '3px' }}>
                        Tầng {length - index}
                    </div>
                ),
                children: [
                    {
                        title: (
                            <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '3px' }}>
                                {key}
                            </div>
                        ),
                        children: [
                            {
                                title: null,
                                dataIndex: ['values', length - index - 1],
                                key: `${key}`,
                                render: (record) => {
                                    if (!record) {
                                        return (
                                            <div
                                                style={{
                                                    transform: 'rotate(90deg)',
                                                    whiteSpace: 'nowrap',
                                                    textAlign: 'center',
                                                    fontSize: '3px',
                                                }}
                                            >
                                            </div>
                                        );
                                    }
                                    const className = record.PhanTram >= 100
                                        ? 'red-background'
                                        : record.PhanTram > 85 && record.PhanTram < 100
                                            ? 'yellow-background'
                                            : record.PhanTram > 0 && record.PhanTram <= 85
                                                ? 'green-background'
                                                : 'white-background';
                                    const isHighlighted = viTri.some(
                                        (item) => item.maViTriKho === record.MaViTriKho
                                    );
                                    const isHighlighted2 = record.ItemCode.some(
                                        (item) => item.Ten_SanPham === selectedProduct
                                    );
                                    return (
                                        <div
                                            className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                                            style={{
                                                transform: 'rotate(90deg)',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center',
                                                fontSize: '3px',
                                                // outline: isHighlighted ? '2px solid blue' : 'none',
                                                // border: '1px solid #000'
                                            }}
                                            onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)}
                                        >
                                            {record.MaViTriKho}
                                        </div>
                                    )
                                },
                                width: 8,
                            }
                        ],
                    }
                ]

            };
        });
        return [
            {
                title: <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '14px' }}>
                    Dãy {keyPrefix}
                </div>,
                children: columns
            },
        ];
    };
    // Tạo các cột
    const columns_A = generateColumn('A', 7);
    const columns_B = generateColumn_('B', 7);
    const columns_C = generateColumn('C', 6);
    const columns_D = generateColumn_('D', 6);
    const columns_E = generateColumn('E', 6);
    const columns_F = generateColumn_('F', 6);
    const columns_G = generateColumn('G', 6);
    const columns_H = generateColumn_('H', 7);
    const columns_I = generateColumn('I', 7);
    const columns_J = generateColumn_('J', 7);
    const columns_K = generateColumn_('K', 7);
    const columns_L = generateColumn_For_L('L', 6);
    const { Title, Paragraph } = Typography;

    const config = {
        series: series,
        options: {
            chart: {
                width: 10,
                type: 'pie',
                toolbar: {
                    show: false
                }
            },
            title: {
                text: 'Báo cáo đầy kho',
                align: 'center', // can be 'left', 'center', or 'right'
                margin: 10,
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            // stroke: {
            //   show: true,  // Hiển thị viền
            //   width: 0.5,
            //   colors: ['#000'], // Màu viền đen
            // },
            labels: labels,
            colors: ['#ffffff', '#3ca63cc4', '#fcff4dc4', '#db3d3dcc'],
            legend: {
                // show: false
                fontSize: '10px'
            },
            dataLabels: {
                enabled: true,
                drop: true,
                style: {
                    fontSize: '10px', // 
                },
                distance: '20px',
            },
            tooltip: {
                enabled: true,
                theme: 'light',
                style: {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#007BFF',
                },
                marker: {
                    show: true,
                },
            },
        }
    }
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1000,
                    cursor: "pointer",
                    fontSize: "18px",
                    backgroundColor: "white",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "5px 10px",
                }}
                onClick={toggleFullScreen}
            >
                {isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </div>
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 70,
                    zIndex: 1000,
                }}
            >
                <Button ref={buttonRefScreen} onClick={toggleDiv}>
                    {isDivVisible ? "Mở rộng sơ đồ" : "Thu nhỏ sơ đồ"}
                </Button>
            </div>
            {/* <div
        style={{
          position: "absolute",
          top: 10,
          right: 200,
          zIndex: 1000,
        }}
      >
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomLeft"
          arrow
        >
          <a onClick={(e) => e.preventDefault()}>
            <Button>
              Chọn kho
            </Button>
          </a>
        </Dropdown>
      </div> */}
            {/* <div
        style={{
          position: "absolute",
          top: 20,
          right: 300,
          zIndex: 1000,
        }}
      >
        <Countdown
          key={key}
          date={Date.now() + 1000 * 60 * 30}
          renderer={(props) => renderer({ ...props, restart: handleRestart })}
        />
      </div > */}
            <Row gutter={[24, 0]} style={{ paddingTop: 20, paddingBottom: 2, marginLeft: !isDivVisible ? -250 : 0, }}>
                <Col span={24} md={6}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">
                                Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item style={{ textTransform: "capitalize", userSelect: 'none', }}>
                            Kho N16
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="ant-page-header-heading">
                        <span
                            className="ant-page-header-heading-title"
                            style={{ textTransform: "capitalize", userSelect: 'none', }}
                        >
                            Kho N16
                        </span>
                    </div>
                </Col>
            </Row >
            {
                isDivVisible && (
                    <Row className="rowgap-vbox" gutter={[24, 0]} style={{ alignItems: "center" }}>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                            className="mb-24"
                        >
                            <Card bordered={false} className="search_by"
                                style={{ marginBottom: -25 }}
                            >
                                <Row align="middle" justify="space-around" gutter={[24, 0]}>
                                    <Col xs={8}>
                                        <Input
                                            type="text"
                                            placeholder="Lệnh xuất BTP"
                                            value={inputLenhXuatVT}
                                            onChange={handleInputLenhXuatVTChange}
                                            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                                            style={{ borderRadius: '6px' }}
                                        />
                                    </Col>
                                    <Col xs={8}>
                                        <Input
                                            type="text"
                                            placeholder="ItemCode"
                                            value={inputMaVatTu}
                                            onChange={handleInputMaVatTuChange}
                                            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                                            style={{ borderRadius: '6px' }}
                                        />
                                    </Col>
                                    <Col xs={3}>
                                        <Button type="primary" onClick={handleSubmit} >
                                            Search
                                        </Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button type="" onClick={handleClear} >
                                            Clear
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={6}>
                            <Card bordered={false} className=" ">
                                <Select
                                    showSearch
                                    size="large"
                                    onChange={ChangeSelectTenSP}
                                    allowClear
                                    placeholder="Tên sản phẩm"
                                    // mode="multiple"
                                    style={{ width: '100%' }}
                                    options={optionsSelect}
                                />
                            </Card>
                        </Col>
                        <Button onClick={toggleColumn}>
                            {showTuoiTon ? "Hide" : "Show"}
                        </Button>
                    </Row>
                )
            }
            {
                isDivVisible && (
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24" style={{ marginTop: 12, marginBottom: 12, marginRight: 10 }}>
                            <Card bordered={false} className="criclebox h-full" style={{ height: 160, width: 320, backgroundColor: '#c8c8c8' }}>
                                <ReactApexChart options={config.options} series={config.series} type="pie" width={300} height={150} />
                            </Card>
                        </Col>
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24" style={{ marginTop: 12, marginBottom: 12 }}>
              <Card bordered={false} className="criclebox h-full" style={{ height: 200 }}>
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height={180}
                />
              </Card>
            </Col> */}

                        <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24" style={{ marginTop: 12, marginBottom: 12 }}>
                            {showTuoiTon && (
                                <Card bordered={false} className="criclebox h-full" style={{ height: 160, width: 510, backgroundColor: '#c8c8c8', display: "flex" }}>
                                    <div style={{ display: "flex" }}>

                                        <div style={{ width: 80, paddingLeft: 10 }}>
                                            <Button
                                                style={{ margin: "5px 0px" }}
                                                onClick={() => {
                                                    setNgayChamLC(30);
                                                    // ChamLuanchuyen();
                                                }}
                                            >
                                                1 tháng
                                            </Button>
                                            <Button
                                                style={{ margin: "5px 0px" }}
                                                onClick={() => {
                                                    setNgayChamLC(90);
                                                    // ChamLuanchuyen();
                                                }}
                                            >
                                                3 tháng
                                            </Button>
                                            <Button
                                                style={{ margin: "5px 0px" }}
                                                onClick={() => {
                                                    setNgayChamLC(180);
                                                    // ChamLuanchuyen();
                                                }}
                                            >
                                                6 tháng
                                            </Button>
                                        </div>
                                        <ReactApexChart
                                            options={chartOptions_TonQuaHan.options}
                                            series={chartOptions_TonQuaHan.series}
                                            type="pie"
                                            width="400"
                                            height={150}
                                        />
                                    </div>
                                </Card>
                            )}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24" >
                            <div className="linechart" style={{ display: 'flex', justifyContent: 'center', userSelect: 'none', marginTop: -10 }}>
                                <div >
                                    <Title level={3}>SƠ ĐỒ KHO BÁN THÀNH PHẨM (N16)</Title>
                                </div>
                            </div>
                            <div bordered={false} className="criclebox h-full" style={{
                                // transform: "scale(0.3)",
                                // transformOrigin: 'top left',
                                // width: `${125 * scale}%`, overflow: 'hidden',
                                marginTop: -10, marginBottom: -20,
                                display: 'flex', justifyContent: 'center'
                            }}>
                                <div style={{
                                    transform: `scale(${96 / scale_}%) `,
                                    transformOrigin: 'top center',
                                }}>
                                    <div className="Layout_Kho N16" style={{ width: '100%', flexGrow: 1, marginTop: 0 }}>
                                        <TransformWrapper
                                            wheel={{
                                                step: 0.1, // Tốc độ zoom
                                                activationKeys: [], // Không yêu cầu phím bổ sung để zoom
                                                disabled: false, // Kích hoạt thu phóng bằng chuột
                                                wheelZoomPosition: "mouse", // Thu phóng theo vị trí chuột
                                            }}
                                            zoomAnimation={{
                                                animationType: "easeOut", // Loại hoạt ảnh
                                                animationTime: 200, // Thời gian hoạt ảnh (ms)
                                            }}
                                        >
                                            <TransformComponent >
                                                <Card ref={tableRef_} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_L}
                                                                bordered
                                                                dataSource={result_L}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_K}
                                                                bordered
                                                                dataSource={result_K}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_J}
                                                                bordered
                                                                dataSource={result_J}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_I}
                                                                bordered
                                                                dataSource={result_I}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_H}
                                                                bordered
                                                                dataSource={result_H}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_G}
                                                                bordered
                                                                dataSource={result_G}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_F}
                                                                bordered
                                                                dataSource={result_F}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_E}
                                                                bordered
                                                                dataSource={result_E}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_D}
                                                                bordered
                                                                dataSource={result_D}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_C}
                                                                bordered
                                                                dataSource={result_C}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_B}
                                                                bordered
                                                                dataSource={result_B}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            transform: 'rotate(-180deg)',
                                                            marginRight: 10
                                                        }}
                                                        >
                                                            <Table
                                                                columns={columns_A}
                                                                bordered
                                                                dataSource={result_A}
                                                                pagination={false}
                                                                rowKey="key"
                                                                scroll={{
                                                                    x: 'max-content',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Modal
                                                        title={`Mã vị trí kho: ${selectedMaViTriKho || 'N/A'}`}
                                                        visible={isModalVisible}
                                                        onCancel={handleModalClose}
                                                        onOk={handleModalClose}
                                                        width={"70%"}
                                                    >
                                                        <p>Phần trăm: {selectedKey} %</p>
                                                        <Table
                                                            columns={columnsMaVT_}
                                                            dataSource={DataMaViTri}
                                                            pagination={false}
                                                        // size="middle"
                                                        />
                                                    </Modal>
                                                </Card>
                                            </TransformComponent>
                                        </TransformWrapper >
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row >
                )
            }
            {
                isDivVisible && (
                    <Row gutter={[24, 0]}>
                        <Card
                            style={{
                                position: 'absolute',
                                top: 10,
                                left: -250,
                                width: 240,
                                height: window.innerHeight - 20,
                                // overflow: 'hidden',
                                zIndex: 10,
                            }}
                        >
                            <div >
                                <h1
                                    style={{
                                        fontSize: '16px',
                                        textAlign: 'center',
                                        margin: '10px 0',
                                    }}
                                >
                                    Danh sách Vị trí Kho
                                </h1>
                                {tongTon && (
                                    <div
                                        style={{
                                            // position: "fixed",
                                            padding: "15px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                            borderRadius: "8px",
                                            zIndex: 1000,
                                            border: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <p>
                                            <strong>Tên sản phẩm: </strong>
                                            {tenSP}
                                        </p>
                                        <strong>Tổng tồn: </strong>{tongTon}
                                    </div>
                                )}
                                {chamLC && (
                                    <div
                                        style={{
                                            // position: "fixed",
                                            padding: "15px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                            borderRadius: "8px",
                                            zIndex: 1000,
                                            border: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <p style={{ textAlign: 'center' }}>
                                            <strong>Vị trí chứa hàng chậm luân chuyển </strong>
                                        </p>
                                    </div>
                                )}
                                <div style={{ maxHeight: window.innerHeight - 200, overflowY: 'auto' }}>
                                    <List
                                        dataSource={listData}
                                        renderItem={(record) => (
                                            <List.Item
                                                onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)} // Sự kiện click
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    cursor: 'pointer',
                                                    border: '1px solid #f0f0f0',
                                                    borderRadius: '8px',
                                                    margin: '5px 10px',
                                                    padding: '10px',
                                                    backgroundColor: '#fff',
                                                    userSelect: 'none', // Ngăn chặn chọn văn bản,
                                                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#e6f7ff';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#fff';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <strong style={{ fontSize: '14px' }}>{record.MaViTriKho}</strong>
                                                <small style={{ color: '#888' }}>{record.PhanTram}%</small>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                        </Card>

                    </Row >
                )
            }
            {
                !isDivVisible && (
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}  >
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: -10, marginBottom: -10, userSelect: 'none', marginLeft: -270 }}>
                                <div >
                                    <Title >SƠ ĐỒ KHO BÁN THÀNH PHẨM (N16)</Title>
                                </div>
                            </div>
                            <div bordered={false} className="criclebox h-full" style={{
                                display: 'flex', justifyContent: 'center',
                                marginLeft: -270,
                                height: height * 0.99,
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    transform: `scale(${90 / scale}%) `,
                                    transformOrigin: 'top center',
                                }}>
                                    <div className="Layout_Kho N16" style={{ width: '100%', flexGrow: 1, marginTop: 10 }}>
                                        <TransformWrapper
                                            wheel={{
                                                step: 0.1, // Tốc độ zoom
                                                activationKeys: [], // Không yêu cầu phím bổ sung để zoom
                                                disabled: false, // Kích hoạt thu phóng bằng chuột
                                                wheelZoomPosition: "mouse", // Thu phóng theo vị trí chuột
                                            }}
                                            zoomAnimation={{
                                                animationType: "easeOut", // Loại hoạt ảnh
                                                animationTime: 200, // Thời gian hoạt ảnh (ms)
                                            }}
                                        >
                                            <TransformComponent >
                                                <Card ref={tableRef} style={{
                                                    zIndex: 100,
                                                    // padding: 25,
                                                    paddingTop: 40,
                                                    paddingRight: 50,
                                                    paddingBottom: 30,
                                                }}>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: 165
                                                    }}>
                                                        <div style={{ marginTop: 0, background: 'red', height: 10 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 5 }}></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-d"></div>
                                                            </div>
                                                        </div>
                                                        <Card
                                                            style={{
                                                                width: 25,
                                                                height: 16,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                marginTop: 10,
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: "#2ebe7c", // Chữ trắng
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                EXIT
                                                            </div>
                                                        </Card>
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: 430
                                                    }}>
                                                        <div style={{ marginTop: 0, background: 'red', height: 10 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 5 }}></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-d"></div>
                                                            </div>
                                                        </div>
                                                        <Card
                                                            style={{
                                                                width: 25,
                                                                height: 16,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                marginTop: 10,
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: "#2ebe7c", // Chữ trắng
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                EXIT
                                                            </div>
                                                        </Card>
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        bottom: 0,
                                                        right: 25
                                                    }}>
                                                        <div style={{ marginTop: 0, background: 'red', height: 10 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 5 }}></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-d"></div>
                                                            </div>
                                                        </div>
                                                        <Card
                                                            style={{
                                                                width: 25,
                                                                height: 16,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                marginTop: 10,
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: "#2ebe7c",
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                EXIT
                                                            </div>
                                                        </Card>
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: 400
                                                    }}>
                                                        {/* <div className="map-container"> */}
                                                        <div className="position-dot">
                                                            <div className="ripple"></div>
                                                            <div className="ripple"></div>
                                                            <div className="ripple"></div>
                                                        </div>
                                                        {/* </div> */}
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        top: 600,
                                                        left: 0,
                                                        transform: 'rotate(-90deg)',
                                                    }}>
                                                        <Card
                                                            style={{
                                                                width: 25,
                                                                height: 16,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                // alignItems: "center",
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: "#2ebe7c", // Chữ trắng
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                EXIT
                                                            </div>
                                                        </Card>
                                                        <div style={{ marginTop: 15, background: 'red', height: 50 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-u"></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 5 }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        top: 300,
                                                        left: 0,
                                                        transform: 'rotate(-90deg)',
                                                    }}>
                                                        <Card
                                                            style={{
                                                                width: 25,
                                                                height: 16,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                // alignItems: "center",
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: "#2ebe7c", // Chữ trắng
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                EXIT
                                                            </div>
                                                        </Card>
                                                        <div style={{ marginTop: 15, background: 'red', height: 50 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-u"></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 5 }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        top: 300,
                                                        right: 9,
                                                        transform: 'rotate(90deg)',
                                                    }}>
                                                        <Card
                                                            style={{
                                                                width: 25,
                                                                height: 16,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                // alignItems: "center",
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: "#2ebe7c", // Chữ trắng
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                EXIT
                                                            </div>
                                                        </Card>
                                                        <div style={{ marginTop: 15, background: 'red', height: 50 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-u"></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 5 }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        top: 600,
                                                        right: 9,
                                                        transform: 'rotate(90deg)',
                                                    }}>
                                                        <Card
                                                            style={{
                                                                width: 25,
                                                                height: 16,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                // alignItems: "center",
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: "#2ebe7c", // Chữ trắng
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                EXIT
                                                            </div>
                                                        </Card>
                                                        <div style={{ marginTop: 15, background: 'red', height: 50 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-u"></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 5 }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 40 }}>

                                                        <div style={{
                                                            display: 'flex', backgroundColor: "red",
                                                        }}>
                                                            <div className="container_" >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 150 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 180 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                            </div>

                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_K}
                                                                    bordered
                                                                    dataSource={result_K_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-body"></div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-head-r"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Table
                                                                    columns={columns_K}
                                                                    bordered
                                                                    dataSource={result_K_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                />
                                                            </div>
                                                            <div className="container_" >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 150 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 180 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_J}
                                                                    bordered
                                                                    dataSource={result_J_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                    scroll={{
                                                                        x: 'max-content',
                                                                    }}
                                                                />
                                                                <Table
                                                                    columns={columns_J}
                                                                    bordered
                                                                    dataSource={result_J_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                    scroll={{
                                                                        x: 'max-content',
                                                                    }}
                                                                    style={{ marginTop: 9 }}
                                                                />
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: 'inline-block', transform: 'rotate(-180deg)',
                                                                    background: 'red'
                                                                }}
                                                            >
                                                                <Table
                                                                    columns={columns_I}
                                                                    bordered
                                                                    dataSource={result_I_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-head-l"></div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-body"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Table
                                                                    columns={columns_I}
                                                                    bordered
                                                                    dataSource={result_I_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                />

                                                            </div>
                                                            <div className="container_" >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_H}
                                                                    bordered
                                                                    dataSource={result_H_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <Table
                                                                    columns={columns_H}
                                                                    bordered
                                                                    dataSource={result_H_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                    style={{ marginTop: 9 }}
                                                                />
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_G}
                                                                    bordered
                                                                    dataSource={result_G_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-body"></div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-head-r"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Table
                                                                    columns={columns_G}
                                                                    bordered
                                                                    dataSource={result_G_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                />
                                                            </div>
                                                            <div className="container_" >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>

                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_F}
                                                                    bordered
                                                                    dataSource={result_F_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <Table
                                                                    columns={columns_F}
                                                                    bordered
                                                                    dataSource={result_F_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                    style={{ marginTop: 9 }}
                                                                />
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_E}
                                                                    bordered
                                                                    dataSource={result_E_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-head-l"></div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-body"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Table
                                                                    columns={columns_E}
                                                                    bordered
                                                                    dataSource={result_E_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                />
                                                            </div>
                                                            <div className="container_" >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>

                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_D}
                                                                    bordered
                                                                    dataSource={result_D_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <Table
                                                                    columns={columns_D}
                                                                    bordered
                                                                    dataSource={result_D_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                    style={{ marginTop: 9 }}
                                                                />
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_C}
                                                                    bordered
                                                                    dataSource={result_C_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-body"></div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-head-r"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Table
                                                                    columns={columns_C}
                                                                    bordered
                                                                    dataSource={result_C_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                />
                                                            </div>
                                                            <div className="container_" >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>

                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_B}
                                                                    bordered
                                                                    dataSource={result_B_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-body"></div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            <div className="arrow-head-r"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Table
                                                                    columns={columns_B}
                                                                    bordered
                                                                    dataSource={result_B_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                />
                                                            </div>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-180deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_A}
                                                                    bordered
                                                                    dataSource={result_A_1}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                                <Table
                                                                    columns={columns_A}
                                                                    bordered
                                                                    dataSource={result_A_2}
                                                                    pagination={false}
                                                                    showHeader={false}
                                                                    rowKey="key"
                                                                    style={{ marginTop: 9 }}
                                                                />
                                                                <div style={{
                                                                    position: "absolute", bottom: 0, left: -10,
                                                                    width: 918, height: 95, backgroundColor: "#FFFFFF"
                                                                }}></div>
                                                            </div>

                                                            <div className="container_" >
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 150 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 120 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 180 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                            </div>
                                                        </div>
                                                        <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-r"></div>
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-r"></div>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-r"></div>
                                                                </div>
                                                            </div>
                                                            {/*  */}
                                                        </div>
                                                        <div className="container" style={{ background: "red", width: "100%", justifyContent: 'space-around', height: 65 }}>
                                                            <div style={{
                                                                display: 'inline-block', transform: 'rotate(-90deg)',
                                                                background: 'red'
                                                            }}
                                                            >
                                                                <Table
                                                                    columns={columns_L}
                                                                    bordered
                                                                    dataSource={result_L}
                                                                    pagination={false}
                                                                    rowKey="key"
                                                                />
                                                            </div>
                                                        </div>
                                                        <Modal
                                                            title={`Mã vị trí kho: ${selectedMaViTriKho || 'N/A'}`}
                                                            visible={isModalVisible}
                                                            onCancel={handleModalClose}
                                                            onOk={handleModalClose}
                                                            width={"70%"}
                                                        >
                                                            <p>Phần trăm: {selectedKey} %</p>
                                                            <Table
                                                                columns={columnsMaVT}
                                                                dataSource={DataMaViTri}
                                                                pagination={false}
                                                            // size="middle"
                                                            />
                                                        </Modal>
                                                    </div>
                                                </Card>
                                            </TransformComponent>
                                        </TransformWrapper>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row >
                )
            }
        </>
    );
}

export default KhoN16;
