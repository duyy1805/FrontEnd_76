/*!
  Tỷ lệ phần trăm của dòng chủng loại(túi lều theo khách hàng)
  Tổng chủng loại chia tổng số lương

  -báo cáo 2: tỷ lệ chậm luân chuyển 
  Sau bao lâu thì hàng đó phải xuất đi, sau 6 tháng, 
  cảnh báo hàng chậm luân chuyển, các mã 
  Tỷ lệ hàng để sai vị trí
  
  kho nhựa mới khu A
  kho nguyên liệu anh Hoà

  trước 30/11
  tiêu đề báo cáo

  =========================================================
  
*/
import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from "react-apexcharts";
import {
  Typography, Table,
  Tooltip, Modal, Row, Col,
  Card, Input, Button, Select,
  List, Breadcrumb, notification, Carousel, Statistic
} from "antd";
import {
  SearchOutlined, AppstoreOutlined, BankOutlined,
  FullscreenOutlined, FullscreenExitOutlined,
} from "@ant-design/icons";
import { PiTent, PiBackpackLight, PiBag } from "react-icons/pi";
import axios from 'axios';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../../assets/styles/Style.css"
import ApexCharts from 'apexcharts'
import apiConfig from '../../../src/apiConfig.json'
import { NavLink, Link, useLocation } from "react-router-dom";
import filePath from '../../assets/code.xlsx';
import { saveAs } from 'file-saver';

const XLSX = require('xlsx');


