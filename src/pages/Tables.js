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
    await setDanhSachVatTu(response.data)
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
    // {
    //   title: 'Chủng Loại Sản Phẩm',
    //   dataIndex: 'tenChungLoaiSanPham',
    //   key: 'tenChungLoaiSanPham',
    //   filters: productTypeFilters,
    //   onFilter: (value, record) => record.tenChungLoaiSanPham === value,
    //   ellipsis: { showTitle: false },
    //   render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
    // },
    // {
    //   title: 'Loại Đơn Hàng',
    //   dataIndex: 'tenLoaiDonHang',
    //   key: 'tenLoaiDonHang',
    //   filters: orderTypeFilters,
    //   onFilter: (value, record) => record.tenLoaiDonHang === value,
    // },
    // {
    //   title: 'ID Đơn Hàng',
    //   dataIndex: 'idDonHang',
    //   key: 'idDonHang',
    //   width: "8%",
    //   align: 'center',
    // },
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

  //
  return (
    <>
      <div className="tabled"
        style={{ padding: 10 }}
      >
        <Row gutter={[24, 0]}
          style={{
            paddingLeft: 10,
            paddingBottom: 10
          }}>
          <Col span={24} md={6}>
            <Breadcrumb>
              <Breadcrumb.Item>
                Pages
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
                Đơn hàng
              </Breadcrumb.Item>
            </Breadcrumb>
            <div className="ant-page-header-heading">
              <span
                className="ant-page-header-heading-title"
                style={{ textTransform: "capitalize" }}
              >
                ĐƠN HÀNG
              </span>
            </div>
          </Col>
        </Row >
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
              visible={isModalVisible}
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
    </>
  );
}

export default Tables;
