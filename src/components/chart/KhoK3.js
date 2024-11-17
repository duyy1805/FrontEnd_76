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
// import lineChart from "./configs/lineChart";
// import Echart from "./EChart";
import khoK3 from "./configs/khoK3";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../../assets/styles/Style.css"
import ApexCharts from 'apexcharts'



const callAPILayoutKho_BTP = async () => {
  try {
    // Gửi yêu cầu GET tới API
    const response = await axios.get('http://localhost:5000/api/khoBTP', {
      params: {
        TenNha: "Kho K3", // Truyền tham số nếu cần
        ID_Kho: 5,
        MaVung: "B"
      }
    });
    return (response)
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
}

const callAPISearch_ = async () => {
  try {
    // Gửi yêu cầu GET tới API
    const response = await axios.get('http://localhost:5000/api/khoBTP/search', {
      params: {
        So_LenhXUATVT: "LXVT-2024-10-0288", // Truyền tham số nếu cần
        Ma_Vattu: '',
      }
    });
    return (response)
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
}


const array_ = Array.from({ length: 600 }, (_, index) => {
  const value = index + 100;
  const code = `A${value}`;
  const discount = Math.floor(Math.random() * 600);
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

const countDiscounts = (arr) => {
  const countLessThan100 = arr.filter(item => item.discount < 100).length;
  const countLessThan200 = arr.filter(item => item.discount < 200).length;
  const countLessThan300 = arr.filter(item => item.discount < 300).length;

  return [
    { label: 'Nhỏ hơn 100', value: countLessThan100 },
    { label: 'Nhỏ hơn 200', value: countLessThan200 - countLessThan100 }, // Trừ bớt các giá trị đã tính ở khoảng trước
    { label: 'Nhỏ hơn 300', value: countLessThan300 - countLessThan200 }, // Trừ bớt các giá trị đã tính ở khoảng trước
  ];
};

const datapie = countDiscounts(array);
const labels = datapie.map(item => item.label);
const series = datapie.map(item => item.value);

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
//Fucntion ở đây
const KhoK3 = (props) => {
  const tableRef = useRef(null);

  //==============useState
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [data, setData] = useState([]);
  const [inputLenhXuatVT, setInputLenhXuatVT] = useState("");


  const handleClick = (key) => {
    const key_ = JSON.stringify(key)
    setSelectedKey(key_); // Lưu trữ key của ô được nhấp
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedKey(null); // Xóa key sau khi đóng modal
  };

  // useEffect(() => {
  //   if (tableRef.current) {
  //     tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  //   }
  // }, [result]);
  const [threshold, setThreshold] = useState(null);


  const handleThresholdChange = (e) => {
    const value = e.target.value;
    setThreshold(value ? parseInt(value, 10) : null);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callAPILayoutKho_BTP();
        const MaViTriKho = response.data.map(item => item.MaViTriKho);
        const PhanTram = response.data.map(item => item.PhanTram);

        // Lưu dữ liệu vào state
        const formattedData = MaViTriKho.map((MaViTriKho, index) => ({
          // key: index + 1,
          rowTitle: `Hàng ${MaViTriKho.slice(0, -2)}`, // Tạo rowTitle dựa vào phần đầu (bỏ 2 chữ số cuối)
          MaViTriKho: MaViTriKho,
          PhanTram: PhanTram[index],
        }));
        console.log(formattedData)
        setData(formattedData);

      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
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
  const data_A = Object.keys(groupedData).length > 0 && groupedData.A1.map((item, index) => ({
    A1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    A2: groupedData.A2 ? { MaViTriKho: groupedData.A2[index]?.MaViTriKho, PhanTram: groupedData.A2[index]?.PhanTram } : null,
    A3: groupedData.A3 ? { MaViTriKho: groupedData.A3[index]?.MaViTriKho, PhanTram: groupedData.A3[index]?.PhanTram } : null,
    A4: groupedData.A4 ? { MaViTriKho: groupedData.A4[index]?.MaViTriKho, PhanTram: groupedData.A4[index]?.PhanTram } : null,
    A5: groupedData.A5 ? { MaViTriKho: groupedData.A5[index]?.MaViTriKho, PhanTram: groupedData.A5[index]?.PhanTram } : null,
    A6: groupedData.A6 ? { MaViTriKho: groupedData.A6[index]?.MaViTriKho, PhanTram: groupedData.A6[index]?.PhanTram } : null,
  }));

  const result_A = [];
  if (data_A) {

    for (let index = 0; index < data_A.length / 2; index++) {
      result_A.push({
        key: index,
        values: [
          data_A[index * 2].A1,
          data_A[index * 2 + 1].A1,
          data_A[index * 2].A2,
          data_A[index * 2 + 1].A2,
          data_A[index * 2].A3,
          data_A[index * 2 + 1].A3,
          data_A[index * 2].A4,
          data_A[index * 2 + 1].A4,
          data_A[index * 2].A5,
          data_A[index * 2 + 1].A5,
          data_A[index * 2].A6,
          data_A[index * 2 + 1].A6,
        ],
      });
    }
  }
  const data_B = Object.keys(groupedData).length > 0 && groupedData.B1.map((item, index) => ({
    B1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    B2: groupedData.B2 ? { MaViTriKho: groupedData.B2[index]?.MaViTriKho, PhanTram: groupedData.B2[index]?.PhanTram } : null,
    B3: groupedData.B3 ? { MaViTriKho: groupedData.B3[index]?.MaViTriKho, PhanTram: groupedData.B3[index]?.PhanTram } : null,
    B4: groupedData.B4 ? { MaViTriKho: groupedData.B4[index]?.MaViTriKho, PhanTram: groupedData.B4[index]?.PhanTram } : null,
    B5: groupedData.B5 ? { MaViTriKho: groupedData.B5[index]?.MaViTriKho, PhanTram: groupedData.B5[index]?.PhanTram } : null,
    B6: groupedData.B6 ? { MaViTriKho: groupedData.B6[index]?.MaViTriKho, PhanTram: groupedData.B6[index]?.PhanTram } : null,
  }));

  const result_B = [];
  if (data_B) {

    for (let index = 0; index < data_B.length / 2; index++) {
      result_B.push({
        key: index,
        values: [
          data_B[index * 2].B1,
          data_B[index * 2 + 1].B1,
          data_B[index * 2].B2,
          data_B[index * 2 + 1].B2,
          data_B[index * 2].B3,
          data_B[index * 2 + 1].B3,
          data_B[index * 2].B4,
          data_B[index * 2 + 1].B4,
          data_B[index * 2].B5,
          data_B[index * 2 + 1].B5,
          data_B[index * 2].B6,
          data_B[index * 2 + 1].B6,
        ],
      });
    }
  }
  const data_C = Object.keys(groupedData).length > 0 && groupedData.C1.map((item, index) => ({
    C1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    C2: groupedData.C2 ? { MaViTriKho: groupedData.C2[index]?.MaViTriKho, PhanTram: groupedData.C2[index]?.PhanTram } : null,
    C3: groupedData.C3 ? { MaViTriKho: groupedData.C3[index]?.MaViTriKho, PhanTram: groupedData.C3[index]?.PhanTram } : null,
    C4: groupedData.C4 ? { MaViTriKho: groupedData.C4[index]?.MaViTriKho, PhanTram: groupedData.C4[index]?.PhanTram } : null,
    C5: groupedData.C5 ? { MaViTriKho: groupedData.C5[index]?.MaViTriKho, PhanTram: groupedData.C5[index]?.PhanTram } : null,
    C6: groupedData.C6 ? { MaViTriKho: groupedData.C6[index]?.MaViTriKho, PhanTram: groupedData.C6[index]?.PhanTram } : null,
  }));

  const result_C = [];
  if (data_C) {

    for (let index = 0; index < data_C.length / 2; index++) {
      result_C.push({
        key: index,
        values: [
          data_C[index * 2].C1,
          data_C[index * 2 + 1].C1,
          data_C[index * 2].C2,
          data_C[index * 2 + 1].C2,
          data_C[index * 2].C3,
          data_C[index * 2 + 1].C3,
          data_C[index * 2].C4,
          data_C[index * 2 + 1].C4,
          data_C[index * 2].C5,
          data_C[index * 2 + 1].C5,
          data_C[index * 2].C6,
          data_C[index * 2 + 1].C6,
        ],
      });
    }
  }
  const data_D = Object.keys(groupedData).length > 0 && groupedData.D1.map((item, index) => ({
    D1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    D2: groupedData.D2 ? { MaViTriKho: groupedData.D2[index]?.MaViTriKho, PhanTram: groupedData.D2[index]?.PhanTram } : null,
    D3: groupedData.D3 ? { MaViTriKho: groupedData.D3[index]?.MaViTriKho, PhanTram: groupedData.D3[index]?.PhanTram } : null,
    D4: groupedData.D4 ? { MaViTriKho: groupedData.D4[index]?.MaViTriKho, PhanTram: groupedData.D4[index]?.PhanTram } : null,
    D5: groupedData.D5 ? { MaViTriKho: groupedData.D5[index]?.MaViTriKho, PhanTram: groupedData.D5[index]?.PhanTram } : null,
    D6: groupedData.D6 ? { MaViTriKho: groupedData.D6[index]?.MaViTriKho, PhanTram: groupedData.D6[index]?.PhanTram } : null,
  }));

  const result_D = [];
  if (data_D) {

    for (let index = 0; index < data_D.length / 2; index++) {
      result_D.push({
        key: index,
        values: [
          data_D[index * 2].D1,
          data_D[index * 2 + 1].D1,
          data_D[index * 2].D2,
          data_D[index * 2 + 1].D2,
          data_D[index * 2].D3,
          data_D[index * 2 + 1].D3,
          data_D[index * 2].D4,
          data_D[index * 2 + 1].D4,
          data_D[index * 2].D5,
          data_D[index * 2 + 1].D5,
          data_D[index * 2].D6,
          data_D[index * 2 + 1].D6,
        ],
      });
    }
  }
  const data_E = Object.keys(groupedData).length > 0 && groupedData.E1.map((item, index) => ({
    E1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    E2: groupedData.E2 ? { MaViTriKho: groupedData.E2[index]?.MaViTriKho, PhanTram: groupedData.E2[index]?.PhanTram } : null,
    E3: groupedData.E3 ? { MaViTriKho: groupedData.E3[index]?.MaViTriKho, PhanTram: groupedData.E3[index]?.PhanTram } : null,
    E4: groupedData.E4 ? { MaViTriKho: groupedData.E4[index]?.MaViTriKho, PhanTram: groupedData.E4[index]?.PhanTram } : null,
    E5: groupedData.E5 ? { MaViTriKho: groupedData.E5[index]?.MaViTriKho, PhanTram: groupedData.E5[index]?.PhanTram } : null,
    E6: groupedData.E6 ? { MaViTriKho: groupedData.E6[index]?.MaViTriKho, PhanTram: groupedData.E6[index]?.PhanTram } : null,
  }));

  const result_E = [];
  if (data_E) {

    for (let index = 0; index < data_E.length / 2; index++) {
      result_E.push({
        key: index,
        values: [
          data_E[index * 2].E1,
          data_E[index * 2 + 1].E1,
          data_E[index * 2].E2,
          data_E[index * 2 + 1].E2,
          data_E[index * 2].E3,
          data_E[index * 2 + 1].E3,
          data_E[index * 2].E4,
          data_E[index * 2 + 1].E4,
          data_E[index * 2].E5,
          data_E[index * 2 + 1].E5,
          data_E[index * 2].E6,
          data_E[index * 2 + 1].E6,
        ],
      });
    }
  }
  const data_F = Object.keys(groupedData).length > 0 && groupedData.F1.map((item, index) => ({
    F1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    F2: groupedData.F2 ? { MaViTriKho: groupedData.F2[index]?.MaViTriKho, PhanTram: groupedData.F2[index]?.PhanTram } : null,
    F3: groupedData.F3 ? { MaViTriKho: groupedData.F3[index]?.MaViTriKho, PhanTram: groupedData.F3[index]?.PhanTram } : null,
    F4: groupedData.F4 ? { MaViTriKho: groupedData.F4[index]?.MaViTriKho, PhanTram: groupedData.F4[index]?.PhanTram } : null,
    F5: groupedData.F5 ? { MaViTriKho: groupedData.F5[index]?.MaViTriKho, PhanTram: groupedData.F5[index]?.PhanTram } : null,
    F6: groupedData.F6 ? { MaViTriKho: groupedData.F6[index]?.MaViTriKho, PhanTram: groupedData.F6[index]?.PhanTram } : null,
  }));

  const result_F = [];
  if (data_F) {

    for (let index = 0; index < data_F.length / 2; index++) {
      result_F.push({
        key: index,
        values: [
          data_F[index * 2].F1,
          data_F[index * 2 + 1].F1,
          data_F[index * 2].F2,
          data_F[index * 2 + 1].F2,
          data_F[index * 2].F3,
          data_F[index * 2 + 1].F3,
          data_F[index * 2].F4,
          data_F[index * 2 + 1].F4,
          data_F[index * 2].F5,
          data_F[index * 2 + 1].F5,
          data_F[index * 2].F6,
          data_F[index * 2 + 1].F6,
        ],
      });
    }
  }
  const data_G = Object.keys(groupedData).length > 0 && groupedData.G1.map((item, index) => ({
    G1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    G2: groupedData.G2 ? { MaViTriKho: groupedData.G2[index]?.MaViTriKho, PhanTram: groupedData.G2[index]?.PhanTram } : null,
    G3: groupedData.G3 ? { MaViTriKho: groupedData.G3[index]?.MaViTriKho, PhanTram: groupedData.G3[index]?.PhanTram } : null,
    G4: groupedData.G4 ? { MaViTriKho: groupedData.G4[index]?.MaViTriKho, PhanTram: groupedData.G4[index]?.PhanTram } : null,
    G5: groupedData.G5 ? { MaViTriKho: groupedData.G5[index]?.MaViTriKho, PhanTram: groupedData.G5[index]?.PhanTram } : null,
    G6: groupedData.G6 ? { MaViTriKho: groupedData.G6[index]?.MaViTriKho, PhanTram: groupedData.G6[index]?.PhanTram } : null,
  }));

  const result_G = [];
  if (data_G) {

    for (let index = 0; index < data_G.length / 2; index++) {
      result_G.push({
        key: index,
        values: [
          data_G[index * 2].G1,
          data_G[index * 2 + 1].G1,
          data_G[index * 2].G2,
          data_G[index * 2 + 1].G2,
          data_G[index * 2].G3,
          data_G[index * 2 + 1].G3,
          data_G[index * 2].G4,
          data_G[index * 2 + 1].G4,
          data_G[index * 2].G5,
          data_G[index * 2 + 1].G5,
          data_G[index * 2].G6,
          data_G[index * 2 + 1].G6,
        ],
      });
    }
  }
  const data_H = Object.keys(groupedData).length > 0 && groupedData.H1.map((item, index) => ({
    H1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    H2: groupedData.H2 ? { MaViTriKho: groupedData.H2[index]?.MaViTriKho, PhanTram: groupedData.H2[index]?.PhanTram } : null,
    H3: groupedData.H3 ? { MaViTriKho: groupedData.H3[index]?.MaViTriKho, PhanTram: groupedData.H3[index]?.PhanTram } : null,
    H4: groupedData.H4 ? { MaViTriKho: groupedData.H4[index]?.MaViTriKho, PhanTram: groupedData.H4[index]?.PhanTram } : null,
    H5: groupedData.H5 ? { MaViTriKho: groupedData.H5[index]?.MaViTriKho, PhanTram: groupedData.H5[index]?.PhanTram } : null,
    H6: groupedData.H6 ? { MaViTriKho: groupedData.H6[index]?.MaViTriKho, PhanTram: groupedData.H6[index]?.PhanTram } : null,
  }));

  const result_H = [];
  if (data_H) {

    for (let index = 0; index < data_H.length / 2; index++) {
      result_H.push({
        key: index,
        values: [
          data_H[index * 2].H1,
          data_H[index * 2 + 1].H1,
          data_H[index * 2].H2,
          data_H[index * 2 + 1].H2,
          data_H[index * 2].H3,
          data_H[index * 2 + 1].H3,
          data_H[index * 2].H4,
          data_H[index * 2 + 1].H4,
          data_H[index * 2].H5,
          data_H[index * 2 + 1].H5,
          data_H[index * 2].H6,
          data_H[index * 2 + 1].H6,
        ],
      });
    }
  }
  const data_I = Object.keys(groupedData).length > 0 && groupedData.I1.map((item, index) => ({
    I1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    I2: groupedData.I2 ? { MaViTriKho: groupedData.I2[index]?.MaViTriKho, PhanTram: groupedData.I2[index]?.PhanTram } : null,
    I3: groupedData.I3 ? { MaViTriKho: groupedData.I3[index]?.MaViTriKho, PhanTram: groupedData.I3[index]?.PhanTram } : null,
    I4: groupedData.I4 ? { MaViTriKho: groupedData.I4[index]?.MaViTriKho, PhanTram: groupedData.I4[index]?.PhanTram } : null,
    I5: groupedData.I5 ? { MaViTriKho: groupedData.I5[index]?.MaViTriKho, PhanTram: groupedData.I5[index]?.PhanTram } : null,
    I6: groupedData.I6 ? { MaViTriKho: groupedData.I6[index]?.MaViTriKho, PhanTram: groupedData.I6[index]?.PhanTram } : null,
  }));

  const result_I = [];
  if (data_I) {

    for (let index = 0; index < data_I.length / 2; index++) {
      result_I.push({
        key: index,
        values: [
          data_I[index * 2].I1,
          data_I[index * 2 + 1].I1,
          data_I[index * 2].I2,
          data_I[index * 2 + 1].I2,
          data_I[index * 2].I3,
          data_I[index * 2 + 1].I3,
          data_I[index * 2].I4,
          data_I[index * 2 + 1].I4,
          data_I[index * 2].I5,
          data_I[index * 2 + 1].I5,
          data_I[index * 2].I6,
          data_I[index * 2 + 1].I6,
        ],
      });
    }
  }
  const data_J = Object.keys(groupedData).length > 0 && groupedData.J1.map((item, index) => ({
    J1: { MaViTriKho: item.MaViTriKho, PhanTram: item.PhanTram },
    J2: groupedData.J2 ? { MaViTriKho: groupedData.J2[index]?.MaViTriKho, PhanTram: groupedData.J2[index]?.PhanTram } : null,
    J3: groupedData.J3 ? { MaViTriKho: groupedData.J3[index]?.MaViTriKho, PhanTram: groupedData.J3[index]?.PhanTram } : null,
    J4: groupedData.J4 ? { MaViTriKho: groupedData.J4[index]?.MaViTriKho, PhanTram: groupedData.J4[index]?.PhanTram } : null,
    J5: groupedData.J5 ? { MaViTriKho: groupedData.J5[index]?.MaViTriKho, PhanTram: groupedData.J5[index]?.PhanTram } : null,
    J6: groupedData.J6 ? { MaViTriKho: groupedData.J6[index]?.MaViTriKho, PhanTram: groupedData.J6[index]?.PhanTram } : null,
  }));

  const result_J = [];
  if (data_J) {

    for (let index = 0; index < data_J.length / 2; index++) {
      result_J.push({
        key: index,
        values: [
          data_J[index * 2].J1,
          data_J[index * 2 + 1].J1,
          data_J[index * 2].J2,
          data_J[index * 2 + 1].J2,
          data_J[index * 2].J3,
          data_J[index * 2 + 1].J3,
          data_J[index * 2].J4,
          data_J[index * 2 + 1].J4,
          data_J[index * 2].J5,
          data_J[index * 2 + 1].J5,
          data_J[index * 2].J6,
          data_J[index * 2 + 1].J6,
        ],
      });
    }
  }
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
                  return (
                    <div
                      className={className}
                      style={{
                        transform: 'rotate(90deg)',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        fontSize: '8px',
                        outline: threshold && record.PhanTram === threshold ? '2px solid blue' : threshold === 0 && record.PhanTram === 0 ? '2px solid blue' : 'none',
                        // backgroundColor: threshold && record.PhanTram === threshold ? 'lightgreen' : 'transparent',
                      }}
                      onClick={() => handleClick(record.PhanTram)}
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
                  return (
                    <div
                      className={className}
                      style={{
                        transform: 'rotate(90deg)',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        fontSize: '8px',
                        outline: threshold && record.PhanTram === threshold ? '2px solid blue' : threshold === 0 && record.PhanTram === 0 ? '2px solid blue' : 'none',
                        // backgroundColor: threshold && record.PhanTram === threshold ? 'lightgreen' : 'transparent',
                      }}
                      onClick={() => handleClick(record.PhanTram)}
                    >
                      {record.MaViTriKho}
                    </div>
                  )
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
      labels: labels,
      colors: ['#54a8f6', '#3ca63cc4', '#fcff4dc4', '#db3d3dcc'],
      legend: {
        // show: false
        fontSize: '10px'
      },
      dataLabels: {
        enabled: true, // Bật hiển thị data labels
        drop: true, // Cho phép nhãn "rơi" ra ngoài
        style: {
          fontSize: '10px', // Kích thước chữ của data labels
        },
        distance: '20px', // Khoảng cách giữa data labels và tâm pie chart (tăng giá trị này sẽ đưa nhãn ra xa hơn)
      },

    }
  }
  return (
    <>
      <Row className="rowgap-vbox" gutter={[24, 0]}>

        {/* <Col
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
                    type="text"
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
        </Col> */}
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
              type="text"
              placeholder="Lệnh xuất vật tư"
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
              </div>
              <div className="sales">
                {/* <Card style={{ backgroundColor: '#e8e8e8' }}>
                  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <li>{<MinusOutlined style={{ color: 'green' }} />} </li>
                    <li>{<MinusOutlined style={{ color: 'yellow' }} />} </li>
                    <li>{<MinusOutlined style={{ color: '#ffffff' }} />} Trống </li>
                    <li>{<MinusOutlined style={{ color: 'red' }} />} Đầy </li>
                  </ul>
                </Card> */}
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
                          columns={columns_J}
                          bordered
                          dataSource={result_J}
                          pagination={false}
                          rowKey="key"
                        />
                      </div>
                    </div>
                    <Modal
                      title="Phần trăm hàng"
                      visible={isModalVisible}
                      onCancel={handleModalClose}
                      onOk={handleModalClose}
                    >
                      <p>{selectedKey}%</p>
                    </Modal>
                  </div>
                </TransformComponent>
              </TransformWrapper >
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
          <Card bordered={false} className="criclebox h-full" style={{ height: 200 }}>
            <ReactApexChart options={config.options} series={config.series} type="pie" width={280} />
          </Card>
        </Col>
      </Row >
    </>
  );
}

export default KhoK3;
