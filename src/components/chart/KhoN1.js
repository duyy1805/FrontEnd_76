import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from "react-apexcharts";
import {
    Typography, Table,
    Tooltip, Modal, Row, Col,
    Card, Input, Button, Select, Space,
    List, Breadcrumb, notification
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
// import "../../assets/styles/Style.css"
import ApexCharts from 'apexcharts'
import apiConfig from '../../../src/apiConfig.json'
import { NavLink, Link, useLocation } from "react-router-dom";

//Gọi API layout kho
const callAPILayoutKho_NPL = async () => {
    try {

        const response = await axios.post(
            `${apiConfig.API_BASE_URL}/layoutkho/npl`,
            {
                tenNha: "Kho N1",
                idKho: 1,
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

const colorsArray = generateColors(50);
//Fucntion ở đây
const KhoN1 = (props) => {
    const tableRef = useRef(null);
    const [scale, setScale] = useState(1);
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

    // Hàm xử lý toggle
    const { pathname } = useLocation();

    const buttonRefScreen = useRef(null);

    const toggleDiv = () => {
        setIsDivVisible(!isDivVisible);
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
        item.chiTiets.filter(subItem => subItem.tuoiTon > ngayChamLC)
    );

    const overdueGroupedByProduct = overdueItems.reduce((acc, item) => {
        const { Ten_SanPham, Ton } = item;
        acc[Ten_SanPham] = (acc[Ten_SanPham] || 0) + Ton;
        return acc;
    }, {});

    //Dữ liệu khi nhấn vào vị trí
    const DataMaViTri = selectedMaViTri.map((item, index) => ({
        key: index,
        ItemCode: item.maVatTu,
        checkv: item.checkv,
        maDonHang: item.maDonHang,
        quyCach: item.quyCach,
        ton: item.ton,
        tuoiTon: item.tuoiTon,
        tongTonTheoMDH: item.tongTonTheoMDH
    }));
    //Thông tin mã vị trí khi dùng Modal
    const columnsMaVT = [
        {
            title: 'Mã vật tư',
            dataIndex: 'ItemCode',
            key: 'ItemCode',
            align: 'center',
        },
        {
            title: 'Quy cách',
            dataIndex: 'quyCach',
            key: 'quyCach',
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
            dataIndex: 'maDonHang',
            key: 'maDonHang',
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
            dataIndex: 'tongTonTheoMDH',
            key: 'tongTonTheoMDH',
            align: 'center',
        },
        {
            title: 'Tồn tại vị trí',
            dataIndex: 'ton',
            key: 'ton',
            align: 'center',
        },
        {
            title: 'Tuổi tồn',
            dataIndex: 'tuoiTon',
            key: '',
            align: 'center',
        },
    ];

    const updateHeight = () => {
        setHeight(window.innerHeight);
    };

    // hàng chậm luân chuyển

    //Chọn tên sản phẩm
    const ChangeSelectTenSP = (value) => {
        setSelectedProduct(value);
        // Lọc các dòng phù hợp với Ten_SanPham
        const matchedRows = data.filter((record) =>
            record.chiTiets.some((item) => item.quyCach === value)
        );

        // Sắp xếp matchedRows trước theo tuoiTonBTP, sau đó theo maViTriKho
        const sortedMatchedRows = matchedRows.sort((a, b) => {
            // Lấy tuổi tồn lớn nhất của Ten_SanPham từ từng record
            const maxA = Math.max(
                ...a.chiTiets
                    .filter((item) => item.quyCach === value)
                    .map((item) => item.tuoiTon || 0)
            );

            const maxB = Math.max(
                ...b.chiTiets
                    .filter((item) => item.quyCach === value)
                    .map((item) => item.tuoiTon || 0)
            );

            // So sánh tuổi tồn
            if (maxB !== maxA) {
                return maxB - maxA; // Tuổi tồn giảm dần
            }

            // Nếu tuổi tồn bằng nhau, so sánh theo mã vị trí kho
            const [charA, numA] = [a.maViTriKho[0], parseInt(a.maViTriKho.slice(1), 10)];
            const [charB, numB] = [b.maViTriKho[0], parseInt(b.maViTriKho.slice(1), 10)];

            // So sánh chữ cái (A, B, C)
            if (charA !== charB) {
                return charA.localeCompare(charB); // A < B < C
            }

            // So sánh số (101, 102, ...)
            return numA - numB; // Số tăng dần
        });


        const x = data
            .map((record) =>
                record.chiTiets
                    .filter((item) => item.quyCach === value) // Lọc các phần tử trong ItemCode thỏa mãn điều kiện
                    .map((item) => item.tongTon) // Lấy ra thuộc tính TongTon của các phần tử đã lọc
            )
            .flat();
        setTenSP(value);
        setTongTon(x[0]);
        setTong({ quyCach: value, tongTon: x[0] });
        setChamLC(undefined);
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
                        .map((item) => item.tuoiTon || 0)
                );

                const maxB = Math.max(
                    ...b.ItemCode
                        .filter((item) => item.ItemCode === inputMaVatTu)
                        .map((item) => item.tuoiTon || 0)
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
                        record.chiTiets
                            .filter((item) => item.maVatTu === inputMaVatTu) // Lọc các phần tử trong ItemCode thỏa mãn điều kiện
                            .map((item) => ({
                                TongTon: item.TongTon,
                                Ten_SanPham: item.quyCach,
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
        console.log("pathname", pathname)
        if (pathname === "/KhoN1") {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "auto"; // Hoặc giá trị mặc định
        }
        const fetchData = async () => {
            try {
                const response = await callAPILayoutKho_NPL();

                const filteredData = response.data.filter(item => {
                    const code = item.maViTriKho.slice(1); // Lấy phần sau ký tự 'A'
                    const lastDigit = parseInt(item.maViTriKho.slice(-1), 10); // Lấy chữ số cuối
                    let digitsAfterA;

                    if (item.maViTriKho.length === 5) {
                        digitsAfterA = parseInt(item.maViTriKho.slice(1, 3), 10); // Lấy 2 chữ số sau 'A'
                    } else {
                        digitsAfterA = parseInt(item.maViTriKho.slice(1, 2), 10); // Lấy 1 chữ số sau 'A'
                    }

                    // Điều kiện lọc
                    return lastDigit < 5 && digitsAfterA < 9;
                });
                const sortedData = filteredData.sort((a, b) => {
                    // Lấy phần số sau chữ cái đầu tiên
                    const numberA = parseInt(a.maViTriKho.slice(1), 10);
                    const numberB = parseInt(b.maViTriKho.slice(1), 10);

                    // Sắp xếp tăng dần theo giá trị số
                    return numberB - numberA;
                });
                const tonMap = {};
                const tonMap1 = {};
                // Tạo bản đồ tổng tồn
                filteredData.forEach(viTri => {
                    viTri.chiTiets.forEach(chiTiet => {
                        const key = `${chiTiet.maVatTu}-${chiTiet.tuoiTon}`;
                        tonMap[key] = (tonMap[key] || 0) + chiTiet.ton;
                    });
                });

                filteredData.forEach(viTri => {
                    viTri.chiTiets.forEach(chiTiet => {
                        const key = `${chiTiet.maVatTu}-${chiTiet.tuoiTon}`;
                        chiTiet.tongTon = tonMap[key];
                    });
                });

                filteredData.forEach(viTri => {
                    viTri.chiTiets.forEach(chiTiet => {
                        const key = `${chiTiet.maVatTu}-${chiTiet.maDonHang}-${chiTiet.tuoiTon}`;
                        tonMap1[key] = (tonMap1[key] || 0) + chiTiet.ton;
                    });
                });

                filteredData.forEach(viTri => {
                    viTri.chiTiets.forEach(chiTiet => {
                        const key = `${chiTiet.maVatTu}-${chiTiet.maDonHang}-${chiTiet.tuoiTon}`;
                        chiTiet.tongTonTheoMDH = tonMap1[key];
                    });
                });
                console.log(filteredData)
                setData(filteredData);
                setListData(filteredData);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        fetchData();
        // const timer = setTimeout(() => {
        //     if (buttonRefScreen.current) {
        //         buttonRefScreen.current.click(); // Click button sau 10 giây
        //     }
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
                    ? (tableWidth * 10 + 30) / ((screenWidth - 250) * 0.75)//Hơi đần tý :v
                    : (tableWidth * 10 + 30) / ((screenWidth - 250) * 0.75);
                setScale(newScale);
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
            item.chiTiets.map(subItem => ({
                ItemCode: subItem.maVatTu,
                tuoiTonBTP: subItem.tuoiTon,
                Ten_SanPham: subItem.quyCach,
                Ma_DonHang: subItem.maDonHang,
                MaViTriKho: item.maViTriKho
            }))
        ) // Biến đổi data để lấy tất cả các ItemCode từ mảng con
        .filter(item => item.tuoiTon > 0) // Lọc các ItemCode có tuoiTonBTP lớn hơn 0
        .sort((a, b) => b.tuoiTon - a.tuoiTon) // Sắp xếp theo tuoiTonBTP giảm dần
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
            data: top5TuoiTon.map(item => item.tuoiTon), // tuoiTonBTP làm dữ liệu
        },
    ];


    useEffect(() => {

        ChamLuanchuyen();
    }, [ngayChamLC]); // Các phụ thuộc
    useEffect(() => {

        handleClear();
    }, []); // Các phụ thuộc
    const ChamLuanchuyen = () => {

        const matchedRows = data.filter((record) =>
            record.chiTiets.some((item) => item.tuoiTon > ngayChamLC)
        );

        // Sắp xếp matchedRows trước theo tuoiTonBTP, sau đó theo maViTriKho
        const sortedMatchedRows = matchedRows.sort((a, b) => {
            const maxA = Math.max(
                ...a.chiTiets
                    .map((item) => item.tuoiTon || 0)
            );

            const maxB = Math.max(
                ...b.chiTiets
                    .map((item) => item.tuoiTon || 0)
            );

            // So sánh tuổi tồn
            if (maxB !== maxA) {
                return maxB - maxA; // Tuổi tồn giảm dần
            }

            // Nếu tuổi tồn bằng nhau, so sánh theo mã vị trí kho
            const [charA, numA] = [a.maViTriKho[0], parseInt(a.maViTriKho.slice(1), 10)];
            const [charB, numB] = [b.maViTriKho[0], parseInt(b.maViTriKho.slice(1), 10)];

            // So sánh chữ cái (A, B, C)
            if (charA !== charB) {
                return charA.localeCompare(charB); // A < B < C
            }
            return numA - numB; // Số tăng dần
        });
        const map = new Map();
        const mavitri = Object.values(matchedRows).map(item => ({
            maViTriKho: item.maViTriKho
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
            item.chiTiets.filter(subItem => subItem.tuoiTon > date)
        );

        const overdueGroupedByProduct = overdueItems.reduce((acc, item) => {
            const { quyCach, ton } = item;
            acc[quyCach] = (acc[quyCach] || 0) + ton;
            return acc;
        }, {});


        // Tổng số lượng tồn quá hạn
        const totalOverdueTon = Object.values(overdueGroupedByProduct).reduce((sum, ton) => sum + ton, 0);

        // Chuẩn bị dữ liệu hàng quá hạn
        const overdueChartData = Object.entries(overdueGroupedByProduct).map(([quyCach, ton]) => ({
            name: `${quyCach}`,
            value: ton
        }));

        // Lọc và tính tổng hàng trong hạn (tuoiTonBTP <= 100)
        const withinLimitItems = data.flatMap(item =>
            item.chiTiets.filter(subItem => subItem.tuoiTon <= date)
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
    const countEqual0 = data.filter(item => item.phanTram == 0).length;
    const countGreaterThan0 = data.filter(item => item.phanTram > 0 && item.phanTram <= 85).length;
    const countLessThan100 = data.filter(item => item.phanTram > 85 && item.phanTram < 100).length;
    const countGreaterThan100 = data.filter(item => item.phanTram >= 100).length;

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
        const prefix = item.maViTriKho.slice(0, 2);
        if (!acc[prefix]) {
            acc[prefix] = [];
        }
        acc[prefix].push(item);
        return acc;
    }, {});

    const optionsSelect = Array.from(
        new Set(
            data
                .flatMap((item) =>
                    item.chiTiets?.map((code) => code.quyCach).filter((name) => name) || []
                )
        )
    ).map((uniqueName) => ({
        label: uniqueName,
        value: uniqueName,
    }));


    const sortedGroupedData = Object.entries(groupedData).map(([key, values]) => {
        // Sắp xếp mảng con theo MaViTriKho
        const sortedValues = values.sort((a, b) => {
            const maViTriKhoA = a.maViTriKho;
            const maViTriKhoB = b.maViTriKho;

            // Sắp xếp theo thứ tự số
            const numberA = parseInt(maViTriKhoA.slice(1), 10);
            const numberB = parseInt(maViTriKhoB.slice(1), 10);

            return numberA - numberB; // Tăng dần theo MaViTriKho
        });

        return { key, values: sortedValues };
    });
    //=================================================
    const createData = (groupedData, prefix) => {
        if (Object.keys(groupedData).length === 0) return null;

        return groupedData[`${prefix}1`]?.map((item, index) => {
            const entry = {};
            for (let i = 1; i <= 4; i++) {
                const key = `${prefix}${i}`;
                entry[key] = groupedData[key]
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
    const data_A = createData(groupedData, 'A');
    const data_B = createData(groupedData, 'B');
    const createResult = (data, prefix) => {
        if (!data) return [];

        const result = [];
        for (let index = 0; index < data.length / 2; index++) {
            const values = [];
            for (let i = 1; i <= 4; i++) {
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

    // Sử dụng

    const groupData = (data, groupSize, prefix) => {
        // Lọc dữ liệu dựa trên prefix
        const filteredData = data.filter((item) => item.maViTriKho.startsWith(prefix));

        // Nhóm dữ liệu đã lọc
        const grouped = [];
        for (let i = 0; i < filteredData.length; i += groupSize) {
            grouped.push({
                key: i / groupSize,
                values: filteredData.slice(i, i + groupSize),
            });
        }
        return grouped;
    };


    const result_A = groupData(data, 4, 'A');
    console.log(result_A)
    const result_B = groupData(data, 4, 'B');

    //========================================

    const generateColumn = (keyPrefix) => {
        const columns = Array.from({ length: 4 }, (_, index) => {
            const key = `${keyPrefix}${index}`;
            return {
                dataIndex: ['values', index],
                key: `${key}`,
                render: (record) => {
                    const className = record.phanTram >= 100
                        ? 'red-background'
                        : record.phanTram > 85 && record.phanTram < 100
                            ? 'yellow-background'
                            : record.phanTram > 0 && record.phanTram <= 85
                                ? 'green-background'
                                : 'white-background';
                    const isHighlighted = viTri.some(
                        // (item) => item.maViTriKho === record.MaViTriKho
                        (item) => item.maViTriKho === record.maViTriKho
                    );
                    const isHighlighted2 = record.chiTiets.some(
                        // (item) => item.maViTriKho === record.MaViTriKho
                        (item) => item.quyCach === selectedProduct
                    );
                    return (
                        <div
                            className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                            style={{
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                                fontSize: '8px',
                                // outline: isHighlighted ? '2px solid blue' : 'none',
                                // border: '1px solid #000'
                            }}
                            onClick={() => handleClick(record.phanTram, record.chiTiets, record.maViTriKho)}
                        >
                            {record.maViTriKho}
                        </div>
                    )
                },
                width: 20,
            };
        });
        return [
            {
                title: <div style={{ whiteSpace: 'nowrap', textAlign: 'center', fontSize: '20px' }}>
                    Dãy {keyPrefix}
                </div>,
                children: columns
            },
        ];
    };

    // Tạo các cột
    const columns_A = generateColumn('A');
    const columns_B = generateColumn('B');
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
                    fontSize: "24px",
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
            <Row gutter={[24, 0]} style={{ paddingTop: 20, paddingBottom: 10, marginLeft: !isDivVisible ? -250 : 0, }}>
                <Col span={24} md={6}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">
                                Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
                            Kho N1
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="ant-page-header-heading">
                        <span
                            className="ant-page-header-heading-title"
                            style={{ textTransform: "capitalize" }}
                        >
                            Kho N1
                        </span>
                    </div>
                </Col>
            </Row >
            {isDivVisible && (
                <Row className="rowgap-vbox" gutter={[24, 0]}>
                    <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        xl={12}
                        className="mb-24"
                    >
                        <Card bordered={false} className=" "
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
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={24} className="mb-24">
                            <div className="linechart" style={{ display: 'flex', justifyContent: 'center' }}>
                                <div >
                                    <Title level={3}>SƠ ĐỒ KHO N1</Title>
                                </div>
                            </div>
                            <Card bordered={false} className="criclebox h-full" style={{
                                display: 'flex', justifyContent: 'center', width: "100%"
                            }}>

                                <div className="Layout_Kho N1" style={{ flexGrow: 1, marginTop: 10, marginBottom: -10 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                marginRight: 30
                                            }}
                                                ref={tableRef}>
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
                                            <div style={{
                                                display: 'inline-block',
                                                marginRight: 30
                                            }}
                                                ref={tableRef}>
                                                <Table
                                                    columns={columns_B}
                                                    bordered
                                                    dataSource={result_B}
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
                                                scroll={{
                                                    y: 55 * 8,
                                                }}
                                            />
                                        </Modal>
                                    </div>

                                </div>
                            </Card>
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
                                overflow: 'hidden',
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
                                            <strong>Quy cách: </strong>
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
                                                onClick={() => handleClick(record.phanTram, record.chiTiets, record.maViTriKho)} // Sự kiện click
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
                                                <strong style={{ fontSize: '14px' }}>{record.maViTriKho}</strong>
                                                <small style={{ color: '#888' }}>{record.phanTram}%</small>
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
                        <Col xs={24} sm={24} md={12} lg={12} xl={20} className="mb-24">
                            <div className="linechart" style={{ display: 'flex', justifyContent: 'center', marginTop: 0 }}>
                                <div >
                                    <Title level={1}>SƠ ĐỒ KHO N1 </Title>
                                </div>
                            </div>
                            <Card bordered={false} className="criclebox h-full" style={{

                                // marginLeft: -270,
                                marginTop: 0,
                                display: 'flex',
                                transform: 'scale(120%)', //110
                                transformOrigin: 'top center',
                                justifyContent: 'center'
                            }}>
                                {/* <div style={{ display: 'flex' }}>
                  <div className="container" style={{ marginLeft: 600 }}>
                    <div className="arrow-body"></div>
                    <div className="arrow-head-r"></div>
                  </div>
                  <div className="container" style={{ marginLeft: 650 }}>
                    <div className="arrow-head-l"></div>
                    <div className="arrow-body" ></div>
                  </div>
                  <div className="container" style={{ marginLeft: 400 }}>
                    <div className="arrow-body"></div>
                    <div className="arrow-head-r"></div>
                  </div>
                </div> */}
                                <div className="Layout_Kho N1" style={{ width: '100%', flexGrow: 1, marginTop: 0, marginBottom: -60 }}>
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
                                            <Card style={{
                                                zIndex: 100,
                                                margin: 40,
                                            }}>
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
                                                </div>
                                                <div style={{
                                                    width: 60,
                                                    height: 30,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    // alignItems: "center",
                                                    position: "absolute",
                                                    top: 250,
                                                    left: -50,
                                                    transform: 'rotate(-90deg)',
                                                }}>
                                                    <Card
                                                        style={{
                                                            width: 60,
                                                            height: 30,
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
                                                        <Typography.Title
                                                            level={5}
                                                            style={{
                                                                color: "#2ebe7c", // Chữ trắng
                                                                fontWeight: "bold",
                                                                margin: 0,
                                                            }}
                                                        >
                                                            EXIT
                                                        </Typography.Title>
                                                    </Card>
                                                    <div style={{ marginTop: 15, background: 'red', height: 50 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <div className="arrow-head-u"></div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <div className="arrow-body_" style={{ height: 20 }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 0 }}>
                                                    <div style={{
                                                        display: 'flex', backgroundColor: "red",
                                                        // paddingBottom: 40, marginBottom: 20,
                                                        // marginLeft: 40, 
                                                    }}>
                                                        <div className="container_" >
                                                            {/*  */}
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                                                                <div className="arrow-head-u"></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_"></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
                                                                <div className="arrow-body_"></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-d"></div>
                                                            </div>
                                                            {/*  */}
                                                        </div>
                                                        <div style={{
                                                            display: 'inline-block',
                                                            background: '#FFFFFF'
                                                        }}
                                                            ref={tableRef}>
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
                                                        <div className="container_" >
                                                            <div className="container_" >

                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
                                                            </div>
                                                            {/*  */}
                                                        </div>
                                                        <div style={{
                                                            display: 'inline-block',
                                                            background: '#FFFFFF'
                                                        }}
                                                            ref={tableRef}>
                                                            <Table
                                                                columns={columns_B}
                                                                bordered
                                                                dataSource={result_B}
                                                                pagination={false}
                                                                rowKey="key"
                                                            />
                                                        </div>
                                                        <div className="container_" >
                                                            <div className="container_" >

                                                                {/*  */}
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                                                                    <div className="arrow-head-u"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
                                                                    <div className="arrow-body_"></div>
                                                                </div>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className="arrow-head-d"></div>
                                                                </div>
                                                                {/*  */}
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
                                                    </div>
                                                    <div style={{
                                                        width: 60,
                                                        height: 30,
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        // alignItems: "center",
                                                        position: "absolute",
                                                        top: 530,
                                                        left: 400
                                                    }}>
                                                        <div style={{ marginTop: 13, background: 'red', height: 50 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-body_" style={{ height: 20 }}></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <div className="arrow-head-d"></div>
                                                            </div>
                                                        </div>
                                                        <Card
                                                            style={{
                                                                width: 60,
                                                                height: 30,
                                                                zIndex: 10000,
                                                                background: "#000000", // Gradient
                                                                borderRadius: 0,
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                marginTop: 40,
                                                                position: "absolute",
                                                            }}
                                                            bodyStyle={{
                                                                padding: 0,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <Typography.Title
                                                                level={5}
                                                                style={{
                                                                    color: "#2ebe7c", // Chữ trắng
                                                                    fontWeight: "bold",
                                                                    margin: 0,
                                                                }}
                                                            >
                                                                EXIT
                                                            </Typography.Title>
                                                        </Card>
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
                                                            scroll={{
                                                                y: 55 * 8,
                                                            }}
                                                        />
                                                    </Modal>
                                                </div>
                                            </Card>
                                        </TransformComponent>
                                    </TransformWrapper>
                                </div>
                                {/* <div style={{ display: 'flex' }}>
                  <div className="container" style={{ marginLeft: 100 }}>
                    <div className="arrow-body"></div>
                    <div className="arrow-head-r"></div>
                  </div>
                  <div className="container" style={{ marginLeft: 570 }}>
                    <div className="arrow-body"></div>
                    <div className="arrow-head-r"></div>
                  </div>
                  <div className="container" style={{ marginLeft: 480 }}>
                    <div className="arrow-head-l"></div>
                    <div className="arrow-body" ></div>
                  </div>
                  <div className="container" style={{ marginLeft: 400 }}>
                    <div className="arrow-body"></div>
                    <div className="arrow-head-r"></div>
                  </div>
                  <div className="container" style={{ marginLeft: 1300 }}>
                    <div className="arrow-head-l"></div>
                    <div className="arrow-body" ></div>
                  </div>
                </div> */}
                            </Card>
                        </Col>
                    </Row >
                )
            }
        </>
    );
}

export default KhoN1;
