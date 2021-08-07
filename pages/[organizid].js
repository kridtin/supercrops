import React from "react";
import styles from "../styles/home.module.scss";
import Layout from "../layout/layout";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import router from "next/router";

export default function organizid() {
  const farmList = [
    { name: "ฟาร์มภูมิใจ", location: "อุตรดิตถ์", type: "ทุเรียน" },
    { name: "เพิ่มพูลฟาร์ม", location: "สุโขทัย", type: "ลองกอง" },
    { name: "ไร่ตันตระกูล", location: "สุโขทัย", type: "มะม่วง" },
    { name: "ทุ่งสุขสวัสดิ์", location: "น่าน", type: "ข้าวโพด" },
    { name: "สวนสตรอเบอรี่", location: "เพชรบูรณ์", type: "สตรอเบอรี่" },
  ];
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
              <h5>
                <i className="fa fa-home"></i> จำนวนฟาร์ม
              </h5>
            </span>
            <div className="count">
              <h3>{farmList.length}</h3>
            </div>
            <span className="count_bottom"></span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="x_panel">
          <div className="x_content">
            <div>
              <h2>รายชื่อฟาร์ม</h2>
            </div>
            <div
              className="profile_details"
              style={{
                display: "flex",
                gap: "40px",
                maxWidth: "100%",
                flexFlow: "row wrap",
              }}
            >
              {farmList.map((farm, index) => {
                return (
                  <div
                    key={index}
                    className="well profile_view"
                    style={{ minWidth: "300px", width: "350px" }}
                  >
                    <div className="col-sm-12">
                      <h4 className="brief">ฟาร์ม {index + 1}</h4>
                      <div className="left col-md-7 col-sm-7">
                        <h2>{farm.name}</h2>
                        <p>
                          <strong>จังหวัด: </strong> {farm.location}
                        </p>
                        <ul className="list-unstyled">
                          <li>
                            <i className="fa fa-heart"></i> {farm.type}
                          </li>
                        </ul>
                      </div>
                      <div className="right col-md-5 col-sm-5 text-center">
                        <Image src="/farm.png" width={64} height={64} />
                      </div>
                    </div>
                    <div className=" bottom text-left">
                      <div className=" col">
                        <button
                          style={{ marginBottom: "20px" }}
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            router.push(`/farm/${index + 1}?farm=${farm.name}`)
                          }
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
organizid.Layout = Layout;