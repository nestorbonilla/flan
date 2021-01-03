import React, { useCallback, useEffect, useState, Suspense, Fragment } from "react";
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import "antd/dist/antd.css";
import "./App.less";
import { Menu, Layout } from 'antd';

import { HeaderComponent } from "./components";
import HomeScreen from "./screens/HomeScreen";
import ProfileDrawer from "./components/ProfileDrawer";
import "../../../packages/react-app/src/i18n";

const { Footer } = Layout;

const DEBUG = false

function App(props) {

  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [ window.location.pathname ]);

  return (
    <Suspense fallback={null}>
      <Fragment>
        <BrowserRouter>
          <Layout style={{ minHeight: '100vh' }}>
            <HeaderComponent handleProfileDrawer={() => setShowProfileDrawer(true)} />     
            <ProfileDrawer
              data-testid='profile-drawer'
              show={showProfileDrawer}
              handleOnClose={() => setShowProfileDrawer(false)}              
            />
            <Switch>
              <Route exact path='/' render={() => <HomeScreen />}/>
              
              <Footer className='footer'>© 2020 Created by Nestor Bonilla</Footer>
            </Switch>
          </Layout>
        </BrowserRouter>
      </Fragment>
    </Suspense>
  );
}

export default App;