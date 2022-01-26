import React from "react";
import Image from "next/image";

export default function resetpass() {
  async function resetPass() {
    var newpass = document.getElementById("newPass").value;
    var repass = document.getElementById("rePass").value;
    const resetpassres = await axios.post(
      "",
      { data: "" }.catch((error) => {
        console.log(error.response);
      })
    );
    console.log(resetpassres);
  }
  return (
    <body className="login">
      <div>
        <div className="login_wrapper">
          <div className="animate form login_form">
            <section className="login_content">
              <form>
                <Image src="/supercrops.png" height="80px" width="80px" />
                <h1>สร้างรหัสผ่านใหม่</h1>
                <div>
                  <p>อีเมล: UserEmail</p>
                  <input
                    id="newPass"
                    type="password"
                    className="form-control"
                    placeholder="รหัสผ่านใหม่"
                    required=""
                  />
                </div>
                <div>
                  <input
                    id="rePass"
                    type="password"
                    className="form-control"
                    placeholder="ยืนยันรหัสผ่าน"
                    required=""
                  />
                </div>
                <div>
                  <button
                    className="btn btn-primary submit"
                    style={{ color: "white" }}
                    onClick={resetPass}
                  >
                    ยืนยันรหัสผ่าน
                  </button>
                </div>

                <div className="clearfix"></div>

                <div className="separator">
                  <div>
                    <h1>
                      <i className="fa fa-home"></i> kitforward.co.th
                    </h1>
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
      </div>
    </body>
  );
}