// const arr_for =
//   ['A209', 'A210', 'A211', 'A212', 'A311', 'A411', 'A511', 'A611',
//     'A312', 'A412', 'A512', 'A612', 'A216', 'A316', 'A416',
//     'A516', 'A616', 'A215', 'A315', 'A415', 'A515', 'A615', 'A220',
//     'A219', 'A519', 'A520', 'A619', 'A620', 'A141', 'A142', 'A144',
//     'A241', 'A242', 'A243', 'A244', 'A341', 'A342', 'A343', 'A344',
//     'A441', 'A442', 'A443', 'A444', 'A541', 'A542', 'A543', 'A544',
//     'A641', 'A642', 'A643', 'A644', 'G129', 'G229', 'G329', 'G429',
//     'G529', 'G629', 'G130', 'G230', 'G330', 'G430', 'G530', 'G630',
//     'G341', 'G441', 'G541', 'G543', 'G259', 'G260', 'G359', 'G360',
//     'G559', 'G469', 'G569', 'G669', 'G470', 'G570', 'G670', 'G171',
//     'G271', 'G371', 'G471', 'G571', 'G671', 'G172', 'G272', 'G372',
//     'G472', 'G572', 'G672', 'G173', 'G273', 'G373', 'G473', 'G573',
//     'G673', 'G174', 'G274', 'G374', 'G474', 'G574', 'G674', 'G175',
//     'G275', 'G375', 'F173', 'F375', 'F461', 'F462', 'F463', 'F464',
//     'F561', 'F562', 'F563', 'F564', 'F661', 'F642', 'F643', 'F644',
//     'F164', 'F159', 'F149', 'F151', 'F152', 'F251',
//     'F252', 'F351', 'F352', 'F247', 'F248', 'F347', 'F348', 'F445',
//     'F446', 'F545', 'F546', 'F547', 'F548', 'F645', 'F646', 'F143',
//     'F243', 'F343', 'F443', 'F241', 'F123', 'F117', 'F118', 'F119',
//     'F219', 'F319', 'F419', 'F519', 'F220', 'F320', 'F420', 'F520',
//     'F307', 'F101', 'F102', 'F201', 'F202', 'A137', 'A138', 'A139',
//     'A140', 'A237', 'A238', 'A239', 'A240', 'A337', 'A338', 'A339',
//     'A340', 'B137', 'B138', 'B139', 'B140', 'B237', 'B238', 'B239',
//     'B240', 'B337', 'B338', 'B339', 'B340', 'C137', 'C138',
//     'C139', 'C140', 'C237', 'C238', 'C239', 'C240', 'C337', 'C338',
//     'C339', 'C340', 'D137', 'D138', 'D139', 'D140', 'D237', 'D238',
//     'D239', 'D240', 'D337', 'D338', 'D339', 'D340', 'E137', 'E138',
//     'E139', 'E140', 'E237', 'E238', 'E239', 'E240', 'E337', 'E338',
//     'E339', 'E340', 'F137', 'F138', 'F139', 'F140', 'F237', 'F238',
//     'F239', 'F240', 'F337', 'F338', 'F339', 'F340', 'G137', 'G138',
//     'G139', 'G140', 'G237', 'G238', 'G239', 'G240', 'G337', 'G338',
//     'G339', 'G340', 'H137', 'H138', 'H139', 'H140', 'H237', 'H238',
//     'H239', 'H240', 'H337', 'H338', 'H339', 'H340', 'I137',
//     'I138', 'I139', 'I140', 'I237', 'I238', 'I239', 'I240', 'I337',
//     'I338', 'I339', 'I340', 'J137', 'J138', 'J139', 'J140', 'J237',
//     'J238', 'J239', 'J240', 'J337', 'J338', 'J339',
//     "H101", "H102", 'H503', 'H603', 'H604',
//     'H107', 'H108', 'H207', 'H208', 'H308', 'H408', 'H508', 'H608', 'H309', 'H310', 'H409', 'H410', 'H509', 'H510', 'H609', 'H610',
//     'H211', 'H311', 'H312', 'H412', 'H511', 'H611', 'H213', 'H214', 'H313', 'H413', 'H414', 'H115', 'H215', 'H216', 'H315', 'H117', 'H118',
//     'H217', 'H218', 'H318', 'H418', 'H518', 'H618',
//     'H121', 'H122', 'H221', 'H222', 'H321', 'H322', 'H421', 'H422', 'H521', 'H522', 'H621', 'H622',
//     'H123', 'H124', 'H423', 'H424', 'H523', 'H524', 'H623', 'H624',
//     'H133', 'H134', 'H233', 'H234', 'H333', 'H334', 'H135', 'H136', 'H235', 'H236', 'H335', 'H336',
//     'G133', 'G134', 'G233', 'G234', 'G333', 'G334', 'G135', 'G136', 'G235', 'G236', 'G335', 'G336',
//     'F133', 'F134', 'F233', 'F234', 'F333', 'F334', 'F135', 'F136', 'F235', 'F236', 'F335', 'F336',
//     'E133', 'E134', 'E233', 'E234', 'E333', 'E334', 'E135', 'E136', 'E235', 'E236', 'E335', 'E336',
//     'D133', 'D134', 'D233', 'D234', 'D333', 'D334', 'D135', 'D136', 'D235', 'D236', 'D335', 'D336',
//     'C133', 'C134', 'C233', 'C234', 'C333', 'C334', 'C135', 'C136', 'C235', 'C236', 'C335', 'C336',
//     'B133', 'B134', 'B233', 'B234', 'B333', 'B334', 'B135', 'B136', 'B235', 'B236', 'B335', 'B336',
//     'A133', 'A134', 'A233', 'A234', 'A333', 'A334', 'A135', 'A136', 'A235', 'A236', 'A335', 'A336',
//     'H220', 'H230', 'H329', 'H330', 'H429', 'H430', 'H529',
//     'H431', 'H632',
//     'H145', 'H146', 'H245', 'H246', 'H345', 'H346', 'H445', 'H446', 'H545', 'H546', 'H645', 'H646',
//     'H151', 'H565', 'H566', 'H665', 'H666',
//     'H267', 'H268',
//     'H169', 'H170', 'H269', 'H270', 'H369', 'H370', 'H469', 'H470', 'H569', 'H570', 'H669', 'H670',
//     'H571', 'H572',
//     'H273', 'H274', 'H373', 'H374', 'H473', 'H474', 'H573', 'H574', 'H673', 'H674',
//     'H175', 'H176', 'H275', 'H375', 'H376', 'H475', 'H476', 'H575', 'H576', 'H675', 'H676',
//     'H279', 'H379', 'H380', 'H479', 'H480',
//     'F101', 'F102', 'F201', 'F202', 'F105', 'F507', 'F508',
//     'F117', 'F118', 'F119', 'F219', 'F220', 'F319', 'F320', 'F419',
//     'F420', 'F519', 'F520',
//     'F420', 'F519', 'F520',
//     'F521', 'F123', 'F124', 'F423', 'F424', 'F523', 'F524',
//     'G129', 'G130', 'G229', 'G230', 'G329', 'G330', 'G429', 'G430', 'G529', 'H530', 'G629', 'G630',
//     'J340']
//Gọi API layout kho
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
  {
    title: 'Tuổi tồn',
    dataIndex: 'tuoiTonBTP',
    key: '',
    align: 'center',
  },
];

