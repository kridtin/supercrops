import React from "react";
import { useState, useEffect } from "react";
import $ from "jquery";
import "../styles/globals.scss";
import "../styles/gentelella/vendors/bootstrap/dist/css/bootstrap.min.css";
import "../styles/gentelella/vendors/font-awesome/css/font-awesome.min.css";
import "../styles/gentelella/vendors/nprogress/nprogress.css";
import "../styles/gentelella/vendors/animate.css/animate.min.css";
import "../styles/gentelella/build/css/custom.min.css";
import "../styles/gentelella/vendors/iCheck/skins/flat/green.css";
import "../styles/gentelella/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css";
import "../styles/gentelella/vendors/jqvmap/dist/jqvmap.min.css";
import "../styles/gentelella/vendors/bootstrap-daterangepicker/daterangepicker.css";
import "../styles/bootstrap-toggle.min.css";

import "chartjs-adapter-moment";
import Head from "next/head";
import Layout from "../layout/layout";
import { useRouter } from "next/router";
import node from "./node";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const Layout = Component.Layout ? Component.Layout : React.Fragment;
  const [Login, setLogin] = useState(false);
  const [orgID, setorgID] = useState("");
  const [userID, setuserID] = useState("");
  const [farmID, setfarmID] = useState("");
  const [stationID, setstationID] = useState("");
  const [nodeID, setnodeID] = useState("");

  useEffect(() => {
    const _login = localStorage.getItem("_login");
    const _orgID = localStorage.getItem("_orgID");
    const _userID = localStorage.getItem("_userID");
    const _farmID = localStorage.getItem("_farmID");
    const _stationID = localStorage.getItem("_stationID");
    const _nodeID = localStorage.getItem("_nodeID");

    setLogin(_login);
    setorgID(_orgID);
    setuserID(_userID);
    setfarmID(_farmID);
    setstationID(_stationID);
    setnodeID(_nodeID);
  }, []);

  useEffect(() => {
    localStorage.setItem("_login", Login);
  }, [Login]);
  useEffect(() => {
    localStorage.setItem("_orgID", orgID);
  }, [orgID]);
  useEffect(() => {
    localStorage.setItem("_userID", userID);
  }, [userID]);
  useEffect(() => {
    localStorage.setItem("_farmID", farmID);
  }, [farmID]);
  useEffect(() => {
    localStorage.setItem("_stationID", stationID);
  }, [stationID]);
  useEffect(() => {
    localStorage.setItem("_nodeID", nodeID);
  }, [nodeID]);

  return (
    <>
      <Layout>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Super Crops</title>
          <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ​
        </Head>
        <Component
          {...pageProps}
          Login={Login}
          setLogin={setLogin}
          orgID={orgID}
          setorgID={setorgID}
          userID={userID}
          setuserID={setuserID}
          farmID={farmID}
          setfarmID={setfarmID}
          stationID={stationID}
          setstationID={setstationID}
          nodeID={nodeID}
          setnodeID={setnodeID}
        />
      </Layout>
    </>
  );
}

export default MyApp;
