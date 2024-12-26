
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { Button, Popover, Avatar, Space } from 'antd';
import Countdown from "react-countdown";
import { useHistory } from 'react-router-dom';

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
        Chờ cập nhật: {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    );
  }
};

function Footer() {

  const { Footer: AntFooter } = Layout;
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');
    setVisible(false);
    history.push('/sign-in');
  };
  const content = (
    <div>
      <p>{localStorage.getItem('role')}</p>
      <p onClick={handleLogout} style={{ cursor: 'pointer', color: 'blue' }}>Đăng xuất</p>
    </div>
  );
  const [key, setKey] = useState(0);
  const keyRef = useRef(key);

  const handleRestart = () => {
    keyRef.current += 1;
    setKey(keyRef.current);
  };

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 200,
          zIndex: 1000,
        }}
      >
        <Countdown
          key={key}
          date={Date.now() + 1000 * 60 * 30}
          renderer={(props) => renderer({ ...props, restart: handleRestart })}
        />
      </div >
      {/* <div
        style={{
          position: "absolute",
          top: 10,
          right: 350,
          zIndex: 1000,
        }}
      >
        <Popover
          content={content}
          title="Profile"
          trigger="click"
          visible={visible}
          onVisibleChange={(visible) => setVisible(visible)}
        >
          <Button
            shape="circle"
            size="large"
            style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
          >
            <img
              src="https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/characters/raiden_shogun/image.png?strip=all&quality=100" // URL của ảnh
              alt="Profile"
              style={{
                width: '32px', // Điều chỉnh kích thước ảnh
                height: '32px', // Điều chỉnh kích thước ảnh
                borderRadius: '50%', // Làm ảnh thành hình tròn
              }}
            />
          </Button>
        </Popover>
      </div > */}
    </AntFooter>
  );
}

export default Footer;
