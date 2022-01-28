import axios from "axios";
import { React, useEffect } from "react";

export default function testapi() {
  async function testclick() {
    const logininfo = JSON.parse(localStorage.logininfo);
    const profileres = await axios.post(
      "http://80d9-2001-fb1-61-6ff2-3deb-b5ca-acd3-3713.ngrok.io/api/user/getprofile",
      { _id: logininfo.id },
      { headers: { "x-access-token": logininfo.accessToken } }
    );
    console.log(profileres);
  }

  return (
    <div>
      <button onClick={testclick}>click</button>
    </div>
  );
}
