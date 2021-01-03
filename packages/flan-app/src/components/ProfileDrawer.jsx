import React from 'react'
import { Row, Col, Drawer, Button, Divider } from 'antd';
import PropTypes from 'prop-types';
import Isotype from "../assets/images/isotype.png";

const ProfileDrawer = ({
    show,
    handleOnClose    
}) => {

    return (
        <Drawer
            width={412}
            data-testid = 'profile-drawer'
            title = 'Profile'
            visible = {show}
            onClose = {handleOnClose}
            maskClosable = {true}
        >
            <Row justify="center">
                <Col span={4}>
                    <img
                        src={Isotype}
                        alt="Profile"
                        style={{
                            borderRadius: '50%',
                            width: '100px',
                            height: '100px'
                        }}
                    />
                </Col>
            </Row>
            <Divider orientation="center">Role</Divider>
            <Row>
                <Col span={9}>
                    <h3>Address:</h3>
                </Col>
                <Col span={15}>
                </Col>
            </Row>
            <Row justify="center">
                <Col span={6}>
                </Col>
            </Row>
            <Divider orientation="center">Last appllications</Divider>
            <Divider orientation="center">Balance</Divider>
            <Row>
                <Col span={9}>
                    <h3>Available:</h3>
                </Col>
                <Col span={15}>
                </Col>
            </Row>
        </Drawer>
    );
};

ProfileDrawer.propTypes = {
    show: PropTypes.bool.isRequired,
    handleOnClose: PropTypes.func.isRequired
}

export default ProfileDrawer;