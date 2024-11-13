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
import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import { Typography, Table, Modal, Row, Col, Card } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import axios from 'axios';
import lineChart from "./configs/lineChart";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../../assets/styles/Style.css"

function LineChart() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [data, setData] = useState([]);

  const handleClick = (key) => {
    setSelectedKey(key); // Lưu trữ key của ô được nhấp
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedKey(null); // Xóa key sau khi đóng modal
  };

  const columns = [
    {
      title: 'Tầng',
      dataIndex: 'floor',
      key: 'floor',
      width: '60px',
      // fixed: 'left',
      render: (floor) => (
        <div style={{
          // padding: '8px',
          textAlign: 'center',
          // fontWeight: 'bold',
        }}>
          {floor}
        </div>
      ),
    },
    ...Array.from({ length: 40 }, (_, i) => ({
      title: `${i + 1}`,
      dataIndex: ['values', i],
      key: `col${i + 1}`,
      width: '20px',
      render: (value, record) => {
        // Xác định className dựa trên giá trị `record.percent[i]`
        const className = record.percent[i] > 85
          ? 'green-background'
          : record.percent[i] > 0 && record.percent[i] <= 85
            ? 'yellow-background'
            : record.percent[i] < 0
              ? 'red-background'
              : 'white-background';

        return (
          <div className={className} style={{
            // padding: '10px', // Điều chỉnh padding cho phù hợp
            textAlign: 'center',
            fontSize: '4px',
          }}
            onClick={() => handleClick(record.percent[i])} // Sử dụng sự kiện onClick
          >
            {value}
          </div>
        );
      },
    })),
  ];


  useEffect(() => {

    const fetchData = async () => {
      try {
        // Gửi yêu cầu GET tới API
        const response = await axios.get('http://localhost:5000/api/kho', {
          params: {
            TenNha: "Kho N1", // Truyền tham số nếu cần
            ID_Kho: 1,
            MaVung: "A"
          }
        });
        console.log(response)
        const positions = response.data.map(item => item.MaViTriKho);
        const percent = response.data.map(item => item.PhanTram);
        // Lưu dữ liệu vào state
        const formattedData = positions.map((position, index) => ({
          key: index + 1,
          rowTitle: `Hàng ${position.slice(0, -2)}`, // Tạo rowTitle dựa vào phần đầu (bỏ 2 chữ số cuối)
          // floor: position.slice(-2, -1),
          value: position,
          percent: percent[index],
        }));

        setData(formattedData);

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };


    // Gọi hàm fetchData khi component được mount
    fetchData();
  }, []);

  // Nhóm dữ liệu theo rowTitle (tên hàng theo phần đầu của Vị trí)
  const groupedDataByRowTitle = data.reduce((acc, item) => {
    const { rowTitle, value, percent } = item;

    if (!acc[rowTitle]) {
      acc[rowTitle] = { values: [], percents: [] }; // Khởi tạo mảng riêng cho values và percents
    }

    // Thêm value và percent vào nhóm tương ứng
    acc[rowTitle].values.push(value);
    acc[rowTitle].percents.push(percent);

    return acc;
  }, {});

  // Chuyển groupedDataByRowTitle thành tableData với 5 phần tử mỗi hàng
  const tableData = Object.entries(groupedDataByRowTitle).flatMap(([rowTitle, { values, percents }], i) =>
    Array.from({ length: Math.ceil(values.length / 5) }, (_, j) => ({
      key: `${rowTitle}-${j + 1}`,
      rowTitle,
      values: values.slice(j * 5, j * 5 + 5),
      floor: `Tầng ${values.slice(j * 5, j * 5 + 5)[0].slice(-2, -1)}`, // Lấy chữ số cuối từ giá trị đầu tiên
      percent: percents.slice(j * 5, j * 5 + 5), // Lấy phần tương ứng từ percents
    }))
  );

  // Chia tableData thành các nhóm 3 hàng
  const groupedData = Array.from({ length: Math.ceil(tableData.length / 3) }, (_, i) =>
    tableData.slice(i * 3, i * 3 + 3)
  );



  const { Title, Paragraph } = Typography;

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>SƠ ĐỒ KHO</Title>
          <Paragraph className="lastweek">
            than last week <span className="bnb2">+30%</span>
          </Paragraph>
        </div>
        <div className="sales">
          <Card style={{ backgroundColor: '#e8e8e8' }}>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <li>{<MinusOutlined style={{ color: 'green' }} />} </li>
              <li>{<MinusOutlined style={{ color: 'yellow' }} />} </li>
              <li>{<MinusOutlined style={{ color: '#ffffff' }} />} Trống </li>
              <li>{<MinusOutlined style={{ color: 'red' }} />} Đầy </li>
            </ul>
          </Card>
        </div>
      </div>
      <div className="Layout_Kho" style={{ width: '100%', maxHeight: 500, overflowY: 'auto', flexGrow: 1 }}>
        <TransformWrapper >
          <TransformComponent >
            <div style={{ width: '950px', height: '100%', marginRight: 10, marginTop: 20 }}>
              {groupedData.map((group, index) => (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Card>
                    <div>
                      <div style={{ margin: "0px 0px", fontWeight: 'bold', fontSize: 10 }}>
                        {group[0].rowTitle}
                      </div>
                    </div>
                  </Card>
                  <Table
                    key={index}
                    columns={columns}
                    dataSource={group}
                    pagination={false}
                    // bordered
                    borderColor='#000'
                    showHeader={false}
                    style={{
                      marginBottom: '12px',
                      width: '91%',
                      overflowY: 'auto',
                      overflowX: 'hidden'
                    }}
                    className="custom-table"
                    tableLayout='fixed'
                  />
                  <Modal
                    title="Thông tin Key"
                    visible={isModalVisible}
                    onCancel={handleModalClose}
                    onOk={handleModalClose}
                  >
                    <p>Phần trăm: {selectedKey}</p>
                  </Modal>
                </div>
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
        {/* <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      /> */}
      </div >
    </>
  );
}

export default LineChart;
