import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    Layout, Image,
    Menu, Table,
    Button,
    Row,
    Col,
    Typography,
    Form,
    Input,
    Switch,
    Space
} from "antd";
import axios from "axios";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import styles from './Uniform.module.css';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import UniformChart from "../components/chart/UniformChart";


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
            className="fill-muted"
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
const Uniform = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await axios.get("https://apipccc.z76.vn/HR/uniform");
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        return () => {
            isMounted = false; // cleanup: đánh dấu component đã bị unmount
        };
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Nhập ${dataIndex === "EmployeeID" ? "mã nhân viên" : "họ tên"}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        className={styles.button}
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        className={styles.button}
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        className={styles.button}
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys)[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        className={styles.button}
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: "Mã nhân viên",
            dataIndex: "EmployeeID",
            key: "EmployeeID",
            align: "center",
            ...getColumnSearchProps("EmployeeID"),
            width: "10%",
        },
        {
            title: "Họ và tên",
            dataIndex: "Fullname",
            key: "Fullname",
            ...getColumnSearchProps("Fullname"),
        },
        {
            title: "Chức vụ",
            dataIndex: "JobTitleName",
            key: "JobTitleName",
        },
        {
            title: "Năm cấp",
            dataIndex: "NamCap",
            key: "NamCap",
            align: "center",
            width: "10%",
            ...getColumnSearchProps("NamCap"),
        },
        {
            title: "Số bộ vest",
            dataIndex: "SoBo_V",
            key: "SoBo_V",
            align: "center",
            width: "10%",
            ...getColumnSearchProps("SoBo_V"),
        },
        {
            title: "Số bộ BD",
            dataIndex: "SoBo_BD",
            key: "SoBo_BD",
            align: "center",
            width: "10%",
            ...getColumnSearchProps("SoBo_BD"),
        },
        {
            title: "Số bộ BH",
            dataIndex: "SoBo_BH",
            key: "SoBo_BH",
            align: "center",
            width: "10%",
            ...getColumnSearchProps("SoBo_BH"),
        },
        {
            title: "Tổng",
            dataIndex: "TongSoBo",
            key: "TongSoBo",
            align: "center",
            width: "5%",
        },
    ];

    return (
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
            <Content style={{ paddingTop: 10 }} >
                <div>
                    <UniformChart data={data} />
                </div>
                <div style={{ padding: 24 }}>
                    <Title level={3}>Danh sách cấp phát đồng phục</Title>
                    <Table
                        className={styles.table}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey="EmployeeID"
                        scroll={{ y: 55 * 7 }}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Uniform;
