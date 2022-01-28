import React from "react";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import axios from "axios";

export default function login(props) {
  async function login() {
    var username = document.getElementById("login_email").value;
    var password = document.getElementById("login_pass").value; /*
    await axios
    .post(
      "http://80d9-2001-fb1-61-6ff2-3deb-b5ca-acd3-3713.ngrok.io/api/auth/signin",
      { username: "test1", password: "012345678" }
    )
    .catch((error) => {
      console.log(error);
    })
    .then((res) => {
      localStorage.setItem("logininfo", JSON.stringify(res.data));
      props.setorgID("Oc780373b0fa34391a5f987cc095f680a");
      props.setLogin(true);
      router.push("/");
    });*/
    props.setorgID("Oc780373b0fa34391a5f987cc095f680a");
    props.setLogin(true);
    router.push("/");
  }
  async function logintest() {
    var email = document.getElementById("login_email").value;
    var pass = document.getElementById("login_pass").value;
    console.log(email + pass);
    const loginres = await axios
      .post(
        "http://80d9-2001-fb1-61-6ff2-3deb-b5ca-acd3-3713.ngrok.io/api/auth/signin",
        { username: "test1", password: "012345678" }
      )
      .catch((error) => {
        console.log(error);
      });
    localStorage.setItem("logininfo", JSON.stringify(loginres.data));

    router.push("/testapi");
  }
  function register() {
    var username = document.getElementById("reg_Username").value;
    var email = document.getElementById("reg_email").value;
    var phone = document.getElementById("reg_phone").value;
    var pass = document.getElementById("reg_pass").value;
    var repass = document.getElementById("reg_repass").value;
    if (pass != repass) {
      alert("Password doesn't match!");
    } else {
      alert(username + " " + email + " " + phone + " " + pass + " " + repass);
    }
  }
  async function resetpass() {
    var email = document.getElementById("reset_email").value;
    const resetreqres = await axios.post(
      "",
      { data: "" }.catch((error) => {
        console.log(error.response);
      })
    );
    console.log(resetreqres);
  }
  return (
    <body style={{ backgroundColor: "white", width: "100vw", height: "100vh" }}>
      <a className="hiddenanchor" id="signup"></a>
      <a className="hiddenanchor" id="signin"></a>
      <a className="hiddenanchor" id="repassword"></a>

      <div className="login_wrapper" style={{ backgroundColor: "white" }}>
        <div className="animate form login_form">
          <section className="login_content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div>
                <Image src="/supercrops.png" height="80px" width="80px" />
              </div>
              <h1>ลงชื่อเข้าใช้งาน</h1>
              <div>
                <input
                  id="login_email"
                  type="text"
                  className="form-control"
                  placeholder="อีเมล"
                  required=""
                />
              </div>
              <div>
                <input
                  id="login_pass"
                  type="password"
                  className="form-control"
                  placeholder="รหัสผ่าน"
                  required=""
                />
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={login}
                  style={{ color: "white" }}
                >
                  เข้าสู่ระบบ
                </button>
              </div>

              <div className="clearfix"></div>

              <div className="separator">
                <p className="change_link">
                  <a
                    href="#signup"
                    className="to_register"
                    style={{ fontSize: "16px" }}
                  >
                    สร้างบัญชี
                  </a>
                </p>
                <p className="change_link">
                  <a
                    className="to_register"
                    href="#repassword"
                    style={{ fontSize: "16px" }}
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </p>

                <div className="clearfix"></div>
                <br />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <a
                    href="http://kitforward.co.th/
"
                    target="_blank"
                  >
                    <h1>
                      <i className="fa fa-home"></i> kitforward.co.th
                    </h1>
                  </a>
                </div>
                <div className="">
                  © 2021{" "}
                  <a
                    href="http://kitforward.co.th/
"
                    target="_blank"
                  >
                    KITFORWARD.CO.TH
                  </a>{" "}
                  . All rights reserved
                </div>
              </div>
            </div>
          </section>
        </div>

        <div id="register" className="animate form registration_form">
          <section className="login_content">
            <form>
              <Image src="/supercrops.png" height="80px" width="80px" />
              <h1>สร้างบัญชี</h1>
              <div>
                <input
                  id="reg_Username"
                  type="text"
                  className="form-control"
                  placeholder="ชื่อ"
                  required=""
                />
              </div>
              <div>
                <input
                  id="reg_email"
                  type="email"
                  className="form-control"
                  placeholder="อีเมล"
                  required=""
                />
              </div>
              <div>
                <input
                  id="reg_phone"
                  type="text"
                  className="form-control"
                  placeholder="โทรศัพท์"
                  required=""
                />
              </div>
              <div>
                <input
                  id="reg_pass"
                  type="password"
                  className="form-control"
                  placeholder="รหัสผ่าน"
                  required=""
                />
              </div>
              <div>
                <input
                  id="reg_repass"
                  type="password"
                  className="form-control"
                  placeholder="ยืนยันรหัส"
                  required=""
                />
              </div>
              <div>
                <button
                  className="btn btn-primary submit"
                  onClick={register}
                  style={{ color: "white" }}
                >
                  สร้างบัญชี
                </button>
              </div>

              <div className="clearfix"></div>

              <div className="separator">
                <p className="change_link">
                  <a
                    href="#signin"
                    className="to_register"
                    style={{ fontSize: "16px" }}
                  >
                    ลงชื่อเข้าใช้
                  </a>
                </p>

                <div className="clearfix"></div>
                <br />

                <div>
                  <a
                    href="http://kitforward.co.th/
"
                    target="_blank"
                  >
                    <h1>
                      <i className="fa fa-home"></i> kitforward.co.th
                    </h1>
                  </a>
                  <div className="">
                    © 2021{" "}
                    <a
                      href="http://kitforward.co.th/
"
                      target="_blank"
                    >
                      KITFORWARD.CO.TH
                    </a>{" "}
                    . All rights reserved
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>

        <div id="resetpass" className="animate form repassword_form">
          <section className="login_content">
            <form>
              <Image src="/supercrops.png" height="80px" width="80px" />
              <h1>ขอรหัสผ่านใหม่</h1>
              <div>
                <input
                  id="reset_email"
                  type="email"
                  className="form-control"
                  placeholder="ป้อนอีเมล"
                  required=""
                />
              </div>

              <div>
                <button
                  className="btn btn-primary submit"
                  style={{ color: "white" }}
                  onClick={resetpass}
                >
                  ขอรหัส
                </button>
              </div>

              <div className="clearfix"></div>

              <div className="separator">
                <p className="change_link">
                  <a
                    href="#signin"
                    className="to_register"
                    style={{ fontSize: "16px" }}
                  >
                    ลงชื่อเข้าใช้
                  </a>
                </p>

                <div className="clearfix"></div>
                <br />

                <div>
                  <a
                    href="http://kitforward.co.th/
"
                    target="_blank"
                  >
                    <h1>
                      <i className="fa fa-home"></i> kitforward.co.th
                    </h1>
                  </a>
                  <div className="">
                    © 2021{" "}
                    <a
                      href="http://kitforward.co.th/
"
                      target="_blank"
                    >
                      KITFORWARD.CO.TH
                    </a>{" "}
                    . All rights reserved
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </body>
  );
}
