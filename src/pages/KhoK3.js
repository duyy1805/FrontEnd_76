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
import { useState } from "react";

import {
  Typography,
  Tooltip,
  Progress,

  message,

} from "antd";
import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";

// import Echart from "../components/chart/EChart";
// import LineChart from "../components/chart/LineChart";
import KhoK3 from "../components/chart/KhoK3";



function KhoK3_() {

  return (
    <>
      <div className="layout-content">

        <KhoK3 />

        {/* <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <div className="project-ant">
                <div>
                  <Title level={5}>Projects</Title>
                  <Paragraph className="lastweek">
                    done this month<span className="blue">40%</span>
                  </Paragraph>
                </div>
                <div className="ant-filtertabs">
                  <div className="antd-pro-pages-dashboard-analysis-style-salesExtra">
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="a">ALL</Radio.Button>
                      <Radio.Button value="b">ONLINE</Radio.Button>
                      <Radio.Button value="c">STORES</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className="ant-list-box table-responsive">
                <table className="width-100">
                  <thead>
                    <tr>
                      <th>COMPANIES</th>
                      <th>MEMBERS</th>
                      <th>BUDGET</th>
                      <th>COMPLETION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((d, index) => (
                      <tr key={index}>
                        <td>
                          <h6>
                            <img
                              src={d.img}
                              alt=""
                              className="avatar-sm mr-10"
                            />{" "}
                            {d.Title}
                          </h6>
                        </td>
                        <td>{d.member}</td>
                        <td>
                          <span className="text-xs font-weight-bold">
                            {d.bud}{" "}
                          </span>
                        </td>
                        <td>
                          <div className="percent-progress">{d.progress}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="uploadfile shadow-none">
                <Upload {...uploadProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    <span className="click">Click to Upload</span>
                  </Button>
                </Upload>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <div className="timeline-box">
                <Title level={5}>Orders History</Title>
                <Paragraph className="lastweek" style={{ marginBottom: 24 }}>
                  this month <span className="bnb2">20%</span>
                </Paragraph>

                <Timeline
                  pending="Recording..."
                  className="timelinelist"
                  reverse={reverse}
                >
                  {timelineList.map((t, index) => (
                    <Timeline.Item color={t.color} key={index}>
                      <Title level={5}>{t.title}</Title>
                      <Text>{t.time}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
                <Button
                  type="primary"
                  className="width-100"
                  onClick={() => setReverse(!reverse)}
                >
                  {<MenuUnfoldOutlined />} REVERSE
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Row gutter>
                <Col
                  xs={24}
                  md={12}
                  sm={24}
                  lg={12}
                  xl={14}
                  className="mobile-24"
                >
                  <div className="h-full col-content p-20">
                    <div className="ant-muse">
                      <Text>Built by developers</Text>
                      <Title level={5}>Muse Dashboard for Ant Design</Title>
                      <Paragraph className="lastweek mb-36">
                        From colors, cards, typography to complex elements, you
                        will find the full documentation.
                      </Paragraph>
                    </div>
                    <div className="card-footer">
                      <a className="icon-move-right" href="#pablo">
                        Read More
                        {<RightOutlined />}
                      </a>
                    </div>
                  </div>
                </Col>
                <Col
                  xs={24}
                  md={12}
                  sm={24}
                  lg={12}
                  xl={10}
                  className="col-img"
                >
                  <div className="ant-cret text-right">
                    <img src={card} alt="" className="border10" />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} md={12} sm={24} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox card-info-2 h-full">
              <div className="gradent h-full col-content">
                <div className="card-content">
                  <Title level={5}>Work with the best</Title>
                  <p>
                    Wealth creation is an evolutionarily recent positive-sum
                    game. It is all about who take the opportunity first.
                  </p>
                </div>
                <div className="card-footer">
                  <a className="icon-move-right" href="#pablo">
                    Read More
                    <RightOutlined />
                  </a>
                </div>
              </div>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
}

export default KhoK3_;
