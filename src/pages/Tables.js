import {
  Row, Tooltip,
  Col, Modal,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar, Breadcrumb,
  Typography,
  Layout, Image,
  Menu,
  Form,
  Input,
  Switch,
} from "antd";

import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from 'moment';
// Images
import "../assets/styles/Style.css"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import apiConfig from '../../src/apiConfig.json'
const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const template = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
      className="fill-muted"
    ></path>
    <path
      d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
      className="fill-muted"
    ></path>
    <path
      d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
      className="fill-muted"
    ></path>
  </svg>
);

const profile = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill-muted"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
      fill="#111827"
    ></path>
  </svg>
);

const signup = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z"
      fill="#111827"
    ></path>
  </svg>
);

const signin = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
  >
    <path
      className="fill-muted"
      d="M12.25,14H1.75A1.752,1.752,0,0,1,0,12.25V3.5A1.752,1.752,0,0,1,1.75,1.75h.876V.875a.875.875,0,0,1,1.75,0V1.75h5.25V.875a.875.875,0,0,1,1.75,0V1.75h.875A1.752,1.752,0,0,1,14,3.5v8.75A1.752,1.752,0,0,1,12.25,14ZM3.5,4.375a.875.875,0,0,0,0,1.75h7a.875.875,0,0,0,0-1.75Z"
    />
  </svg>
);