const colorsArray = generateColors(50);

//Fucntion ở đây
const KhoK3 = (props) => {
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
  const [inputCcCode, setInputCcCode] = useState("");
  const [viTri, setViTri] = useState([]);
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
  const [wb, setWb] = useState([])

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

  const exportToExcel = (data) => {
    // Lọc các vị trí có PhanTram > 100
    const danhSach = data.filter(item => item.PhanTram > 100);

    // Tạo danh sách dòng: mỗi sản phẩm là một dòng, gồm vị trí và tên sản phẩm
    const rows = [];

    danhSach.forEach(item => {
      item.ItemCode.forEach(code => {
        rows.push({
          ViTri: item.MaViTriKho,
          TenSanPham: code.Ten_SanPham,
          MaDonHang: code.Ma_DonHang,
          Ton: code.Ton,
        });
      });
    });

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SanPhamVuot100");

    // Xuất file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileName = "SanPham_ViTri_GT100.xlsx";
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, fileName);
  };

  const updateHeight = () => {
    setHeight(window.innerHeight);
  };

  const handleFindByCcCode = () => {
    // Lọc các dòng phù hợp với Ten_SanPham
    const matchedProduct = wb.find((item) => String(item.ccCode) === String(inputCcCode));
    if (!matchedProduct) return; // Không tìm thấy sản phẩm tương ứng

    const value = matchedProduct.modelName
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
    const mavitri = Object.values(matchedRows).map(item => ({
      maViTriKho: item.MaViTriKho
    }));
    setViTri(mavitri)

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

  const handleInputCcCodeChange = (e) => {
    setInputCcCode(e.target.value);
  };
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
    if (pathname === "/KhoK3") {
      // document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto"; // Hoặc giá trị mặc định
    }
    fetch(filePath)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Loại bỏ dòng header (dòng đầu tiên) và các dòng trống, chỉ lấy 2 cột đầu
        const filteredData = jsonData
          .slice(1) // Bỏ dòng đầu tiên (header)
          .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== "")) // Loại bỏ dòng trống
          .map((row) => row.slice(0, 2)); // Lấy 2 cột đầu tiên
        const processedData = filteredData.map(([ccCode, modelName]) => ({
          ccCode,
          modelName,
        }));
        setWb(processedData);
      })
      .catch((error) => console.error("Lỗi khi đọc file:", error));

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
          const tuoi = Math.floor((today - ngayNhap) / (1000 * 60 * 60 * 24));
          return tuoi > 180 ? 170 : tuoi;
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
        const danhSachViTriVuot100 = finalGroupedData.filter(item => item.PhanTram > 100);

        // Tạo danh sách nhóm theo vị trí
        const viTriVaSanPham = danhSachViTriVuot100.map(item => {
          return {
            viTri: item.MaViTriKho,
            sanPham: item.ItemCode.map(code => code.Ten_SanPham)
          };
        });
        console.log(finalGroupedData)
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

  const vitrikhocohang = data.filter(item => item.PhanTram !== 0).length;
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
  const countGreaterThan100 = data.length - countLessThan100 - countGreaterThan0 - countEqual0;

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
  function classifyProduct(optionsSelect) {
    const label = optionsSelect.label.toLowerCase();

    if (
      label.includes('tent') ||
      label.includes('shelter') ||
      label.includes('awning') ||
      label.includes('flysheet') ||
      label.includes('base arpenaz') ||
      (label.includes('mh100') && !label.includes('backpack'))
    ) {
      return 'Tent';
    }
    // Điều kiện BackPack: nếu chứa từ khóa backpack, bp, backpac
    else if (
      label.includes('backpack') ||
      label.includes('bp ') ||
      label.includes('backpac')
    ) {
      return 'BackPack';
    }
    // Điều kiện Balo: nếu chứa từ khóa bag, bumbag, duffel, sac, shoe bag, organizer, store bag, grooming bag
    else if (
      label.includes('bag') ||
      label.includes('bumbag') ||
      label.includes('duffel') ||
      label.includes('sac') ||
      label.includes('shoe bag') ||
      label.includes('organizer') ||
      label.includes('store bag') ||
      label.includes('grooming bag')
    ) {
      return 'Bag';
    }
    // Các sản phẩm còn lại
    else {
      return 'Other';
    }
  }

  const categoryOrder = ["Tent", "Bag", "BackPack"];

  const productStockMap = {};

  data.forEach((item) => {
    item.ItemCode?.forEach((code) => {
      if (code.Ten_SanPham && !productStockMap[code.Ten_SanPham]) {
        productStockMap[code.Ten_SanPham] = code.TongTon || 0; // Lấy giá trị TongTon duy nhất
      }
    });
  });

  // Bước 2: Gom nhóm sản phẩm theo loại Tent, BackPack, Bag
  const categoryCounts = Object.entries(productStockMap).reduce((acc, [productName, totalStock]) => {
    const category = classifyProduct({ label: productName });

    if (!acc[category]) {
      acc[category] = { count: 0, totalStock: 0 };
    }

    acc[category].count += 1;  // Đếm số loại sản phẩm
    acc[category].totalStock += totalStock; // Cộng tổng tồn từ bảng đã lọc

    return acc;
  }, {});

  console.log(categoryCounts)

  const sortedCategoryCounts = Object.fromEntries(
    categoryOrder
      .map((key) => [key, categoryCounts[key] || 0]) // Đảm bảo đủ tất cả loại, nếu không có thì gán 0
  );


  // Khởi tạo biến đếm tồn cho từng loại và từng mốc thời gian
  const categoryTotals = {};
  const usedCapacity = data.reduce((sum, item) => sum + Math.min(item.PhanTram, 100), 0);
  // Duyệt qua dữ liệu và phân loại tồn theo mốc thời gian
  const seenProducts = new Set();

  data.forEach(item => {
    item.ItemCode?.forEach(code => {
      const productName = code?.Ten_SanPham || "";
      const ton = code?.TongTon || 0;
      let age = code?.tuoiTonBTP || 0;

      if (!productName) return; // Bỏ qua nếu không có tên sản phẩm

      // Nếu đã tính sản phẩm này rồi thì bỏ qua
      if (seenProducts.has(productName)) {
        return;
      }
      seenProducts.add(productName); // Đánh dấu đã duyệt

      // Xử lý tuổi tồn
      if (age > 180) age = 170;

      const category = classifyProduct({ label: productName });
      if (category === "Other") return;

      if (!categoryTotals[category]) {
        categoryTotals[category] = { total: 0, range0_30: 0, range30_90: 0, range90_180: 0 };
      }

      categoryTotals[category].total += ton;
      if (age >= 0 && age < 30) categoryTotals[category].range0_30 += ton;
      else if (age >= 30 && age < 90) categoryTotals[category].range30_90 += ton;
      else categoryTotals[category].range90_180 += ton;
    });
  });


  // Tính tỷ lệ tồn theo từng khoảng thời gian
  const getPercentage = (part, total) => total > 0 ? ((part / total) * 100).toFixed(2) : 0;
  Object.keys(categoryTotals).forEach(category => {
  });

  const categoryData = Object.entries(categoryTotals).map(([category, data]) => ({
    category,
    total: data.total,
    range0_30: data.range0_30,
    range30_90: data.range30_90,
    range90_180: data.range90_180,
  }));

  const categoryIcons = {
    Tent: <PiTent />,
    BackPack: <PiBackpackLight />,
    Bag: <PiBag />,
    Other: <AppstoreOutlined />,
  };


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
  const result_A_1 = result_A.slice(0, 20);
  const result_A_2 = result_A.slice(20, 40);
  const result_B = createResult(data_B, 'B');
  const result_B_1 = result_B.slice(0, 20);
  const result_B_2 = result_B.slice(20, 40);
  const result_C = createResult(data_C, 'C');
  const result_C_1 = result_C.slice(0, 20);
  const result_C_2 = result_C.slice(20, 40);
  const result_D = createResult(data_D, 'D');
  const result_D_1 = result_D.slice(0, 20);
  const result_D_2 = result_D.slice(20, 40);
  const result_E = createResult(data_E, 'E');
  const result_E_1 = result_E.slice(0, 20);
  const result_E_2 = result_E.slice(20, 40);
  const result_F = createResult(data_F, 'F');
  const result_F_1 = result_F.slice(0, 20);
  const result_F_2 = result_F.slice(20, 40);
  const result_G = createResult(data_G, 'G');
  const result_G_1 = result_G.slice(0, 20);
  const result_G_2 = result_G.slice(20, 40);
  const result_H = createResult(data_H, 'H');
  const result_H_1 = result_H.slice(0, 20);
  const result_H_2 = result_H.slice(20, 40);
  const result_I = createResult(data_I, 'I');
  const result_J = createResult(data_J, 'J');

  //========================================
  const generateColumn = (keyPrefix) => {
    const columns = Array.from({ length: 6 }, (_, index) => {
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
                title: null,
                dataIndex: ['values', (index) * 2],
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
                  // const isInArrFor = arr_for.includes(record.MaViTriKho);
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
                    (item) => (item.Ten_SanPham === selectedProduct || (item.Ten_SanPham === inputCcCode && inputCcCode !== ''))
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
                dataIndex: ['values', index * 2 + 1],
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
      title: {
        text: 'Báo cáo đầy kho',
        align: 'center', // can be 'left', 'center', or 'right'
        margin: 10,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#FFFFFF'
        }
      },
      labels: labels,
      colors: ['#ffffff', '#008000', '#FFD700', '#B22222'],
      legend: {
        fontSize: '10px',
        labels: {
          colors: '#FFFFFF', // ⚡ Đổi màu chữ legend
        },
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
              Kho kinh tế - quốc phòng
            </Breadcrumb.Item>
          </Breadcrumb>
          {/* <Button type="primary" onClick={() => exportToExcel(data)}>
            Xuất Excel vượt 100%
          </Button> */}
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize", userSelect: 'none', }}
            >
              Kho kinh tế - quốc phòng
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
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="search_by"
                style={{ marginBottom: -25 }}
              >
                <Row align="middle" justify="space-around" gutter={[24, 0]}>
                  <Col xs={16}>
                    <Input
                      type="text"
                      placeholder="CONCEPTION NAME"
                      value={inputCcCode}
                      onChange={(e) => handleInputCcCodeChange(e)}
                      prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                      style={{ borderRadius: '6px' }}
                    />
                  </Col>
                  <Col xs={8}>
                    <Button type="primary" onClick={handleFindByCcCode} >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={10}
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
                  <Col xs={4}>
                    <Button type="primary" onClick={handleSubmit} >
                      Search
                    </Button>
                  </Col>
                  <Col xs={4}>
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
            {/* <Button onClick={toggleColumn}>
              {showTuoiTon ? "Hide" : "Show"}
            </Button> */}
          </Row>
        )
      }
      {
        isDivVisible && (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24" style={{ marginTop: 12, marginBottom: 12, marginRight: 10 }}>
              <Carousel autoplay autoplaySpeed={10000}>
                <div>
                  <Row gutter={[24, 0]}>
                    <Col span={6}>
                      <Card
                        style={{ backgroundColor: '#01748f' }} // Màu nền xanh nhạt hơn
                        headStyle={{ borderBottom: 'none' }}
                        bodyStyle={{ paddingTop: '0', paddingBottom: '0', height: 150 }}
                      >
                        <Statistic
                          title={<span style={{ color: '#FFFFFF' }}>TOTAL WAREHOUSE CAPACITY</span>}
                          value={"11,900"} suffix=" m³"
                          prefix={<BankOutlined style={{ color: '#FFFFFF' }} />}
                          valueStyle={{ color: '#FFFFFF', fontSize: '20px' }}
                        />
                        <div style={{ fontSize: '10px', color: '#FFFFFF' }}>TỔNG SỨC CHỨA KHO</div>
                        <Statistic
                          value={(usedCapacity * 2.7 / 100).toFixed(0)} suffix=" m³"
                          prefix={<BankOutlined style={{ color: '#FFFFFF' }} />} // hoặc dùng icon khác nếu muốn
                          valueStyle={{ color: '#FFFFFF', fontSize: '20px' }}
                        />
                        <div style={{ fontSize: '10px', color: '#FFFFFF' }}>TỔNG ĐÃ SỬ DỤNG</div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        style={{ backgroundColor: '#01748f' }} // Màu nền xanh nhạt hơn
                        headStyle={{ borderBottom: 'none' }}
                        bodyStyle={{ paddingTop: '0', paddingBottom: '0', height: 150 }}
                      >
                        <Statistic
                          title={<span style={{ color: '#FFFFFF' }}>TOTAL WAREHOUSE AREA</span>}
                          value={"3,400"} suffix=" m²"
                          prefix={<FullscreenExitOutlined style={{ color: '#FFFFFF' }} />}
                          valueStyle={{ color: '#FFFFFF', fontSize: '20px' }}
                        />
                        <div style={{ fontSize: '10px', color: '#FFFFFF' }}>TỔNG DIỆN TÍCH KHO</div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        style={{ backgroundColor: '#01748f' }} // Màu nền xanh nhạt hơn
                        headStyle={{ borderBottom: 'none' }}
                        bodyStyle={{ paddingTop: '0', paddingBottom: '0', height: 150 }}
                      >
                        <Statistic
                          title={<span style={{ color: '#FFFFFF' }}>TOTAL RACK POSITION</span>}
                          value={"4,560"} suffix=" slot"
                          prefix={<AppstoreOutlined style={{ color: '#FFFFFF' }} />}
                          valueStyle={{ color: '#FFFFFF', fontSize: '20px' }}
                        />
                        <div style={{ fontSize: '10px', color: '#FFFFFF' }}>Số vị trí giá kệ</div>
                        <Statistic
                          value={vitrikhocohang} suffix=" slot"
                          prefix={<AppstoreOutlined style={{ color: '#FFFFFF' }} />}
                          valueStyle={{ color: '#FFFFFF', fontSize: '20px' }}
                        />
                        <div style={{ fontSize: '10px', color: '#FFFFFF' }}>Số vị trí đã sử dụng</div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        style={{
                          backgroundColor: "#01748f",
                          color: "#FFFFFF",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: 150,
                        }}
                        headStyle={{ borderBottom: "none" }}
                      >
                        <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: 10 }}>
                          PRODUCT CATEGORIES
                        </div>
                        <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
                          {Object.entries(sortedCategoryCounts).map(([key, value]) => (
                            <div key={key} style={{ color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                              {categoryIcons[key] || <AppstoreOutlined />} <strong>{key}:</strong>{value.count} products | {value.totalStock} items
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row gutter={[24, 0]}>
                    {categoryData.map(({ category, total, range0_30, range30_90, range90_180 }) => (
                      <Col key={category} span={6}>
                        <Card
                          style={{
                            backgroundColor: "#01748f",
                            color: "#FFFFFF",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 150,
                            borderRadius: 10,
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                          }}
                          headStyle={{ borderBottom: "none" }}
                        >
                          <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: 10 }}>
                            {categoryIcons[category] || <AppstoreOutlined />} {category} - {total} items
                          </div>
                          <div style={{ fontSize: "14px", lineHeight: "1.6", width: "200px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <strong>0-30 days: </strong> <span> {range0_30} ~ {((range0_30 / total) * 100).toFixed(2)}%</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <strong>30-90 days: </strong> <span> {range30_90} ~ {((range30_90 / total) * 100).toFixed(2)}%</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <strong>90-180 days: </strong> <span> {range90_180} ~ {((range90_180 / total) * 100).toFixed(2)}%</span>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div>
                  <Row gutter={[24, 0]}>
                    <Col span={6}>
                      <Card bordered={false} className="criclebox h-full" style={{ height: 160, width: 320, backgroundColor: '#01748f' }}>
                        <ReactApexChart options={config.options} series={config.series} type="pie" width={300} height={150} />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Carousel>
            </Col>
            {/* <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24" style={{ marginTop: 12, marginBottom: 12 }}>
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
            </Col> */}
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24" >
              <div className="linechart" style={{ display: 'flex', justifyContent: 'center', userSelect: 'none', marginTop: -10 }}>
                <div >
                  <Title level={3}>SƠ ĐỒ KHO KINH TẾ - QUỐC PHÒNG (K3)</Title>
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
                  transform: `scale(${90 / scale_}%) `,
                  transformOrigin: 'top center',
                }}>
                  <div className="Layout_Kho" style={{ width: '100%', flexGrow: 1, marginTop: 0 }}>
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
                              display: 'inline-block',
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
                            <div style={{
                              display: 'inline-block', transform: 'rotate(-180deg)',
                              marginRight: 10
                            }}
                            >
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
                              marginRight: 10
                            }}
                            >
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
                              marginRight: 10
                            }}
                            >
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
                              marginRight: 10
                            }}
                            >
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
                              marginRight: 10
                            }}
                            >
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
                              marginRight: 10
                            }}
                            >
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
                              marginRight: 10
                            }}
                            >
                              <Table
                                columns={columns_H}
                                bordered
                                dataSource={result_H}
                                pagination={false}
                                rowKey="key"
                              />
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'end',
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
                              />
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'end',
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
                              />
                            </div>
                          </div>
                          <Modal
                            title={`Mã vị trí kho: ${selectedMaViTriKho || 'N/A'}`}
                            open={isModalVisible}
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
                  <Title >SƠ ĐỒ KHO KINH TẾ - QUỐC PHÒNG (K3)</Title>
                </div>
              </div>
              <div bordered={false} className="criclebox h-full" style={{
                display: 'flex', justifyContent: 'center',
                marginLeft: -270,
                height: height * 0.99,
                overflow: 'hidden',
              }}>
                <div style={{
                  transform: `scale(${100 / scale}%) `,
                  transformOrigin: 'top center',
                }}>
                  <div className="Layout_Kho" style={{ width: '100%', flexGrow: 1, marginTop: 10 }}>
                    <TransformWrapper
                      wheel={{
                        step: 0.05, // Tốc độ zoom
                        activationKeys: [], // Không yêu cầu phím bổ sung để zoom
                        disabled: false, // Kích hoạt thu phóng bằng chuột
                        wheelZoomPosition: "mouse", // Thu phóng theo vị trí chuột
                      }}
                      zoomAnimation={{
                        animationType: "easeOut", // Loại hoạt ảnh
                        animationTime: 100, // Thời gian hoạt ảnh (ms)
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
                            top: 18,
                            left: 950
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
                            top: 18,
                            left: 430
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
                            left: 950
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
                            left: 970
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
                            top: 500,
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
                            top: 116,
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
                            top: 116,
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
                            top: 500,
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
                                  columns={columns_A}
                                  bordered
                                  dataSource={result_A_1}
                                  pagination={false}
                                  rowKey="key"
                                  scroll={{
                                    x: 'max-content',
                                  }}
                                />
                                <Table
                                  columns={columns_A}
                                  bordered
                                  dataSource={result_A_2}
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
                                  columns={columns_B}
                                  bordered
                                  dataSource={result_B_1}
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
                                  columns={columns_B}
                                  bordered
                                  dataSource={result_B_2}
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
                                  columns={columns_C}
                                  bordered
                                  dataSource={result_C_1}
                                  pagination={false}
                                  rowKey="key"
                                />
                                <Table
                                  columns={columns_C}
                                  bordered
                                  dataSource={result_C_2}
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
                                  columns={columns_D}
                                  bordered
                                  dataSource={result_D_1}
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
                                  columns={columns_D}
                                  bordered
                                  dataSource={result_D_2}
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
                                  columns={columns_E}
                                  bordered
                                  dataSource={result_E_1}
                                  pagination={false}
                                  rowKey="key"
                                />
                                <Table
                                  columns={columns_E}
                                  bordered
                                  dataSource={result_E_2}
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
                                  columns={columns_F}
                                  bordered
                                  dataSource={result_F_1}
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
                                  columns={columns_F}
                                  bordered
                                  dataSource={result_F_2}
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
                                  columns={columns_G}
                                  bordered
                                  dataSource={result_G_1}
                                  pagination={false}
                                  rowKey="key"
                                />
                                <Table
                                  columns={columns_G}
                                  bordered
                                  dataSource={result_G_2}
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
                                  columns={columns_H}
                                  bordered
                                  dataSource={result_H_1}
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
                                  columns={columns_H}
                                  bordered
                                  dataSource={result_H_2}
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

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <div style={{
                                    transform: 'rotate(-180deg)',
                                    background: '#FFFFFF'
                                  }}
                                  >
                                    <Table
                                      columns={columns_I}
                                      bordered
                                      dataSource={result_I}
                                      pagination={false}
                                      rowKey="key"
                                    />
                                  </div>
                                  <div style={{
                                    transform: 'rotate(-180deg)',
                                    background: '#FFFFFF'
                                  }}
                                  >
                                    <Table
                                      columns={columns_J}
                                      bordered
                                      dataSource={result_J}
                                      pagination={false}
                                      rowKey="key"
                                    />
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
                                </div>
                                <Card
                                  style={{
                                    height: 120,
                                    width: 240,
                                    marginTop: 110,
                                    display: "flex", // Sử dụng flexbox để căn giữa
                                    justifyContent: "center", // Căn giữa ngang
                                  }}
                                >
                                  <h1
                                    style={{
                                      paddingTop: 30,
                                      paddingBottom: 30,
                                      fontSize: "14px", // Kích thước chữ
                                      fontWeight: "bold", // Chữ đậm
                                      marginTop: -110, // Loại bỏ margin mặc định
                                      textAlign: "center", // Căn giữa văn bản
                                      backgroundColor: "green",
                                      color: "#ffffff",
                                    }}
                                  >
                                    KHU VỰC TẬP KẾT <br />HÀNG ĐÓNG CONT
                                  </h1>
                                  <div
                                    style={{
                                      height: 100,
                                      width: 200,
                                      // marginBottom: 150,
                                      backgroundColor: "green",
                                      padding: "10px",
                                      // padding: "20px 80px 20px 80px"
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "14px", // Kích thước chữ
                                        fontWeight: "bold", // Chữ đậm
                                        margin: 10, // Loại bỏ margin mặc định
                                        marginTop: 10,
                                        textAlign: "center", // Căn giữa văn bản
                                        background: '#ffffff',
                                        color: "#000000",
                                      }}
                                    >
                                      KHU VỰC CHẠY <br />MÁY RFID
                                    </div>
                                  </div>
                                </Card>
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
                            <Modal
                              title={`Mã vị trí kho: ${selectedMaViTriKho || 'N/A'}`}
                              open={isModalVisible}
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
              </div>
            </Col>
          </Row >
        )
      }
    </>
  );
}

export default KhoK3;
