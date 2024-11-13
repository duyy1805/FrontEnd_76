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
import { Typography, Table, Modal, Row, Col, Card, Input } from "antd";
import {
  MinusOutlined, SearchOutlined,
  StarOutlined,
  TwitterOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import axios from 'axios';
import lineChart from "./configs/lineChart";
import Echart from "./EChart";
import khoK3 from "./configs/khoK3";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../../assets/styles/Style.css"

const array_ = Array.from({ length: 600 }, (_, index) => {
  const value = index + 100;
  const code = `A${value}`;
  const discount = String(value).slice(-3);
  return { code, discount };
});

// Lọc các phần tử với code nằm trong các khoảng cụ thể
const array = array_.filter(item => {
  const value = parseInt(item.code.slice(1), 10); // Lấy giá trị sau chữ 'A'

  // Kiểm tra nếu giá trị nằm trong các khoảng mong muốn
  return (
    (value >= 100 && value <= 179) ||
    (value >= 200 && value <= 279) ||
    (value >= 300 && value <= 379) ||
    (value >= 400 && value <= 479) ||
    (value >= 500 && value <= 579) ||
    (value >= 600 && value <= 679)
  );
});


// Tách 2 chữ cái đầu và nhóm theo chúng
const groupedData = array.reduce((acc, item) => {
  const prefix = item.code.slice(0, 2);
  if (!acc[prefix]) {
    acc[prefix] = [];
  }
  acc[prefix].push(item);
  return acc;
}, {});

const data_ = groupedData.A1.map((item, index) => ({
  A1: { code: item.code, discount: item.discount },
  A2: { code: groupedData.A2[index].code, discount: groupedData.A2[index].discount },
  A3: { code: groupedData.A3[index].code, discount: groupedData.A3[index].discount },
  A4: { code: groupedData.A4[index].code, discount: groupedData.A4[index].discount },
  A5: { code: groupedData.A5[index].code, discount: groupedData.A5[index].discount },
  A6: { code: groupedData.A6[index].code, discount: groupedData.A6[index].discount },
}));

const result = [];

for (let index = 0; index < data_.length / 2; index++) {
  result.push({
    key: index,
    values: [
      data_[index * 2].A1,
      data_[index * 2 + 1].A1,
      data_[index * 2].A2,
      data_[index * 2 + 1].A2,
      data_[index * 2].A3,
      data_[index * 2 + 1].A3,
      data_[index * 2].A4,
      data_[index * 2 + 1].A4,
      data_[index * 2].A5,
      data_[index * 2 + 1].A5,
      data_[index * 2].A6,
      data_[index * 2 + 1].A6,
    ],
  });
}


const KhoK3 = (props) => {
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [result]);
  const [threshold, setThreshold] = useState(null);

  const handleThresholdChange = (e) => {
    const value = e.target.value;
    setThreshold(value ? parseInt(value, 10) : null);
  };

  const columns = Array.from({ length: 6 }, (_, index) => {
    const key = `A${index + 1}`;
    return {
      title: (
        <div style={{ transform: 'rotate(180deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '8px' }}>
          Dãy {key}
        </div>
      ),
      children: [
        {
          title: (
            <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '8px', lineHeight: '20px' }}>
              Số chẵn
            </div>
          ),
          dataIndex: ['values', index * 2],
          key: `${key}_even`,
          render: (record) => (
            <div
              style={{
                transform: 'rotate(90deg)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                fontSize: '8px',
                backgroundColor: threshold && record.discount < threshold ? 'lightgreen' : 'transparent',
              }}
            >
              {record.code}
            </div>
          ),
          width: '20',
        },
        {
          title: (
            <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '8px', lineHeight: '20px', padding: '0 6px' }}>
              Số lẻ
            </div>
          ),
          dataIndex: ['values', index * 2 + 1],
          key: `${key}_odd`,
          render: (record) => (
            <div
              style={{
                transform: 'rotate(90deg)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                fontSize: '8px',
                backgroundColor: threshold && record.discount < threshold ? 'lightgreen' : 'transparent',
              }}
            >
              {record.code}
            </div>
          ),
          width: 20,
        },
      ],
    };
  });
  const { Title, Paragraph } = Typography;
  const count = [
    {
      today: "Today’s Sales",
      title: "$53,000",
      persent: "+30%",
      bnb: "bnb2",
    },
    {
      today: "Today’s Users",
      title: "3,200",
      persent: "+20%",
      bnb: "bnb2",
    },
    {
      today: "New Clients",
      title: "+1,200",
      persent: "-20%",
      bnb: "redtext",
    },
    {
      today: "New Orders",
      title: "$13,200",
      persent: "10%",
      bnb: "bnb2",
    },
  ];
  return (
    <>
      <Row className="rowgap-vbox" gutter={[24, 0]}>

        <Col
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          className="mb-24"
        >
          <Card bordered={false} className="criclebox ">
            <div className="number">
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={10}>
                  <span style={{ fontSize: 12 }}>Mã đơn hàng</span>
                </Col>
                <Col xs={14}>
                  <Input
                    type="number"
                    placeholder="Nhập số lượng"
                    onChange={handleThresholdChange}
                    style={{
                      borderRadius: 6,
                      border: '1px solid #d9d9d9',
                      fill: '#8c8c8c'
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={6}
          xl={6}
          className="mb-24"
        >
          <Card bordered={false} className="criclebox ">
            <Input
              type="number"
              placeholder="Mã đơn hàng"
              onChange={handleThresholdChange}
              prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
              style={{ borderRadius: '6px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>

        <Col xs={24} sm={24} md={12} lg={12} xl={18} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{
                        display: 'inline-block', transform: 'rotate(-180deg)',
                        marginRight: 10
                      }}
                        ref={tableRef}>
                        <Table
                          columns={columns}
                          bordered
                          dataSource={result}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                      <div style={{ display: 'inline-block', transform: 'rotate(-180deg)' }}>
                        <Table
                          columns={columns}
                          dataSource={result}
                          bordered
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                    </div>
                  </div>
                </TransformComponent>
              </TransformWrapper >
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Echart />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default KhoK3;