const callAPIDanhSachChuaDatHang = async () => {
  try {

    const response = await axios.post(
      `${apiConfig.API_BASE_URL}/muahang/all`,
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

const callAPIDanhSachVatTu = async (idDonHang) => {
  try {

    const response = await axios.post(
      `${apiConfig.API_BASE_URL}/muahang/allbyvt/${idDonHang}`,
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
function Tables() {

  //state
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idDonHang, setIdDonHang] = useState('');
  const [danhSachVatTu, setDanhSachVatTu] = useState([]);

  const handleClick = async (record) => {
    const response = await callAPIDanhSachVatTu(record.idDonHang);
    console.log(response)
    const filteredData = response.data.filter(item => item.nhuCauVatTu !== 0);
    await setDanhSachVatTu(filteredData)
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callAPIDanhSachChuaDatHang();
        const data = response.data
        const sortedData = data.sort((a, b) => new Date(a.ngayDongBo) - new Date(b.ngayDongBo));
        setData(sortedData)
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
    fetchData();

  }, []);

  const createFilters = (key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]))];
    return uniqueValues.map((value) => ({
      text: value,
      value,
    }));
  };

  // Tạo bộ lọc
  const customerFilters = createFilters('tenKhachHang');
  const productTypeFilters = createFilters('tenChungLoaiSanPham');
  const orderTypeFilters = createFilters('tenLoaiDonHang');
  const staffFilters = createFilters('tenDayDu');
  const orderCodeFilter = createFilters('maDonHang');

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: '5%',
      render: (text, record, index) => index + 1, // Hiển thị số thứ tự dựa trên index
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      filters: orderCodeFilter,
      filterSearch: true,
      onFilter: (value, record) => record.maDonHang.includes(value),
      ellipsis: { showTitle: false },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
    },
    {
      title: 'Ngày Đồng Bộ',
      dataIndex: 'ngayDongBo',
      key: 'ngayDongBo',
      align: 'center',
      render: (text) => <Tooltip placement="topLeft" title={moment(text).format('DD-MM-YYYY')}>{moment(text).format('DD-MM-YYYY')}</Tooltip>,
    },
    {
      title: 'Ngày Lập',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      align: 'center',
      render: (text) => <Tooltip placement="topLeft" title={moment(text).format('DD-MM-YYYY, HH:mm')}>{moment(text).format('DD-MM-YYYY')}</Tooltip>,
    },
    {
      title: 'Số Lượng',
      dataIndex: 'soLuongSanPham',
      key: 'soLuongSanPham',
      width: "10%",
    },
    {
      title: 'Người mở đơn',
      dataIndex: 'tenDayDu',
      key: 'tenDayDu',
      filters: staffFilters,
      onFilter: (value, record) => record.tenDayDu === value,
      ellipsis: { showTitle: false },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'tenKhachHang',
      key: 'tenKhachHang',
      filters: customerFilters,
      onFilter: (value, record) => record.tenKhachHang === value,
    },
  ];


  const columnsDSVT = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: '5%',
      render: (text, record, index) => index + 1, // Hiển thị số thứ tự dựa trên index
    },
    {
      title: 'Chủng Loại Vật Tư',
      dataIndex: 'tenChungLoaiVatTu',
      key: 'tenChungLoaiVatTu',
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
      width: "15%"
    },
    {
      title: 'Mã Vật Tư',
      dataIndex: 'maVatTu',
      key: 'maVatTu',
      align: 'center',
      width: "10%"
    },
    {
      title: 'Quy Cách',
      dataIndex: 'quyCach',
      key: 'quyCach',
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
      title: 'Cấp Cho',
      dataIndex: 'capCho',
      key: 'capCho',
      width: "10%"
    },
    {
      title: 'Nhu Cầu Vật Tư',
      dataIndex: 'nhuCauVatTu',
      key: 'nhuCauVatTu',
      align: 'center',
      width: "12%",
      render: (text) => text.toLocaleString(), // Hiển thị định dạng số nếu cần
    },
    {
      title: 'Đơn Vị Tính',
      dataIndex: 'tenDonViTinh',
      key: 'tenDonViTinh',
      align: 'center',
      width: "10%"
    },
    {
      title: 'Nhà Cung Cấp',
      dataIndex: 'tenNhaCungCap',
      key: 'tenNhaCungCap',
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
  ];

  const items = [
    {
      key: "1",
      label: (
        <Link to="/">
          {template}
          <span> Layout kho</span>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/Uniform">
          {profile}
          <span> Nhân sự</span>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link to="/DanhSachChuaDatHang">
          {signup}
          <span> Danh sách chưa đặt hàng</span>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link to="/sign-in">
          {signin}
          <span> Sign In</span>
        </Link>
      ),
    },
  ];
  //
  return (
    <>
      <Layout className="layout-default layout-signin">
        <Header>
          <div>
            <Image
              height={50}
              preview={false}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlE5WqC5kYtMhSvd07l4G6ClN9VlypQnrzzg&s"
              style={{ cursor: "pointer" }} // Hiển thị con trỏ khi hover
            />
          </div>
          <div className="header-col header-brand">
            <h5>Báo cáo Z76</h5>
          </div>
          <div className="header-col header-nav">
            <Menu mode="horizontal" defaultSelectedKeys={["1"]} items={items} />
          </div>
        </Header>
        <div className="tabled"
          style={{ padding: 10 }}
        >
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Danh sách chưa đặt hàng"
                style={{ paddingLeft: 10 }}
              >
                <div className="table-responsive">
                  <Table
                    rowClassName={(record) => {
                      const date = moment(record.ngayDongBo);
                      const today = moment();
                      const diffInDays = date.diff(today, 'days');

                      if (date.isBefore(today, 'day')) {
                        return 'red-text';
                      } else if (diffInDays >= 0 && diffInDays <= 10) {
                        return 'yellow-text';
                      }
                      return '';
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    // className="ant-border-space"
                    onRow={(record) => ({
                      onClick: () => handleClick(record), // Thêm sự kiện click vào hàng
                    })}
                    scroll={{
                      y: 55 * 13,
                    }}
                    style={{ userSelect: 'none', }}
                  />
                </div>
              </Card>
              <Modal
                // title={`Mã vị trí kho: ${selectedMaViTriKho || 'N/A'}`}
                open={isModalVisible}
                onCancel={handleModalClose}
                onOk={handleModalClose}
                width={"80%"}
              >
                <Card
                  className="criclebox tablespace "
                  title="Danh sách chi tiết vật tư"
                  style={{ padding: 10, marginTop: 20 }}
                >
                  {/* <p>Phần trăm: {selectedKey} %</p> */}
                  <Table
                    columns={columnsDSVT}
                    dataSource={danhSachVatTu}
                    pagination={false}
                    scroll={{
                      y: 55 * 8,
                    }}
                    style={{ userSelect: 'none', }}
                  />
                </Card>
              </Modal>
            </Col>
          </Row>
        </div >
      </Layout>
    </>
  );
}

export default Tables;
