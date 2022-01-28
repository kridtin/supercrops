import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/home.module.scss";
import Layout from "../layout/layout";
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import axios from "axios";

export default function Home(props) {
  const router = useRouter();
  const [farmIdList, setfarmIdList] = useState([]);
  const [farms, setfarms] = useState([]);

  useEffect(async () => {
    if (
      localStorage.getItem("_login") == false ||
      localStorage.getItem("_login") == null ||
      localStorage.getItem("_login") == "null" ||
      localStorage.getItem("_login") == "" ||
      localStorage.getItem("_orgID") == null ||
      localStorage.getItem("_orgID") == "null" ||
      localStorage.getItem("_orgID") == ""
    ) {
      window.location.assign("/login");
    } /*
    const profileres = await axios.post(
      "http://80d9-2001-fb1-61-6ff2-3deb-b5ca-acd3-3713.ngrok.io/api/user/getprofile",
      { _id: logininfo.id },
      { headers: { "x-access-token": logininfo.accessToken } }
    )
    const userInfo = profileres.data;
    localStorage.setItem("userInfo", userInfo);*/
    // test orgid = O21f42baf3ce842c292092197e17002cb
    const responce = await axios
      .post(
        "http://203.151.136.127:10001/api/getFarmID/Uda237c338beb4483afdbd961fb7f6dfb",
        {
          orgId: "O21f42baf3ce842c292092197e17002cb",
        }
      )
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
    //setfarmIdList(responce.data.farmIDlist);
    setfarmIdList(["F184b91fec195443c829aaaebcdaeae16"]);
    const testFarmIDList = ["F184b91fec195443c829aaaebcdaeae16"];
    for (let i = 0; i < testFarmIDList.length; i++) {
      const farmid = testFarmIDList[i];
      axios
        .post("http://203.151.136.127:10001/api/farmDetail/", {
          orgId: "Oc780373b0fa34391a5f987cc095f680a",
          farmId: farmid,
        })
        .then((res, eror) => {
          // setfarms([]);
          setfarms((farms) => [...farms, res.data]);
        });
    }
  }, []);
  /*const farmList = [
    { name: "ฟาร์มภูมิใจ", location: "อุตรดิตถ์", type: "ทุเรียน" },
    { name: "เพิ่มพูลฟาร์ม", location: "สุโขทัย", type: "ลองกอง" },
    { name: "ไร่ตันตระกูล", location: "สุโขทัย", type: "มะม่วง" },
    { name: "ทุ่งสุขสวัสดิ์", location: "น่าน", type: "ข้าวโพด" },
    { name: "สวนสตรอเบอรี่", location: "เพชรบูรณ์", type: "สตรอเบอรี่" },
  ];*/
  function link(url) {
    router.push(url);
  }
  return (
    <div>
      <div className="row">
        <div className="x_panel">
          <h2>
            <i className="fa fa-home"></i> <Link href="/">หน้าหลัก</Link> /
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="x_panel">
          <div
            className="col-md-2 col-sm-4  tile_stats_count"
            style={{ minWidth: "300px", marginLeft: "-10px" }}
          >
            <span className="count_top">
              <h2>
                <i className="fa fa-sitemap"></i> จำนวนฟาร์ม
              </h2>
            </span>
            <div className="count">
              <h3>{farms.length}</h3>
            </div>
            <span className="count_bottom"></span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="x_panel">
          <div className="x_content">
            <div>
              <h2>
                <i className="fa fa-sitemap"></i> ฟาร์มของฉัน
              </h2>
            </div>
            <div
              className="profile_details"
              style={{
                display: "flex",
                gap: "20px",
                maxWidth: "100%",
                flexFlow: "row wrap",
              }}
            >
              {farms.map((farm, index) => {
                return (
                  <div
                    key={index}
                    className="well profile_view"
                    style={{ minWidth: "300px", width: "350px" }}
                  >
                    <div className="col-sm-12">
                      <h4 className="brief">ฟาร์มที่ {index + 1}</h4>
                      <div className="left col-md-7 col-sm-7">
                        <h2>
                          <strong className="farmname">{farm.name}</strong>
                        </h2>
                        <ul className="list-unstyled">
                          <li>
                            <i className="fa fa-location-arrow"></i>{" "}
                            <b> จังหวัด: </b> {"ว่าง"}
                          </li>
                          <li>
                            <i className="fa fa-leaf"></i>
                            <b> ผลผลิต: </b> {farm.description}
                          </li>
                        </ul>
                      </div>
                      <div className="right col-md-5 col-sm-5 text-center">
                        <Image
                          src="/station-demo.png"
                          width={108}
                          height={64}
                        />
                      </div>
                    </div>
                    <div className=" bottom text-right">
                      <div className=" col">
                        <button
                          style={{ marginBottom: "20px" }}
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            router.push(`/farm`);
                            props.setfarmID(farmIdList[index]);
                          }}
                        >
                          <i className="fa fa-eye"> </i> ดูข้อมูล
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Home.Layout = Layout;
