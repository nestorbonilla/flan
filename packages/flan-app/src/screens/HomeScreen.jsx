import React, { useState } from "react";
import { Layout, Row, Typography, Col, Form, Input, Button, Radio, Select } from "antd";
import { useTranslation } from "react-i18next";
import golemLogo from "../assets/images/logo_with_phrase.png";
import * as moment from "moment";

const { Content, Footer } = Layout;
const { Paragraph } = Typography;
const { Option } = Select;

function HomeScreen() {

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const flanApiUrl = "http://localhost:5000";

  const onFormAnalyze = () => {
    console.log("on form analyze...");
    
    var parameters = JSON.stringify({
      startYear: 2012,
      endYear: 2018,
      country: 'pan'
    });
    // ANALYZE DATA
    analyzeData(parameters);
  }

  const analyzeData = async (parameters) => {
    console.log("Sending request...");
    const response = await fetch(`${flanApiUrl}/golem/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: parameters
    }).then((res) => res.json());
    console.log("Analysis result: ", response);
  }

  return (
    <Layout className="site-layout">
      <Content style={{ margin: '0 16px' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Row type="flex" align="middle">
            <Col span={12} offset={6} className='gutter-row'>
              <img src={golemLogo} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%'}} alt='Golem Logo' />
              <Paragraph style={{textAlign: 'center', textJustify: 'inter-word'}}>{t('description_1')}</Paragraph>
              <Paragraph style={{textAlign: 'center', textJustify: 'inter-word'}}>{t('description_2')}</Paragraph>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={12} offset={6}>
              <Form
                layout={"vertical"}
                form={form}
                initialValues={{ layout: "vertical" }}
                onFinish={onFormAnalyze}
              >
                <Row>
                  <Col span={7}>
                    <Form.Item name="start_year" label="First year" rules={[{ required: true }]}>
                      <Select
                        placeholder="Select the first year"
                        allowClear
                      >
                        <Option value="2012">2012</Option>
                        <Option value="2013">2013</Option>
                        <Option value="2014">2014</Option>
                        <Option value="2015">2015</Option>
                        <Option value="2016">2016</Option>
                        <Option value="2017">2017</Option>
                        <Option value="2018">2018</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={7} offset={1}>
                    <Form.Item name="end_year" label="Last year" rules={[{ required: true }]}>
                      <Select
                        placeholder="Select the last year"
                        allowClear
                      >
                        <Option value="2012">2012</Option>
                        <Option value="2013">2013</Option>
                        <Option value="2014">2014</Option>
                        <Option value="2015">2015</Option>
                        <Option value="2016">2016</Option>
                        <Option value="2017">2017</Option>
                        <Option value="2018">2018</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8} offset={1}>
                    <Form.Item name="origin" label="Origin" rules={[{ required: true }]}>
                      <Select
                        placeholder="Select the country"
                        allowClear
                      >
                        <Option value="nic">Nicaragua</Option>
                        <Option value="pan">Panama</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row align={"middle"}>
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">Calculate with Flan</Button>
                    </Form.Item>
                  </Col>
                </Row>                
              </Form>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Golem Network Hackathon {moment(new Date()).format('YYYY')} <br/> Created by Nestor Bonilla</Footer>
    </Layout>
  )
}

export default HomeScreen