import React from 'react'
import { Layout, Row, Typography, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import golemLogo from '../assets/images/logo_with_phrase.png'
import * as moment from 'moment'

const { Content, Footer } = Layout;
const { Paragraph } = Typography

function AboutScreen() {

  const { t } = useTranslation()

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
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Golem Network Hackathon {moment(new Date()).format('YYYY')} <br/> Created by Nestor Bonilla</Footer>
    </Layout>
  )
}

export default AboutScreen