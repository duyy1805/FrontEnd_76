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
import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

import Countdown from "react-countdown";

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
    </AntFooter>
  );
}

export default Footer;
