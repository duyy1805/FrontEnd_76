/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from "react-apexcharts";
import {
  Typography, Table,
  Tooltip, Modal, Row, Col,
  Card, Input, Button, Select, Space,
  List
} from "antd";
import {
  MinusOutlined, SearchOutlined,
  StarOutlined,
  TwitterOutlined,
  FacebookFilled,
  FullscreenOutlined, FullscreenExitOutlined,
} from "@ant-design/icons";
import axios from 'axios';
import khoK3 from "./configs/khoK3";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../../assets/styles/Style.css"
import ApexCharts from 'apexcharts'
import apiConfig from '../../../src/apiConfig.json'


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
    return (response)
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
}


//Fucntion ở đây
const KhoK3 = (props) => {
  const tableRef = useRef(null);
  const [scale, setScale] = useState(1);
  //==============useState
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedMaViTriKho, setSelectedMaviTriKho] = useState(null);
  const [selectedMaVT, setSelectedMaVT] = useState([]);
  const [data, setData] = useState([]);
  const [inputLenhXuatVT, setInputLenhXuatVT] = useState("");
  const [inputMaVatTu, setInputMaVatTu] = useState("");
  const [viTri, setViTri] = useState([]);
  const [highlightedCell, setHighlightedCell] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [listData, setListData] = useState([]);
  const [height, setHeight] = useState(window.innerHeight);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
  const callAPISearch_ = async () => {
    try {
      // Gửi yêu cầu GET tới API
      const response = await axios.post(
        `${apiConfig.API_BASE_URL}/layoutkho/bylenhxuatbtp`,
        {
          soLenhXuatBTP: inputLenhXuatVT,//LXBTP-2023-10-1879
          itemCode: inputMaVatTu
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return (response)
    } catch (error) {
      if (error.response) {
        console.log("Mã lỗi:", error.response.status); // Mã lỗi nếu có lỗi trong phản hồi
      } else {
        console.error("Lỗi kết nối hoặc yêu cầu", error);
      }
    }
  }

  const DataMaVT = selectedMaVT.map((item, index) => ({
    key: index,
    ItemCode: item.ItemCode,
    Checkv: item.Checkv,
    Ma_DonHang: item.Ma_DonHang,
    Ten_SanPham: item.Ten_SanPham,
    Ton: item.Ton,
    tuoiTonBTP: item.tuoiTonBTP
  }));
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
      title: 'Tồn',
      dataIndex: 'Ton',
      key: 'Ton',
      align: 'center',
    },
    {
      title: 'Tuổi tồn',
      dataIndex: 'tuoiTonBTP',
      key: '',
      align: 'center',
    },
  ];
  const updateHeight = () => {
    setHeight(window.innerHeight);
  };

  const ChangeSelectTenSP = (value) => {
    setSelectedProduct(value);
    const matchedRows = data.filter((record) =>
      record.ItemCode.some((item) => item.Ten_SanPham === value)
    );
    console.log(matchedRows)
    // setHighlightedRows(matchedRows.map((row) => row.MaViTriKho));

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
    setSelectedMaVT(key2)
    setSelectedMaviTriKho(key3)
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedKey(null); // Xóa key sau khi đóng modal
  };

  const [threshold, setThreshold] = useState(null);


  const handleThresholdChange = (e) => {
    const value = e.target.value;
    setThreshold(value);
  };

  const handleClear = () => {
    setViTri([])
    setListData(data)
  }

  const handleSubmit = async () => {
    try {
      const response = await callAPISearch_();
      const map = new Map();
      const uniqueData = response.data.filter((item) => {
        // const key = `${item.idViTriKho}_${item.maViTriKho}_${item.itemCode}`;
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
      setListData(inputMaVatTu === '' && inputLenhXuatVT === '' ? data : listData)
      console.log(uniqueData)
    }
    catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  }

  const enterFullScreen = () => {
    const element = document.documentElement; // Lấy phần tử HTML chính
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen(); // Firefox
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Chrome, Safari, Opera
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge
    }
  };
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
        // Lưu dữ liệu vào state  
        const today = new Date(); // Lấy ngày hiện tại

        const tuoiTonBTP = response.data.map(item => {
          if (!item.Ngay_NhapBTP || item.ton === 0) {
            return 0;
          }
          const ngayNhap = new Date(item.Ngay_NhapBTP); // Chuyển chuỗi Ngay_NhapBTP thành đối tượng Date
          const diffTime = today - ngayNhap; // Tính hiệu số thời gian (miliseconds)
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Chuyển đổi từ milliseconds sang số ngày
          return diffDays; // Trả về số ngày tuổi tồn BTP
        });

        const formattedData = MaViTriKho.map((MaViTriKho, index) => ({
          // key: index + 1,
          rowTitle: `Hàng ${MaViTriKho.slice(0, -2)}`, // Tạo rowTitle dựa vào phần đầu (bỏ 2 chữ số cuối)
          MaViTriKho: MaViTriKho,
          PhanTram: PhanTram[index],
          ItemCode: ItemCode[index],
          Checkv: Checkv[index],
          Ten_SanPham: Ten_SanPham[index],
          Ma_DonHang: Ma_DonHang[index],
          Ton: Ton[index],
          tuoiTonBTP: tuoiTonBTP[index]
        }));
        const groupedData = formattedData.reduce((acc, item) => {
          // Tạo khóa duy nhất dựa vào rowTitle, MaViTriKho, và PhanTram
          const key = `${item.rowTitle}-${item.MaViTriKho}`;


          if (!acc[key]) {
            acc[key] = {
              rowTitle: item.rowTitle,
              MaViTriKho: item.MaViTriKho,
              PhanTram: item.PhanTram,
              ItemCode: [] // Khởi tạo mảng để chứa cả ItemCode và Checkv
            };
          }


          const exists = acc[key].ItemCode.some(i => i.ItemCode === item.ItemCode && i.Checkv === item.Checkv);
          if (!exists) {
            acc[key].ItemCode.push({
              ItemCode: item.ItemCode, Checkv: item.Checkv,
              Ma_DonHang: item.Ma_DonHang,
              Ten_SanPham: item.Ten_SanPham,
              Ton: item.Ton,
              tuoiTonBTP: item.tuoiTonBTP
            });
          }

          return acc;
        }, {});
        // Chuyển đổi đối tượng thành mảng
        const finalGroupedData = Object.values(groupedData);
        setData(finalGroupedData);
        setListData(finalGroupedData)

      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    const handleFullScreenChange = () => {
      setIsFullScreen(
        document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
          ? true
          : false
      );
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("msfullscreenchange", handleFullScreenChange);

    window.addEventListener("resize", updateHeight);

    fetchData();

    const handleResize = () => {
      if (tableRef.current) {
        const tableWidth = tableRef.current.offsetWidth;
        const tableHeight = tableRef.current.offsetHeight; // Lấy chiều cao của table
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight; // Lấy chiều cao màn hình
        // const newScale = (screenHeight - 150) / tableHeight;

        const newScale = (tableWidth * 10 + 30) / ((screenWidth - 250) * 0.75);

        setScale(newScale); // Giới hạn scale tối đa là 1
      }
    };

    const observer = new MutationObserver(() => {
      handleResize(); // Gọi resize ngay khi bảng thay đổi DOM
    });

    if (tableRef.current) {
      handleResize(); // Gọi ngay lần đầu khi render
      observer.observe(tableRef.current, { childList: true, subtree: true }); // Theo dõi thay đổi trong bảng
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect(); // Hủy theo dõi MutationObserver
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullScreenChange
      );
    };
  }, [])

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
  const createData = (groupedData, prefix) => {
    if (Object.keys(groupedData).length === 0) return null;

    return groupedData[`${prefix}1`]?.map((item, index) => {
      const entry = {};
      for (let i = 1; i <= 6; i++) {
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
  const data_C = createData(groupedData, 'C');
  const data_D = createData(groupedData, 'D');
  const data_E = createData(groupedData, 'E');
  const data_F = createData(groupedData, 'F');
  const data_G = createData(groupedData, 'G');
  const data_H = createData(groupedData, 'H');
  const data_I = createData(groupedData, 'I');
  const data_J = createData(groupedData, 'J');
  const createResult = (data, prefix) => {
    if (!data) return [];

    const result = [];
    for (let index = 0; index < data.length / 2; index++) {
      const values = [];
      for (let i = 1; i <= 6; i++) {
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
  const result_A = createResult(data_A, 'A');
  const result_B = createResult(data_B, 'B');
  const result_C = createResult(data_C, 'C');
  const result_D = createResult(data_D, 'D');
  const result_E = createResult(data_E, 'E');
  const result_F = createResult(data_F, 'F');
  const result_G = createResult(data_G, 'G');
  const result_H = createResult(data_H, 'H');
  const result_I = createResult(data_I, 'I');
  const result_J = createResult(data_J, 'J');


  //========================================

  const generateColumn = (keyPrefix) => {
    const columns = Array.from({ length: 6 }, (_, index) => {
      const key = `${keyPrefix}${6 - index}`;
      return {
        title: (
          <div style={{ transform: 'rotate(90deg)', height: '20px', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '8px' }}>
            Tầng {6 - index}
          </div>
        ),
        children: [
          {
            title: (
              <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '8px' }}>
                {key}
              </div>
            ),
            children: [
              {
                title: (
                  <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '8px', lineHeight: '20px' }}>
                    Số chẵn
                  </div>
                ),
                dataIndex: ['values', (5 - index) * 2 + 1],
                key: `${key}_even`,
                render: (record) => {
                  const className = record.PhanTram >= 100
                    ? 'red-background'
                    : record.PhanTram > 85 && record.PhanTram < 100
                      ? 'yellow-background'
                      : record.PhanTram > 0 && record.PhanTram <= 85
                        ? 'green-background'
                        : 'white-background';
                  const isHighlighted = viTri.some(
                    // (item) => item.maViTriKho === record.MaViTriKho
                    (item) => item.maViTriKho === record.MaViTriKho
                  );
                  const isHighlighted2 = record.ItemCode.some(
                    // (item) => item.maViTriKho === record.MaViTriKho
                    (item) => item.Ten_SanPham === selectedProduct
                  );
                  return (
                    <div
                      className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                      style={{
                        transform: 'rotate(90deg)',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        fontSize: '8px',
                        // outline: isHighlighted ? '2px solid blue' : 'none',
                        // border: '1px solid #000'
                      }}
                      onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)}
                    >
                      {record.MaViTriKho}
                    </div>
                  )
                },
                width: 20,
              },
              {
                title: (
                  <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '8px', lineHeight: '20px', padding: '0 6px' }}>
                    Số lẻ
                  </div>
                ),
                dataIndex: ['values', (5 - index) * 2],
                key: `${key}_odd`,
                render: (record) => {
                  const className = record.PhanTram >= 100
                    ? 'red-background'
                    : record.PhanTram > 85 && record.PhanTram < 100
                      ? 'yellow-background'
                      : record.PhanTram > 0 && record.PhanTram <= 85
                        ? 'green-background'
                        : 'white-background';

                  const isHighlighted = viTri.some(
                    // (item) => item.maViTriKho === record.MaViTriKho
                    (item) => item.maViTriKho === record.MaViTriKho
                  );
                  const isHighlighted2 = record.ItemCode.some(
                    // (item) => item.maViTriKho === record.MaViTriKho
                    (item) => item.Ten_SanPham === selectedProduct
                  );
                  return (
                    <div
                      className={`${className} ${isHighlighted || isHighlighted2 ? 'blink-glow' : ''}`}
                      style={{
                        transform: 'rotate(90deg)',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        fontSize: '8px',
                        // outline: isHighlighted ? '2px solid blue' : 'none',
                        // border: '1px solid #000',
                      }}
                      onClick={() => handleClick(record.PhanTram, record.ItemCode, record.MaViTriKho)}
                    >
                      {record.MaViTriKho}
                    </div>
                  );
                },
                width: 20,
              },
            ],
          }
        ]

      };
    });
    return [
      {
        title: <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '16px' }}>
          Dãy {keyPrefix}
        </div>,
        children: columns
      },
    ];
  };

  // Tạo các cột
  const columns_A = generateColumn('A');
  const columns_B = generateColumn('B');
  const columns_C = generateColumn('C');
  const columns_D = generateColumn('D');
  const columns_E = generateColumn('E');
  const columns_F = generateColumn('F');
  const columns_G = generateColumn('G');
  const columns_H = generateColumn('H');
  const columns_I = generateColumn('I');
  const columns_J = generateColumn('J');
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
      stroke: {
        show: true,  // Hiển thị viền
        width: 0.5,
        colors: ['#000'], // Màu viền đen
      },
      labels: labels,
      colors: ['#fff', '#3ca63cc4', '#fcff4dc4', '#db3d3dcc'],
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
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className="mb-24"
        >
          <Card bordered={false} className="criclebox "
          // style={{ position: 'relative', top: 10, left: '30%', position: 'fixed', zIndex: 2 }}
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
          <Card bordered={false} className="criclebox ">
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

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={12} className="mb-24" style={{ marginTop: 12, marginBottom: 12 }}>
          <Card bordered={false} className="criclebox h-full" style={{ height: 200, width: 300, backgroundColor: '#c8c8c8' }}>
            <ReactApexChart options={config.options} series={config.series} type="pie" width={280} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={19} className="mb-24">
          <Card bordered={false} className="criclebox h-full" style={{
            // transform: "scale(0.3)",
            transform: `scale(${100 / scale}%) `,
            // transformOrigin: 'top center',
            transformOrigin: 'top left',
            width: `${120 * scale}%`, overflow: 'hidden'
          }}>
            <div className="linechart">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Title level={1}>SƠ ĐỒ KHO</Title>
              </div>
              <div className="sales">
              </div>
            </div>
            <div className="Layout_Kho" style={{ width: '100%', flexGrow: 1, marginTop: 10 }}>
              <TransformWrapper >
                <TransformComponent >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
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
                        display: 'inline-block', transform: 'rotate(-180deg)',
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
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns_C}
                          bordered
                          dataSource={result_C}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns_D}
                          bordered
                          dataSource={result_D}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns_E}
                          bordered
                          dataSource={result_E}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns_F}
                          bordered
                          dataSource={result_F}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns_G}
                          bordered
                          dataSource={result_G}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns_H}
                          bordered
                          dataSource={result_H}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns_I}
                          bordered
                          dataSource={result_I}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 30
                      }}
                        ref={tableRef}>
                        <Table
                          className='duy'
                          columns={columns_J}
                          bordered
                          dataSource={result_J}
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
                        dataSource={DataMaVT}
                        pagination={false}
                      // size="middle"
                      />
                    </Modal>
                  </div>
                </TransformComponent>
              </TransformWrapper >
            </div>
          </Card>
        </Col>

      </Row >
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
            <div style={{ maxHeight: window.innerHeight - 80, overflowY: 'auto' }}>
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

    </>
  );
}

export default KhoK3;
