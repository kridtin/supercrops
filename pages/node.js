import { React, useState, useEffect, useRef } from "react";
import Layout from "../layout/layout";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/node.module.scss";
import { Bar, Scatter, Line } from "react-chartjs-2";
import axios from "axios";
import client from "./api/mqtt.js";
import { getTHsensor } from "../assets/getTHsensor";
import { sensoricon } from "../assets/sensoricon";
import { isDatakeys } from "../assets/isDatakeys";
import Slider from "@mui/material/Slider";
import { connect } from "mqtt";
import { border } from "@mui/system";

export default function node(props) {
  const router = useRouter();
  //const Data = router.query;

  const rand = () => Math.round(Math.random() * 20 - 10);

  const options = {
    responsive: true,
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Date",
          },
          ticks: {
            major: {
              fontStyle: "bold",
              fontColor: "#FF0000",
            },
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "value",
          },
        },
      ],
    },
  };

  const dayactive = {
    backgroundColor: "#007bff",
    padding: "5px",
    borderRadius: "10%",
    color: "white",
  };
  const dayunactive = {
    backgroundColor: "#e4e4e4",
    padding: "5px",
    borderRadius: "10%",
    color: "#7B879C",
  };
  const nodeID = props.nodeID;
  const orgID = props.orgID;
  const farmID = props.farmID;
  /*
  const router = useRouter();
  const Data = router.query;
  const stationIndex = Data.station;
  const nodeIndex = Data.node;
  const relayIndex = 1;

  const farmName = Data.farm;
  if (farmName == undefined) {
    return <div>error</div>;
  }*/
  const [reTime, setreTime] = useState(1800000);
  const [nodeInfo, setnodeInfo] = useState({});
  const [zoneIDlist, setzoneIDlist] = useState([]);
  const [relayIDlist, setrelayIDlist] = useState([]);
  const [relayList, setrelayList] = useState([]);
  const [zoneList, setzoneList] = useState([]);
  const [zoneContent, setzoneContent] = useState([]);
  const [dataList, setdataList] = useState([]);
  const [success, setsuccess] = useState(false);
  const [wait, setwait] = useState(false);
  const [fail, setfail] = useState(false);

  const [dataSelect, setdataSelect] = useState(null);
  const isInitialMount = useRef(true);

  const [mqttStat, setmqttStat] = useState(false);
  const [mqttsending, setmqttsending] = useState(false);
  const [msgSend, setmsgSend] = useState(null);
  const [mqttopic, setmqttopic] = useState(null);

  const [deviceTopic, setdeviceTopic] = useState(null);
  const [devicemsg, setdevicemsg] = useState(null);
  const [onmsg, setonmsg] = useState(0);

  const [graph, setgraph] = useState(true);
  const [failTxt, setfailTxt] = useState("เกิดข้อผิดพลาดบางอย่าง");
  const [graphMode, setgraphMode] = useState([]);
  //graphdata pattern//
  /* const [graphDataList, setgarphDataList] = useState([
    {
      id: "gp01",
      labels: ["a", "a", "a", "a", "a", "a"],
      datasets: [
        {
          label: "data1",
          data: [1, 2, 3, 4, 5, 6],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    },
    {
      id: "gp02",
      labels: ["b", "b", "b", "b", "b", "b"],
      datasets: [
        {
          label: "data2",
          data: [6, 5, 4, 3, 2, 1],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    },
  ]);*/

  const [graphDataList, setgarphDataList] = useState([]);
  const [graphDataSelect, setgarphDataSelect] = useState([]);
  const [graphZone, setgraphZone] = useState([]);

  const [dataValue, setdataValue] = useState([]);
  const [dataRelay, setdataRelay] = useState("");

  const [garphData, setgarphData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "rgb(0, 219, 65)",
      },
    ],
  });
  const [dataPoint, setdataPoint] = useState("");

  function changeGraphColor(index, color) {
    let tempState = graphDataList;
    let tempGraph = tempState[index];
    tempGraph.datasets[0].backgroundColor = color;
    tempState[index] = tempGraph;
    setgarphDataList(tempState);
  }

  function updategraphZone(index, id) {
    const _zoneindex = document.getElementById(id).value;

    let temp_state = graphZone;
    let temp_element = temp_state[index];
    temp_element = { index: _zoneindex };
    temp_state[index] = temp_element;

    setgraphZone((graphZone) => [...temp_state]);
  }
  function updategraphMode(index, id) {
    const _mode = document.getElementById(id).value;
    let temp_state = graphMode;
    temp_state[index] = _mode;

    setgraphMode((graphMode) => [...temp_state]);
  }
  function resetmqtt() {
    setmsgSend(null);
    setmqttopic(null);
  }
  function genid(length) {
    var result = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  }

  function addgraph(func) {
    var genid = 1;
    while (genid) {
      var newid = func(16);
      for (let i = 0; i < graphDataList.length; i++) {
        if (graphDataList[i].id === newid) {
          genid = 1;
        }
      }
      genid = 0;
    }
    var newGraph = {
      id: "graph" + newid,
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          //borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    setgarphDataList((graphDataList) => [...graphDataList, newGraph]);
    setgraphMode((graphMode) => [...graphMode, 1]);
  }
  async function updateRelay() {
    console.log("Updating relay: ");
    const _orgID = localStorage.getItem("_orgID");
    const _farmID = localStorage.getItem("_farmID");
    const _nodeID = localStorage.getItem("_nodeID");
    var _relayList = [];

    const nodeInfo = await axios
      .post(`http://203.151.136.127:10001/api/${_farmID}/n/${_nodeID}`, {
        orgId: _orgID,
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
    const relayIdList = nodeInfo.data.relayIDlist;
    for (let i = 0; i < relayIdList.length; i++) {
      const _id = relayIdList[i];
      const _relay = await axios.post(
        `http://203.151.136.127:10001/api/${_farmID}/relay`,
        {
          orgId: _orgID,
          relayId: _id,
        }
      );
      _relayList.push(_relay.data);
    }
    console.log(relayIdList);
    console.log(_relayList);
    setrelayList(_relayList);
    console.log("Update success relay: ");
  }
  async function getGraphDataConfig(zoneindex, data, index, mode) {
    const _orgID = localStorage.getItem("_orgID");

    const zoneID = zoneIDlist[zoneindex];
    const colorHex = document.getElementById("colorpicked" + index).value;

    if (mode == 1) {
      const time = document.getElementById("gtime0" + index).value;
      const time1send = parseInt(new Date().getTime() / 1000) - time * 60 * 60;
      const time2send = parseInt(new Date().getTime() / 1000);
      const reqdata = {
        orgId: _orgID,
        tsdbToken:
          "YVTWev3u1OiqnX4rK7BUSExsYdHucUdCF6_90x4DgP_vHuIJjkh3Bi0XjqbUUwqln_KsLtnuS--8YqECk1C2SA==",
        zoneId: zoneID,
        graphData: data,
        time1: time1send,
        time2: time2send,
      };
      const _datapoint = await axios
        .post(
          `http://203.151.136.127:10002/api/tsdb/service/F184b91fec195443c829aaaebcdaeae16/N1f8003e446ef4e6eaacb06551796f412`,
          reqdata
        )
        .catch((error) => {
          if (error) {
            console.log("tsdb requset error");
            console.log(error);
            console.log("time 2:" + parseInt(new Date().getTime() / 1000));
            console.log(
              "time 1 :" +
                parseInt((new Date().getTime() - 96 * 60 * 60 * 1000) / 1000)
            );
          } else {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
      let _garphData = {
        labels: [],
        datasets: [],
      };
      let adata = {
        label: "",
        data: [],
        backgroundColor: colorHex,
      };
      for (let i = 0; i < _datapoint.data.length; i++) {
        const data = _datapoint.data[i];
        const atime = new Date(data._time);
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const akey = keys[i];
          if (isDatakeys(akey)) {
            adata.label = getTHsensor(akey).name;
            adata.data.push(data[akey]);
          }
        }
        _garphData.labels.push(
          `${atime.getDate()}/${
            atime.getMonth() + 1
          } | ${atime.getHours()}:${atime.getMinutes()}`
        );
      }
      let temp_state = graphDataList;
      _garphData.id = temp_state[index].id;
      _garphData.datasets.push(adata);
      console.log(_garphData);
      temp_state[index] = _garphData;
      setgarphDataList((graphDataList) => [...temp_state]);
    } else if (mode == 2) {
      const time = [
        document.getElementById("gtime1" + index).value,
        document.getElementById("gtime2" + index).value,
      ];
      if (time[0] == "" || time[1] == "") {
        return "";
      } else {
        const time1send = getTimestamp(time[0]) / 1000;
        const time2send = getTimestamp(time[1]) / 1000;
        const reqdata = {
          orgId: _orgID,
          tsdbToken:
            "YVTWev3u1OiqnX4rK7BUSExsYdHucUdCF6_90x4DgP_vHuIJjkh3Bi0XjqbUUwqln_KsLtnuS--8YqECk1C2SA==",
          zoneId: zoneID,
          graphData: data,
          time1: time1send,
          time2: time2send,
        };
        const _datapoint = await axios
          .post(
            `http://203.151.136.127:10002/api/tsdb/service/F184b91fec195443c829aaaebcdaeae16/N1f8003e446ef4e6eaacb06551796f412`,
            reqdata
          )
          .catch((error) => {
            if (error) {
              console.log("tsdb requset error");
              console.log(error);
              console.log("time 2:" + parseInt(new Date().getTime() / 1000));
              console.log(
                "time 1 :" +
                  parseInt((new Date().getTime() - 96 * 60 * 60 * 1000) / 1000)
              );
            } else {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          });
        let _garphData = {
          labels: [],
          datasets: [],
          id: "123",
        };
        let adata = {
          label: "",
          data: [],
          backgroundColor: colorHex,
        };
        for (let i = 0; i < _datapoint.data.length; i++) {
          const data = _datapoint.data[i];
          const atime = new Date(data._time);
          const keys = Object.keys(data);
          for (let i = 0; i < keys.length; i++) {
            const akey = keys[i];
            if (isDatakeys(akey)) {
              adata.label = getTHsensor(akey).name;
              adata.data.push(data[akey]);
            }
          }
          _garphData.labels.push(
            `${atime.getDate()}/${
              atime.getMonth() + 1
            } | ${atime.getHours()}:${atime.getMinutes()}`
          );
        }
        let temp_state = graphDataList;
        _garphData.id = temp_state[index].id;
        _garphData.datasets.push(adata);
        console.log(_garphData);
        temp_state[index] = _garphData;
        setgarphDataList((graphDataList) => [...temp_state]);
      }
    } else {
    }
  }
  function getTimestamp(time) {
    if (time == undefined) {
      console.log("undefined");
    } else if (time == "") {
      console.log("time = ''");
    } else {
      var dateString = time,
        dateTimeParts = dateString.split("T"),
        timeParts = dateTimeParts[1].split(":"),
        dateParts = dateTimeParts[0].split("-"),
        date;

      date = new Date(
        dateParts[0],
        parseInt(dateParts[1], 10) - 1,
        dateParts[2],
        timeParts[0],
        timeParts[1]
      );

      return date;
    }
  }
  async function getGraphData(zoneindex, data, index) {
    const _orgID = localStorage.getItem("_orgID");

    const zoneID = zoneIDlist[zoneindex];
    console.log(graphDataList);
    const time1send = parseInt(new Date().getTime() / 1000) - 6 * 60 * 60;
    const time2send = parseInt(new Date().getTime() / 1000);
    const reqdata = {
      orgId: _orgID,
      tsdbToken:
        "YVTWev3u1OiqnX4rK7BUSExsYdHucUdCF6_90x4DgP_vHuIJjkh3Bi0XjqbUUwqln_KsLtnuS--8YqECk1C2SA==",
      zoneId: zoneID,
      graphData: data,
      time1: time1send,
      time2: time2send,
    };

    console.log(reqdata);
    const _datapoint = await axios
      .post(
        `http://203.151.136.127:10002/api/tsdb/service/F184b91fec195443c829aaaebcdaeae16/N1f8003e446ef4e6eaacb06551796f412`,
        reqdata
      )
      .catch((error) => {
        if (error) {
          console.log("tsdb requset error");
          console.log(error);
          console.log("time 2:" + parseInt(new Date().getTime() / 1000));
          console.log(
            "time 1 :" +
              parseInt((new Date().getTime() - 96 * 60 * 60 * 1000) / 1000)
          );
        } else {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    const aztime1 = new Date().getTime() - 90 * 24 * 60 * 60 * 1000;
    const aztime2 = new Date().getTime();
    const ztime1 = new Date(time1send * 1000);
    const ztime2 = new Date(time2send * 1000);
    console.log("time 1 :" + ztime1 + "=>" + time1send);
    console.log("time 2 :" + ztime2 + "=>" + time2send);
    //console.log("Data point: ");

    //console.log(_datapoint);
    //setdataPoint(_datapoint);
    console.log(_datapoint);

    let _garphData = {
      labels: [],
      datasets: [],
    };
    let adata = {
      label: "",
      data: [],
      backgroundColor: "rgb(0, 219, 65)",
    };

    for (let i = 0; i < _datapoint.data.length; i++) {
      const data = _datapoint.data[i];
      const atime = new Date(data._time);
      const keys = Object.keys(data);

      for (let i = 0; i < keys.length; i++) {
        const akey = keys[i];
        if (isDatakeys(akey)) {
          adata.label = getTHsensor(akey).name;
          adata.data.push(data[akey]);
        }
      }
      _garphData.labels.push(
        `${atime.getDate()}/${
          atime.getMonth() + 1
        } | ${atime.getHours()}:${atime.getMinutes()}`
      );
    }
    _garphData.datasets.push(adata);
    console.log(_garphData);

    let temp_state = graphDataList;
    temp_state[index] = _garphData;

    setgarphDataList((graphDataList) => [...temp_state]);
  }

  async function getRelayID() {
    const _orgID = localStorage.getItem("_orgID");
    const _farmID = localStorage.getItem("_farmID");
    const _nodeID = localStorage.getItem("_nodeID");
    const nodeInfo = await axios
      .post(`http://203.151.136.127:10001/api/${_farmID}/n/${_nodeID}`, {
        orgId: _orgID,
      })
      .catch((error) => {
        /*
      localStorage.clear();
      window.location.assign("/login");*/
        //console.log(error.response.data);
        //console.log(error.response.status);
        //console.log(error.response.headers);
        console.log("getRelayID Error");
      });
    const nodeInfores = nodeInfo.data;
    console.log(nodeInfores);

    return nodeInfores.relayIDlist;
  }

  async function getRaley() {}

  //=======================================//
  //=============Supsciption===============//
  //=======================================//
  useEffect(async () => {
    const _orgID = localStorage.getItem("_orgID");
    const _farmID = localStorage.getItem("_farmID");
    const _nodeID = localStorage.getItem("_nodeID");
    const relayidlist = await getRelayID();

    for (let index = 0; index < relayidlist.length; index++) {
      const relay = relayidlist[index];
      //console.log(relay);
      client.subscribe(`/front/control/${_farmID}/${relay}`);
      client.subscribe(`/front/time_fn/${_farmID}/${relay}`);
      client.subscribe(`/front/set_time1/${_farmID}/${relay}`);
      client.subscribe(`/front/set_time2/${_farmID}/${relay}`);
      client.subscribe(`/front/set_time3/${_farmID}/${relay}`);
      client.subscribe(`/front/data_fn/${_farmID}/${relay}`);
      client.subscribe(`/front/set_data1/${_farmID}/${relay}`);
    }
    reloadData();
  }, []);

  //=======================================//
  //=======================================//
  /*
  useEffect(() => {
    if (mqttsending == true) {
      if (deviceTopic == mqttopic) {
        if (devicemsg == msgSend) {
          setwait(false);
          setsuccess(true);
          setmqttsending(false);
        } else {
          setwait(false);
          setfail(true);
          setmqttsending(false);
        }
      } else {
        console.log("fail");
        setmqttsending(false);
        setmqttsending(true);
      }
    }
  }, [mqttStat]);*/

  //=======================================//
  //=======================================//
  //=======================================//
  async function reloadData() {
    console.log("reloading");
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
    }
    const _orgID = localStorage.getItem("_orgID");
    const _farmID = localStorage.getItem("_farmID");
    const _nodeID = localStorage.getItem("_nodeID");
    const nodeInfo = await axios
      .post(`http://203.151.136.127:10001/api/${_farmID}/n/${_nodeID}`, {
        orgId: _orgID,
      })
      .catch((error) => {
        /*
        localStorage.clear();
        window.location.assign("/login");*/
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
    const nodeInfores = nodeInfo.data;

    setnodeInfo(nodeInfores);
    setzoneIDlist(nodeInfores.zoneIDlist);
    setrelayIDlist(nodeInfores.relayIDlist);
    let z_list = [];
    let z_cont = [];
    for (let j = 0; j < nodeInfores.zoneIDlist.length; j++) {
      const zoneID = nodeInfores.zoneIDlist[j];
      const zoneres = await axios
        .post(`http://203.151.136.127:10001/api/${_farmID}/data`, {
          orgId: _orgID,
          zoneId: zoneID,
        })
        .catch((error) => {
          /*
          localStorage.clear();
          window.location.assign("/login");*/

          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        });
      const _zdata = [];
      for (var key in zoneres.data[0]) {
        if (zoneres.data[0].hasOwnProperty(key)) {
          _zdata.push([key, zoneres.data[0][key]]);
        }
      }
      z_list.push(_zdata);
      z_cont.push(false);
    }
    setzoneContent(z_cont);
    setzoneList(z_list);
    var datalist = z_list;
    //console.log(z_list);

    setdataList(datalist);
    let r_list = [];
    for (let i = 0; i < nodeInfores.relayIDlist.length; i++) {
      const relayID = nodeInfores.relayIDlist[i];
      const relay = await axios.post(
        `http://203.151.136.127:10001/api/${_farmID}/relay`,
        {
          orgId: _orgID,
          relayId: relayID,
        }
      );

      // set ค่า timefunction และ datafunction ด้วยตัวเอง
      //relay.data.dataFunction = true;
      //relay.data.timeFunction = true;
      //=========================================
      r_list.push(relay.data);
    }
    setrelayList(r_list);
    setdataSelect(null);
    console.log(r_list);
    setonmsg(onmsg + 1);
  }

  //=======================================//
  // ON Recive message from device //
  //=======================================//

  useEffect(() => {
    client.on("message", function (topic, message) {
      const msgJson = JSON.parse(message.toString());
      const _topic = topic.toString();
      const _relayID = _topic.substring(_topic.length - 33, _topic.length);
      //console.log("relayID is  => " + _relayID);
      //console.log(message.toString());
      const waitingstatus = document.getElementById("Waiting").style.display;

      if (waitingstatus == "block") {
        if (msgJson.status == "success") {
          updateRelay();
          //reloadData();
        }
        setwait(false);
        setsuccess(true);
        setmqttsending(false);
        //setonmsg(onmsg + 1);
      } else {
        if (msgJson.status == "success") {
          updateRelay();
          //reloadData();
        }
        setonmsg(onmsg + 1);
      }
    });
  }, []);

  function putData(data, relayID, method) {
    const _farmID = localStorage.getItem("_farmID");
    const _nodeID = localStorage.getItem("_nodeID");
    if (method == "status") {
      axios
        .put(
          `http://203.151.136.127:10001/api/update/${_farmID}/${relayID}/status`,
          data
        )
        .then((res) => {
          console.log(data);
          console.log(res.data);
          reloadData();
        });
    } else if (method == "time") {
      axios
        .put(
          `http://203.151.136.127:10001/api/update/${_farmID}/${relayID}/time`,
          data
        )
        .then((res) => {
          console.log(data);
          console.log(res.data);
          reloadData();
        });
    } else if (method == "data") {
      axios
        .put(
          `http://203.151.136.127:10001/api/update/${_farmID}/${relayID}/data`,
          data
        )
        .then((res) => {
          console.log(data);
          console.log(res.data);
          reloadData();
        });
    } else {
      console.log("Put Method incorrect");
      reloadData();
    }
  }

  function zoneToggle(index) {
    const content = document.getElementById("zidContent" + index);
    const icon = document.getElementById("zicon" + index);
    if (icon.className == "fa fa-chevron-up") {
      icon.className = "fa fa-chevron-down";
      content.style.display = "none";
    } else {
      icon.className = "fa fa-chevron-up";
      content.style.display = "block";
    }
  }
  function relaysetting(index) {
    const settingbox = document.getElementById("rlSetting" + index);
    if (settingbox.className == "dropdown-menu") {
      settingbox.className = "dropdown-menu show";
    } else {
      settingbox.className = "dropdown-menu";
    }
  }
  function dataChange(event, newValue) {
    setdataValue(newValue);
  }
  function rangeData(id, relayIndex) {
    const value = document.getElementById(id).value;
    //document.getElementById(id + "text").innerHTML = value;
    //document.getElementById(id + "text").value = value;
    document.getElementById("data1min" + relayIndex + "text").innerHTML =
      value[0];
    document.getElementById("data1max" + relayIndex + "text").innerHTML =
      value[1];
    document.getElementById("data1min" + relayIndex + "text").value = value[0];
    document.getElementById("data1max" + relayIndex + "text").value = value[1];
  }
  function modalOn(id) {
    const modal = document.getElementById(id);
    modal.style.display = "block";
  }
  function modalOff(id) {
    const modal = document.getElementById(id);
    modal.style.display = "none";
  }
  function putDataSetting(relay, relayIndex, relayID) {
    const _orgId = localStorage.getItem("_orgID");
    const _dataFunction = document.getElementById(
      "dStatus" + relayIndex
    ).checked;
    const _data1Select = document.getElementById(
      "dataSelect1" + relayIndex
    ).value;
    const _dataCheck = document.getElementById("d1Status" + relayIndex).checked;
    if (_dataCheck) {
      var _data1Status = true;
    } else {
      var _data1Status = false;
    }
    const _data1min = document.getElementById("data1min" + relayIndex).value;
    const _data1max = document.getElementById("data1max" + relayIndex).value;

    if (_dataFunction) {
      var dataFunction = "true";
    } else {
      var dataFunction = "false";
    }
    if (_data1Status) {
      var data1Status = "true";
    } else {
      var data1Status = "false";
    }
    const _putdata = {
      orgId: _orgId,
      dataFunction: dataFunction,
      data1: {
        status: data1Status,
        data: _data1Select,
        min: parseInt(_data1min),
        max: parseInt(_data1max),
      },
    };
    const putmethod = "data";
    //putData(_putdata, relayID, putmethod);
    modalOff("modalstyleData" + relayIndex);
  }
  function putminiData(relayIndex, relayID, dataIndex) {
    const _farmID = localStorage.getItem("_farmID");
    const _orgId = localStorage.getItem("_orgID");
    const zoneindex = document.getElementById("selectzone" + relayIndex).value;
    console.log("zone index " + zoneindex);
    if (zoneindex == -1) {
      setfail(true);
      setfailTxt("กรุณาเลือกโซน");
    } else {
      const zoneID = zoneIDlist[zoneindex];
      const _dataFunction = document.getElementById(
        "dStatus" + relayIndex
      ).checked;
      const _dataCheck = document.getElementById(
        "d" + dataIndex + "Status" + relayIndex
      ).checked;
      if (_dataCheck) {
        var _dataStatus = "true";
      } else {
        var _dataStatus = "false";
      }
      const _dataSelect = document.getElementById(
        "dataSelect" + dataIndex + relayIndex
      ).value;

      if (_dataSelect == -1) {
        setfail(true);
        setfailTxt("กรุณาเลือกชนิดข้อมูล");
      } else {
        const _compareSelect = document.getElementById(
          "compare" + relayIndex
        ).value;
        if (_compareSelect == -1) {
          setfail(true);
          setfailTxt("กรุณาเลือกรูปแบบการทำงาน");
        } else {
          const _datamin = dataValue[0];
          const _datamax = dataValue[1];
          if (_datamin >= _datamax) {
            setfail(true);
            setfailTxt("ข้อมูลไม่ถูกต้อง");
          } else {
            const putmethod = "data";
            if (dataIndex == 1) {
              const _putdata = {
                data1: {
                  status: _dataStatus,
                  data: _dataSelect,
                  max: parseInt(_datamax),
                  min: parseInt(_datamin),
                  zoneId: zoneID,
                  compare: _compareSelect,
                },
              };
              console.log(_putdata);
              client.publish(
                `/set_data1/${_farmID}/${relayID}`,
                JSON.stringify(_putdata),
                function (err) {
                  if (!err) {
                    console.log("!!****=Publiching Data=****!!");
                    console.log(_putdata);
                    console.log("=============================");
                    setwait(true);
                    setmqttopic(`/front/set_data1/${_farmID}/${relayID}`);
                    setmsgSend(JSON.stringify(_putdata));
                    setonmsg(onmsg + 1);
                    setmqttsending(true);
                  } else {
                    console.log(err);
                  }
                }
              );
              //console.log(_putData);
              //putData(_putdata, relayID, putmethod);
            } else {
              console.log("put data error");
            }
          }
        }
      }
    }
  }
  function putTimeSetting(relayIndex, relayID) {
    const _orgId = localStorage.getItem("_orgID");
    const _timeFunction = document.getElementById(
      "tStatus" + relayIndex
    ).checked;
    const time1on = document.getElementById("time1on" + relayIndex).value;
    const time1off = document.getElementById("time1off" + relayIndex).value;
    const time2on = document.getElementById("time2on" + relayIndex).value;
    const time2off = document.getElementById("time2off" + relayIndex).value;
    const time3on = document.getElementById("time3on" + relayIndex).value;
    const time3off = document.getElementById("time3off" + relayIndex).value;

    const time1 = [];
    const time2 = [];
    const time3 = [];
    const time1check = document.getElementById("t1Status" + relayIndex).checked;
    const time2check = document.getElementById("t2Status" + relayIndex).checked;
    const time3check = document.getElementById("t3Status" + relayIndex).checked;

    if (time1check) {
      time1.push(1);
      time1.push(time1on);
      time1.push(time1off);
    } else {
      time1.push(0);
      time1.push(time1on);
      time1.push(time1off);
    }
    if (time2check) {
      time2.push(1);
      time2.push(time2on);
      time2.push(time2off);
    } else {
      time2.push(0);
      time2.push(time2on);
      time2.push(time2off);
    }
    if (time3check) {
      time3.push(1);
      time3.push(time3on);
      time3.push(time3off);
    } else {
      time3.push(0);
      time3.push(time3on);
      time3.push(time3off);
    }
    for (let i = 3; i <= 9; i++) {
      const check1 = document.getElementById("t1day" + i + relayIndex).checked;
      const check2 = document.getElementById("t2day" + i + relayIndex).checked;
      const check3 = document.getElementById("t3day" + i + relayIndex).checked;
      if (check1) {
        time1.push(1);
      } else {
        time1.push(0);
      }
      if (check2) {
        time2.push(1);
      } else {
        time2.push(0);
      }
      if (check3) {
        time3.push(1);
      } else {
        time3.push(0);
      }
    }
    const putmethod = "time";
    const _putdata = {
      orgId: _orgId,
      timeFunction: _timeFunction.toString(),
      time1: time1,
      time2: time2,
      time3: time3,
    };
    //putData(_putdata, relayID, putmethod);
    modalOff("modalstyleTime" + relayIndex);
  }

  function timematch(relayid, timeindex, timeon, timeoff, date) {
    for (let i = 0; i < relayList.length; i++) {
      const relay = relayList[i];
      if (relayid == relay.relayID) {
        if (timeindex == 1) {
          var relay_time1 = relay.time2;
          for (let i = 0; i < relay_time1.date.length; i++) {
            const _date = relay_time1.date[i];
            const _timeon = relay_time1.time_on;
            const _timeoff = relay_time1.time_off;
            if (_date == date[i]) {
              if (timeon > _timeon && timeon < _timeoff) {
                return "false";
              } else if (timeon < _timeon && timeoff > _timeon) {
                return "false";
              } else if (timeon == _timeon && timeoff == timeoff) {
                return "false";
              } else {
                return "true";
              }
            }
          }
          var relay_time2 = relay.time3;
          for (let i = 0; i < relay_time2.date.length; i++) {
            const _date = relay_time2.date[i];
            const _timeon = relay_time2.time_on;
            const _timeoff = relay_time2.time_off;
            if (_date == date[i]) {
              if (timeon > _timeon && timeon < _timeoff) {
                return "false";
              } else if (timeon < _timeon && timeoff > _timeon) {
                return "false";
              } else if (timeon == _timeon && timeoff == timeoff) {
                return "false";
              } else {
                return "true";
              }
            }
          }
        } else if (timeindex == 2) {
          var relay_time1 = relay.time1;
          for (let i = 0; i < relay_time1.date.length; i++) {
            const _date = relay_time1.date[i];
            const _timeon = relay_time1.time_on;
            const _timeoff = relay_time1.time_off;
            if (_date == date[i]) {
              if (timeon > _timeon && timeon < _timeoff) {
                return "false";
              } else if (timeon < _timeon && timeoff > _timeon) {
                return "false";
              } else if (timeon == _timeon && timeoff == timeoff) {
                return "false";
              } else {
                return "true";
              }
            }
          }
          var relay_time2 = relay.time3;
          for (let i = 0; i < relay_time2.date.length; i++) {
            const _date = relay_time2.date[i];
            const _timeon = relay_time2.time_on;
            const _timeoff = relay_time2.time_off;
            if (_date == date[i]) {
              if (timeon > _timeon && timeon < _timeoff) {
                return "false";
              } else if (timeon < _timeon && timeoff > _timeon) {
                return "false";
              } else if (timeon == _timeon && timeoff == timeoff) {
                return "false";
              } else {
                return "true";
              }
            }
          }
        } else if (timeindex == 3) {
          var relay_time1 = relay.time2;
          for (let i = 0; i < relay_time1.date.length; i++) {
            const _date = relay_time1.date[i];
            const _timeon = relay_time1.time_on;
            const _timeoff = relay_time1.time_off;
            if (_date == date[i]) {
              if (timeon > _timeon && timeon < _timeoff) {
                return "false";
              } else if (timeon < _timeon && timeoff > _timeon) {
                return "false";
              } else if (timeon == _timeon && timeoff == timeoff) {
                return "false";
              } else {
                return "true";
              }
            }
          }
          var relay_time2 = relay.time1;
          for (let i = 0; i < relay_time2.date.length; i++) {
            const _date = relay_time2.date[i];
            const _timeon = relay_time2.time_on;
            const _timeoff = relay_time2.time_off;
            if (_date == date[i]) {
              if (timeon > _timeon && timeon < _timeoff) {
                return "false";
              } else if (timeon < _timeon && timeoff > _timeon) {
                return "false";
              } else if (timeon == _timeon && timeoff == timeoff) {
                return "false";
              } else {
                return "true";
              }
            }
          }
        }
      }
    }
  }
  function deleteGraph(id) {
    setgarphDataList(graphDataList.filter((value) => value.id !== id));
  }

  async function putminitime(relayIndex, relayID, timeIndex) {
    const _farmID = localStorage.getItem("_farmID");
    const _orgId = localStorage.getItem("_orgID");
    const time = [];
    const timecheck = document.getElementById(
      "t" + timeIndex + "Status" + relayIndex
    ).checked;

    if (timecheck) {
      var _status = "true";
    } else {
      var _status = "false";
    }
    const timeon = document.getElementById(
      "time" + timeIndex + "on" + relayIndex
    ).value;
    const timeoff = document.getElementById(
      "time" + timeIndex + "off" + relayIndex
    ).value;

    if (timeon >= timeoff) {
      setfail(true);
      setfailTxt("ช่วงเวลาไม่ถูกต้อง");
    } else {
      for (let i = 0; i <= 6; i++) {
        const check = document.getElementById(
          "t" + timeIndex + "day" + i + relayIndex
        ).checked;
        if (check) {
          time.push(1);
        } else {
          time.push(0);
        }
      }
      if (timeIndex == 1) {
        const ismatch = await timematch(
          relayID,
          timeIndex,
          timeon,
          timeoff,
          time
        );
        if (ismatch == "false") {
          setfail(true);
          setfailTxt("ช่วงเวลาทับซ้อนกัน");
        } else {
          var _putdata = {
            time1: {
              status: _status,
              time_on: timeon,
              time_off: timeoff,
              date: time,
            },
          };
          client.publish(
            `/set_time1/${_farmID}/${relayID}`,
            JSON.stringify(_putdata),
            function (err) {
              if (!err) {
                console.log("!!****=Publiching Data=****!!");
                console.log(_putdata);
                console.log("=============================");
                console.log(_putdata);
                setwait(true);
                setmqttopic(`/front/set_time1/${_farmID}/${relayID}`);
                setmsgSend(JSON.stringify(_putdata));
                setonmsg(onmsg + 1);
                setmqttsending(true);
              } else {
                console.log(err);
              }
            }
          );
        }
      } else if (timeIndex == 2) {
        const ismatch = await timematch(
          relayID,
          timeIndex,
          timeon,
          timeoff,
          time
        );
        if (ismatch == "false") {
          setfail(true);
          setfailTxt("ช่วงเวลาทับซ้อนกัน");
        } else {
          var _putdata = {
            time2: {
              status: _status,
              time_on: timeon,
              time_off: timeoff,
              date: time,
            },
          };
          client.publish(
            `/set_time2/${_farmID}/${relayID}`,
            JSON.stringify(_putdata),
            function (err) {
              if (!err) {
                console.log(
                  "$******Publich to :" +
                    `/front/set_time1/${_farmID}/${relayID}`
                );
                console.log(_putdata);
                setwait(true);
                setmsgSend(JSON.stringify(_putdata));
                setmqttopic(`/front/set_time2/${_farmID}/${relayID}`);
                setmqttsending(true);
                setonmsg(onmsg + 1);
              } else {
                console.log(err);
              }
            }
          );
        }
      } else if (timeIndex == 3) {
        const ismatch = await timematch(
          relayID,
          timeIndex,
          timeon,
          timeoff,
          time
        );
        if (ismatch == "false") {
          setfail(true);
          setfailTxt("ช่วงเวลาทับซ้อนกัน");
        } else {
          var _putdata = {
            time3: {
              status: _status,
              time_on: timeon,
              time_off: timeoff,
              date: time,
            },
          };
          client.publish(
            `/set_time3/${_farmID}/${relayID}`,
            JSON.stringify(_putdata),
            function (err) {
              if (!err) {
                console.log(
                  "$******Publich to :" +
                    `/front/set_time1/${_farmID}/${relayID}`
                );
                console.log(_putdata);
                setwait(true);
                setmsgSend(JSON.stringify(_putdata));
                setmqttopic(`/front/set_time3/${_farmID}/${relayID}`);
                setmqttsending(true);
                setonmsg(onmsg + 1);
              } else {
                console.log(err);
              }
            }
          );
        }
      } else {
        var _putdata = {
          orgId: _orgId,
        };
        const putmethod = "time";
      }
      modalOff("modalstyleData" + relayIndex);
    }
  }
  function setdataFunction(id, relayID) {
    const _farmID = localStorage.getItem("_farmID");
    const _orgId = localStorage.getItem("_orgID");
    const check = document.getElementById(id).checked;
    if (check) {
      var _putdata = { dataFunction: "true" };
      var _timeFn = { timeFunction: "false" };
    } else {
      var _putdata = { dataFunction: "false" };
      var _timeFn = { timeFunction: "false" };
    }
    client.publish(
      `/data_fn/${_farmID}/${relayID}`,
      JSON.stringify(_putdata),
      function (err) {
        if (!err) {
          console.log("!!****=Publiching Data=****!!");
          console.log(_putdata);
          setwait(true);
          setmqttopic(`/front/data_fn/${_farmID}/${relayID}`);
          setmsgSend(JSON.stringify(_putdata));
          setonmsg(onmsg + 1);
          setmqttsending(true);
        } else {
          console.log(err);
        }
      }
    );
    client.publish(
      `/time_fn/${_farmID}/${relayID}`,
      JSON.stringify(_timeFn),
      function (err) {
        if (!err) {
          console.log("!!****and****!!");
          console.log(_timeFn);
          console.log("=============================");
          setwait(true);
        } else {
          console.log(err);
        }
      }
    );
  }
  function settimeFunction(id, relayID) {
    const _farmID = localStorage.getItem("_farmID");
    const _orgId = localStorage.getItem("_orgID");
    const check = document.getElementById(id).checked;
    if (check) {
      var _putdata = { timeFunction: "true" };
      var _datafn = { dataFunction: "false" };
    } else {
      var _putdata = { timeFunction: "false" };
      var _datafn = { dataFunction: "false" };
    }
    client.publish(
      `/time_fn/${_farmID}/${relayID}`,
      JSON.stringify(_putdata),
      function (err) {
        if (!err) {
          console.log("!!****=Publiching Data=****!!");
          console.log(_putdata);
          setwait(true);
          setmqttopic(`/front/time_fn/${_farmID}/${relayID}`);
          setmsgSend(JSON.stringify(_putdata));
          setmqttsending(true);
          setonmsg(onmsg + 1);
        } else {
          console.log(err);
        }
      }
    );
    client.publish(
      `/data_fn/${_farmID}/${relayID}`,
      JSON.stringify(_datafn),
      function (err) {
        if (!err) {
          console.log("!!****and****!!");
          console.log(_datafn);
          console.log("=============================");
          setwait(true);
        } else {
          console.log(err);
        }
      }
    );
  }
  function changeStatus(id, relayID) {
    const _orgId = localStorage.getItem("_orgID");
    const _farmID = localStorage.getItem("_farmID");
    const check = document.getElementById(id).checked;

    if (check) {
      var status = "true";
    } else {
      var status = "false";
    }
    const _putdata = {
      status: status,
    };
    client.publish(
      `/control/${_farmID}/${relayID}`,
      JSON.stringify(_putdata),
      function (err) {
        if (!err) {
          console.log("!!****=Publiching Data=****!!");
          console.log(_putdata);
          console.log("=============================");
          setwait(true);
          setmsgSend(JSON.stringify(_putdata));
          setmqttopic(`/front/control/${_farmID}/${relayID}`);
          setonmsg(onmsg + 1);
          setmqttsending(true);
        } else {
          console.log(err);
        }
      }
    );
  }
  useEffect(() => {
    const interval = setInterval(function () {
      reloadData();
      console.log("testtime " + reTime);
    }, reTime);
    return () => clearInterval(interval);
  }, [reTime]);
  return (
    <>
      <div
        id={"Waiting"}
        className={styles.modal_wait}
        style={{ display: wait ? "block" : "none" }}
      >
        <div className={styles.waiting}>
          <div className={styles.lds_dual_ring}></div>
          <div></div>
          <div className="color-blue">กำลังดำเนินการ</div>
        </div>
      </div>
      <div
        id={"Success"}
        className={styles.modal_wait}
        style={{ display: success ? "block" : "none" }}
      >
        <div className={styles.waiting}>
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <div className="color-green">สำเร็จ</div>
          <button
            className="btn btn-success"
            onClick={() => {
              setsuccess(!success);
              resetmqtt();
            }}
          >
            ตกลง
          </button>
        </div>
      </div>
      <div
        id={"Fail"}
        className={styles.modal_wait}
        style={{ display: fail ? "block" : "none" }}
      >
        <div className={styles.waiting}>
          <div className="error-banmark">
            <div className="ban-icon">
              <span className="icon-line line-long-invert"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <div className="color-red">ผิดพลาด</div>

          <div className="color-white" style={{ fontSize: "18px" }}>
            {failTxt}
          </div>

          <button
            className="btn btn-danger"
            onClick={() => {
              setfail(!fail);
              setfailTxt("เกิดข้อผิดพลาดบางอย่าง");
            }}
          >
            ปิด
          </button>
        </div>
      </div>
      <div className="row">
        <div className="x_panel">
          <h2>
            <i className="fa fa-home"></i> <Link href="/">หน้าหลัก</Link> /{" "}
            <i className="fa fa-sitemap"></i> <Link href={`/farm`}>ฟาร์ม</Link>{" "}
            / <i className="fa fa-cubes"></i>
            <Link href={`/station`}>โรงเรือน</Link> /{" "}
            <i className="fa fa-dot-circle-o"></i>{" "}
            <Link href={`/node`}>โหนด</Link>
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="x_panel">
          <div className="tile_count">
            <div className="col-md-3 col-sm-6  tile_stats_count">
              <span className="count_top">
                <h2>
                  <strong className="farmname">
                    <i className="fa fa-dot-circle-o" /> โหนด
                  </strong>
                </h2>
              </span>
              <div>
                <h2>
                  <span className="brief">
                    {" "}
                    <i className="fa fa-rss"></i> รหัสโหนด
                  </span>{" "}
                  <label className="nodeid">{nodeInfo.nodeID}</label>
                </h2>
              </div>
            </div>
            <div className="col-md-3 col-sm-6  tile_stats_count">
              <span className="count_top">
                <h2
                  className={nodeInfo.status ? styles.online : styles.offline}
                >
                  <i className="fa fa-circle"></i>{" "}
                  <label style={{ color: "#73879C" }}>การทำงาน</label>
                </h2>
              </span>
              <div>
                <h2>
                  <span className="brief">
                    {" "}
                    <i className="fa fa-exchange"></i> สถานะ
                  </span>{" "}
                  <label
                    className={nodeInfo.status ? styles.online : styles.offline}
                  >
                    {nodeInfo.status ? "ออนไลน์" : "ออฟไลน์"}
                  </label>
                </h2>
              </div>
            </div>
            <div className="col-md-3 col-sm-6  tile_stats_count">
              <span className="count_top">
                <h2>
                  <i className="fa fa-calendar"></i>{" "}
                  <label style={{ color: "#73879C" }}>วันที่สร้าง</label>
                </h2>
              </span>
              <div>
                <h2>
                  <span className="brief">วันที่</span>{" "}
                  <label>04/11/2021</label>
                </h2>
              </div>
            </div>

            <div className="col-md-3 col-sm-6  tile_stats_count">
              <span className="count_top">
                <h2>
                  <i className="fa fa-clock-o"></i> อัพเดตข้อมูล
                </h2>
              </span>
              <div>
                <h2>
                  <select
                    id="refreshTime"
                    className="form-control"
                    style={{ color: "#73879C" }}
                    onChange={() =>
                      setreTime(document.getElementById("refreshTime").value)
                    }
                  >
                    <option value="volvo">เลือกเวลาอัพเดตข้อมูล</option>
                    <option value={5000}>ทุก 5 วินาที</option>
                    <option value={300000}>ทุก 5 นาที</option>
                    <option value={600000}>ทุก 10 นาที</option>
                    <option value={900000}>ทุก 15 นาที</option>
                    <option value={1200000}>ทุก 20 นาที</option>
                    <option value={1500000}>ทุก 25 นาที</option>
                    <option value={1800000}>ทุก 30 นาที</option>
                  </select>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="x_panel">
          <div className="x_title">
            <h2>
              <i className="fa fa-line-chart"></i> กราฟสถิติ{" "}
            </h2>
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a className="collapse-link" onClick={() => setgraph(!graph)}>
                  <i
                    className={
                      graph ? "fa fa-chevron-up" : "fa fa-chevron-down"
                    }
                  ></i>
                </a>
              </li>
            </ul>
            <div className="clearfix"></div>
          </div>
          <div
            className="x_content"
            style={{
              display: graph ? "flex" : "none",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {graphDataList.map((graphdata, graphindex) => {
              console.log(graphDataList);
              return (
                <div
                  key={"graph" + graphindex}
                  id={"graph" + graphindex}
                  style={{
                    border: "solid 0.5px",
                    marginBottom: "10px",
                    borderRadius: "10px",
                    borderColor: "#BEBEBE",
                    padding: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                    }}
                  >
                    {graphindex}เลือกโซน :{" "}
                    <select
                      id={"selectzone_graph" + graphindex}
                      style={{
                        color: "#73879C",
                        height: "30px",
                        marginLeft: "10px",
                        borderColor: "#BEBEBE",
                        borderRadius: "5px",
                      }}
                      onChange={() =>
                        updategraphZone(
                          graphindex,
                          "selectzone_graph" + graphindex
                        )
                      }
                    >
                      <option value={-1}>เลือกโซน</option>
                      {zoneIDlist.map((zone, index) => {
                        return (
                          <option key={"zone" + index} value={index}>
                            โซนที่ {index + 1}
                          </option>
                        );
                      })}
                    </select>
                    <div style={{ marginLeft: "10px" }}>ข้อมูล :</div>
                    {dataList.map((_data, index) => {
                      return (
                        <select
                          key={"data" + index}
                          id={"dataSelect_graph" + graphindex}
                          style={
                            graphZone[graphindex]
                              ? graphZone[graphindex].index == index
                                ? {
                                    color: "#73879C",
                                    height: "30px",
                                    marginLeft: "10px",
                                    borderColor: "#BEBEBE",
                                    borderRadius: "5px",
                                  }
                                : { display: "none" }
                              : { display: "none" }
                          }
                          onChange={() =>
                            getGraphDataConfig(
                              document.getElementById(
                                "selectzone_graph" + graphindex
                              ).value,
                              document.getElementById(
                                "dataSelect_graph" + graphindex
                              ).value,
                              graphindex,
                              document.getElementById("gmode" + graphindex)
                                .value
                            )
                          }
                        >
                          <option value={-1}>เลือกข้อมูล</option>
                          {_data.map((data, index) => {
                            if (data[1] != null) {
                              return (
                                <option key={data[0]} value={data[0]}>
                                  {getTHsensor(data[0]).name}
                                </option>
                              );
                            }
                          })}
                        </select>
                      );
                    })}
                    <select
                      id={"gmode" + graphindex}
                      style={{
                        color: "#73879C",
                        height: "30px",
                        marginLeft: "10px",
                        borderColor: "#BEBEBE",
                        borderRadius: "5px",
                        marginLeft: "auto",
                      }}
                      onChange={() =>
                        updategraphMode(graphindex, "gmode" + graphindex)
                      }
                      disabled={false}
                    >
                      <option value={1} defaultValue={true}>
                        เวลาย้อนหลัง
                      </option>
                      <option value={2}>ช่วงเวลา</option>
                    </select>
                    <select
                      id={"gtime0" + graphindex}
                      onChange={() =>
                        getGraphDataConfig(
                          document.getElementById(
                            "selectzone_graph" + graphindex
                          ).value,
                          document.getElementById(
                            "dataSelect_graph" + graphindex
                          ).value,
                          graphindex,
                          document.getElementById("gmode" + graphindex).value
                        )
                      }
                      style={
                        graphMode[graphindex] == 1
                          ? {
                              color: "#73879C",
                              height: "30px",
                              marginLeft: "10px",
                              borderColor: "#BEBEBE",
                              borderRadius: "5px",
                            }
                          : { display: "none" }
                      }
                      disabled={false}
                    >
                      <option value={1}>1 ชั่วโมง</option>
                      <option value={2}>2 ชั่วโมง</option>
                      <option value={3}>3 ชั่วโมง</option>
                      <option value={4}>4 ชั่วโมง</option>
                      <option value={5}>5 ชั่วโมง</option>
                    </select>
                    <input
                      id={"gtime1" + graphindex}
                      type="datetime-local"
                      onChange={() =>
                        getGraphDataConfig(
                          document.getElementById(
                            "selectzone_graph" + graphindex
                          ).value,
                          document.getElementById(
                            "dataSelect_graph" + graphindex
                          ).value,
                          graphindex,

                          document.getElementById("gmode" + graphindex).value
                        )
                      }
                      style={
                        graphMode[graphindex] == 2
                          ? {
                              border: "solid 1px",
                              color: "#73879C",
                              height: "30px",
                              marginLeft: "10px",
                              borderColor: "#BEBEBE",
                              borderRadius: "5px",
                              outline: "none",
                              minWidth: "50px",
                            }
                          : { display: "none" }
                      }
                      disabled={false}
                    ></input>
                    <input
                      id={"gtime2" + graphindex}
                      type="datetime-local"
                      onChange={() =>
                        getGraphDataConfig(
                          document.getElementById(
                            "selectzone_graph" + graphindex
                          ).value,
                          document.getElementById(
                            "dataSelect_graph" + graphindex
                          ).value,
                          graphindex,

                          document.getElementById("gmode" + graphindex).value
                        )
                      }
                      style={
                        graphMode[graphindex] == 2
                          ? {
                              border: "solid 1px",
                              color: "#73879C",
                              height: "30px",
                              marginLeft: "10px",
                              borderColor: "#BEBEBE",
                              borderRadius: "5px",
                              outline: "none",
                              minWidth: "50px",
                            }
                          : { display: "none" }
                      }
                      disabled={false}
                    ></input>
                    <input
                      id={"colorpicked" + graphindex}
                      type="color"
                      onChange={() =>
                        changeGraphColor(
                          graphindex,
                          document.getElementById("colorpicked" + graphindex)
                            .value
                        )
                      }
                      style={{
                        border: "solid 1px",
                        color: "#73879C",
                        height: "30px",
                        marginLeft: "10px",
                        borderColor: "#BEBEBE",
                        borderRadius: "5px",
                        outline: "none",
                        minWidth: "50px",
                      }}
                    />
                    <button
                      className="btn btn-danger"
                      style={{
                        marginLeft: "10px",
                        border: "none",
                        backgroundColor: "white",
                        outline: "none",
                        color: "grey",
                      }}
                      onClick={() => deleteGraph(graphdata.id)}
                    >
                      x
                    </button>
                  </div>

                  <Line
                    key={graphDataList}
                    data={graphdata}
                    style={{ maxWidth: "100%", maxHeight: "350px" }}
                  />
                </div>
              );
            })}{" "}
            <button
              className="btn btn-primary"
              style={{
                borderRadius: "10px",
              }}
              onClick={() => addgraph(genid)}
            >
              เพิ่มกราฟข้อมูล
            </button>
          </div>
        </div>
      </div>
      <div id="zonebox" className="row">
        <div className="x_panel">
          {zoneList.map((zone, index) => {
            const zIndex = index + 1;

            return (
              <div key={index} className="x_panel" style={{ height: "auto" }}>
                <div className="x_title">
                  <h2>
                    <i className="fa fa-map-marker"></i> โซนที่ {zIndex}
                  </h2>
                  <ul className="nav navbar-right panel_toolbox">
                    <li>
                      <a
                        onClick={() => {
                          zoneToggle(zIndex);
                        }}
                      >
                        <i
                          id={"zicon" + zIndex}
                          className={"fa fa-chevron-down"}
                        ></i>
                      </a>
                    </li>
                  </ul>
                  <div className="clearfix"></div>
                </div>
                <div
                  id={"zidContent" + zIndex}
                  className="x_content"
                  style={{ display: "block" }}
                >
                  <div
                    className="profile_details"
                    style={{
                      display: "flex",
                      gap: "40px",
                      maxWidth: "100%",
                      flexFlow: "row wrap",
                      userSelect: "none",
                    }}
                  >
                    {zone.map((data, _index) => {
                      if (data[1] != null) {
                        return (
                          <div
                            key={_index}
                            className="well profile_view"
                            style={{ minWidth: "220px" }}
                          >
                            <div className="col">
                              <div
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  flexDirection: "row",
                                  minHeight: "70px",
                                }}
                              >
                                <div>
                                  <img
                                    src={sensoricon(data[0])}
                                    height={60}
                                    width={60}
                                  />
                                </div>
                                <div
                                  style={{
                                    marginLeft: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0px",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginLeft: "auto",
                                      marginBottom: "-10px",
                                    }}
                                  >
                                    <label
                                      className="brief"
                                      style={{
                                        fontWeight: "bold",
                                        color: "#AAB6AA",
                                        marginRight: "5px",
                                        fontSize: "24px",
                                      }}
                                    >
                                      {data[1]}
                                    </label>

                                    <label>
                                      {getTHsensor(data[0]).vocabulary}
                                    </label>
                                  </div>
                                  <div>{getTHsensor(data[0]).name} </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div id="relaybox" className="row">
        <div className="x_panel">
          <div className="x_content">
            <div>
              <h2>
                <i className="fa fa-random"></i> รีเลย์
              </h2>
            </div>
            <div
              className="profile_details"
              style={{
                display: "flex",
                gap: "40px",
                widows: "350px",
                minWidth: "300px",
                maxWidth: "100%",
                flexFlow: "row wrap",
                userSelect: "none",
              }}
            >
              {relayList.map((relay, index) => {
                const relayIndex = index + 1;
                const setting = false;
                //console.log(relay);
                return (
                  <div key={index}>
                    <div
                      id={"modalstyleData" + relayIndex}
                      className={styles.modal}
                      style={{ display: "none" }}
                    >
                      <div className="modal-dialog modal-lg">
                        <div
                          className="modal-content"
                          style={{
                            backgroundColor: !relay.dataFunction
                              ? "#eaeaea"
                              : "white",
                          }}
                        >
                          <div className="modal-header">
                            <h2 className="modal-title" id="myModalLabel">
                              ตั้งค่าข้อมูล
                            </h2>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              onClick={() =>
                                modalOff("modalstyleData" + relayIndex)
                              }
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <div
                            className="modal-body"
                            style={{
                              display: "flex",
                              gap: "20px",
                              flexDirection: "column",
                            }}
                          >
                            <div
                              className="col"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "5px",
                                border: "solid 1px #c4c4c4",
                                borderRadius: "10px",
                              }}
                            >
                              <label>
                                <Image
                                  src="/dataSetting.png"
                                  width="30"
                                  height="30"
                                />
                              </label>

                              <h4> ตั้งค่าข้อมูล {"relay " + relayIndex}</h4>
                            </div>

                            <div
                              className="col"
                              style={{
                                display: "flex",
                                gap: "10px",
                                padding: "5px",
                                border: "solid 1px #c4c4c4",
                                borderRadius: "10px",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <label>
                                  <h4>
                                    เลือกโซน :{" "}
                                    <select
                                      id={"selectzone" + relayIndex}
                                      onChange={() =>
                                        setdataSelect(
                                          document.getElementById(
                                            "selectzone" + relayIndex
                                          ).value
                                        )
                                      }
                                      style={{
                                        color: "#73879C",
                                        height: "30px",
                                        marginLeft: "10px",
                                        borderColor: "#BEBEBE",
                                      }}
                                      disabled={
                                        relay.dataFunction ? false : true
                                      }
                                    >
                                      <option value={-1}>เลือกโซน</option>
                                      {zoneList.map((zone, index) => {
                                        return (
                                          <option key={index} value={index}>
                                            โซนที่ {index + 1}
                                          </option>
                                        );
                                      })}
                                    </select>{" "}
                                    ข้อมูล :
                                    {dataList.map((_data, index) => {
                                      return (
                                        <select
                                          key={index}
                                          id={"dataSelect1" + relayIndex}
                                          style={
                                            dataSelect == index
                                              ? {
                                                  color: "#73879C",
                                                  height: "30px",
                                                  marginLeft: "10px",
                                                  borderColor: "#BEBEBE",
                                                }
                                              : { display: "none" }
                                          }
                                          disabled={
                                            relay.dataFunction ? false : true
                                          }
                                        >
                                          <option value={-1}>
                                            เลือกข้อมูล
                                          </option>
                                          {_data.map((data, index) => {
                                            if (data[1] != null) {
                                              return (
                                                <option
                                                  key={index}
                                                  value={data[0]}
                                                >
                                                  {getTHsensor(data[0]).name}
                                                </option>
                                              );
                                            }
                                          })}
                                        </select>
                                      );
                                    })}
                                  </h4>
                                </label>
                                <label
                                  className={styles.switch2}
                                  style={{ marginLeft: "auto" }}
                                >
                                  <input
                                    key={relay.dataFunction}
                                    id={"d1Status" + relayIndex}
                                    type="checkbox"
                                    defaultChecked={
                                      relay.dataFunction
                                        ? relay.data1.status
                                          ? true
                                          : false
                                        : false
                                    }
                                    disabled={relay.dataFunction ? false : true}
                                  />
                                  <span className={styles.slider}></span>
                                </label>
                              </div>
                              <label>
                                <h4>
                                  การทำงาน:{" "}
                                  <select
                                    id={"compare" + relayIndex}
                                    style={{
                                      color: "#73879C",
                                      height: "30px",
                                      marginLeft: "10px",
                                      borderColor: "#BEBEBE",
                                    }}
                                    disabled={relay.dataFunction ? false : true}
                                  >
                                    <option value={-1}>เลือกการทำงาน</option>
                                    <option value={"high"}>
                                      เปิดเมื่อค่ามากกว่า
                                    </option>
                                    <option value={"low"}>
                                      เปิดเมื่อค่าน้อยกว่า
                                    </option>
                                  </select>
                                </h4>
                              </label>
                              <label id={"data1" + relayIndex + "text"}>
                                <h2
                                  className={relay.dataFunction ? "brief2" : ""}
                                >
                                  ค่าน้อยสุด:{" "}
                                  <strong
                                    className={
                                      relay.dataFunction ? "minvalue" : ""
                                    }
                                  >
                                    {dataValue[0]}{" "}
                                    <i className="fa fa-long-arrow-down"></i>
                                  </strong>{" "}
                                  | ค่ามากสุด:{" "}
                                  <strong
                                    className={
                                      relay.dataFunction ? "maxvalue" : ""
                                    }
                                  >
                                    {dataValue[1]}{" "}
                                    <i className="fa fa-long-arrow-up"></i>
                                  </strong>
                                </h2>
                                {/* ค่าน้อยสุด : {dataValue[0]} ค่ามากสุด :{" "}
                                {dataValue[1]} */}
                              </label>

                              <Slider
                                key={`slider-${[
                                  relay.data1.min,
                                  relay.data1.max,
                                ]}`}
                                id="data1"
                                defaultValue={[
                                  relay.data1.min,
                                  relay.data1.max,
                                ]}
                                onChange={dataChange}
                                valueLabelDisplay="auto"
                                disableSwap
                                disabled={relay.dataFunction ? false : true}
                              />

                              <button
                                type="button"
                                className="btn btn-primary"
                                style={
                                  relay.dataFunction
                                    ? {
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "12px",
                                        maxWidth: "80px",
                                      }
                                    : {
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        maxWidth: "80px",
                                        fontSize: "12px",
                                        backgroundColor: "#DDDDDD",
                                        borderColor: "#DDDDDD",
                                        color: "#73879C",
                                      }
                                }
                                onClick={
                                  relay.dataFunction
                                    ? () =>
                                        putminiData(
                                          relayIndex,
                                          relay.relayID,
                                          1
                                        )
                                    : () => {}
                                }
                              >
                                <Image
                                  src="/save_white.png"
                                  width={16}
                                  height={16}
                                />{" "}
                                บันทึก
                              </button>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal"
                              onClick={() =>
                                modalOff("modalstyleData" + relayIndex)
                              }
                            >
                              ปิด
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id={"modalstyleTime" + relayIndex}
                      className={styles.modal}
                      style={{ display: "none" }}
                    >
                      <div
                        className="modal-dialog modal-lg"
                        style={{ maxWidth: "600px" }}
                      >
                        <div
                          className="modal-content"
                          style={{
                            backgroundColor: !relay.timeFunction
                              ? "#eaeaea"
                              : "white",
                          }}
                        >
                          <div className="modal-header">
                            <h2 className="modal-title" id="myModalLabel">
                              ตั้งค่าเวลา
                            </h2>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              onClick={() =>
                                modalOff("modalstyleTime" + relayIndex)
                              }
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <div
                            className="modal-body"
                            style={{
                              display: "flex",
                              gap: "20px",
                              flexDirection: "column",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "5px",
                                border: "solid 1px #c4c4c4",
                                borderRadius: "10px",
                              }}
                            >
                              <label>
                                <Image
                                  src="/datetime.png"
                                  width="30"
                                  height="30"
                                />
                              </label>

                              <h4>ตั้งค่าเวลา {relayIndex}</h4>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                padding: "5px",
                                border: "solid 1px #c4c4c4",
                                borderRadius: "10px",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <label>ตั้งค่าเวลา 1 : เวลาเปิด: </label>
                                <input
                                  id={"time1on" + relayIndex}
                                  type="time"
                                  defaultValue={relay.time1.time_on}
                                  style={{ margin: "10px" }}
                                  disabled={relay.timeFunction ? false : true}
                                />
                                <label> เวลาปิด :</label>
                                <input
                                  id={"time1off" + relayIndex}
                                  type="time"
                                  defaultValue={relay.time1.time_off}
                                  style={{ margin: "10px" }}
                                  disabled={relay.timeFunction ? false : true}
                                />

                                <label
                                  className={styles.switch2}
                                  style={{ marginLeft: "auto" }}
                                >
                                  <input
                                    key={relay.time1.status}
                                    id={"t1Status" + relayIndex}
                                    type="checkbox"
                                    defaultChecked={
                                      relay.time1.status ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <span className={styles.slider}></span>
                                </label>
                              </div>
                              <label>ตั้งค่าวันที่ 1 : </label>
                              <div className={styles.weekday}>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t1day0" + relayIndex}
                                    defaultChecked={
                                      relay.time1.date[0] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t1day0" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    อาทิตย์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t1day1" + relayIndex}
                                    defaultChecked={
                                      relay.time1.date[1] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t1day1" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    จันทร์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t1day2" + relayIndex}
                                    defaultChecked={
                                      relay.time1.date[2] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t1day2" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    อังคาร
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t1day3" + relayIndex}
                                    defaultChecked={
                                      relay.time1.date[3] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t1day3" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    พุธ
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t1day4" + relayIndex}
                                    defaultChecked={
                                      relay.time1.date[4] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t1day4" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    พฤหัส
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t1day5" + relayIndex}
                                    defaultChecked={
                                      relay.time1.date[5] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t1day5" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    ศุกร์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t1day6" + relayIndex}
                                    defaultChecked={
                                      relay.time1.date[6] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t1day6" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    เสาร์
                                  </label>
                                </label>
                              </div>
                              <div>
                                <button
                                  className="btn btn-primary"
                                  style={
                                    relay.timeFunction
                                      ? { fontSize: "12px" }
                                      : {
                                          fontSize: "12px",
                                          backgroundColor: "#DDDDDD",
                                          borderColor: "#DDDDDD",
                                          color: "#73879C",
                                        }
                                  }
                                  onClick={
                                    relay.timeFunction
                                      ? () =>
                                          putminitime(
                                            relayIndex,
                                            relay.relayID,
                                            1
                                          )
                                      : () => {}
                                  }
                                >
                                  บันทึก
                                </button>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                padding: "5px",
                                border: "solid 1px #c4c4c4",
                                borderRadius: "10px",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <label>ตั้งค่าเวลา 2 : เวลาเปิด: </label>
                                <input
                                  id={"time2on" + relayIndex}
                                  type="time"
                                  defaultValue={relay.time2.time_on}
                                  style={{ margin: "10px" }}
                                  disabled={relay.timeFunction ? false : true}
                                />
                                <label> เวลาปิด :</label>
                                <input
                                  id={"time2off" + relayIndex}
                                  type="time"
                                  defaultValue={relay.time2.time_off}
                                  style={{ margin: "10px" }}
                                  disabled={relay.timeFunction ? false : true}
                                />
                                <label
                                  className={styles.switch2}
                                  style={{ marginLeft: "auto" }}
                                >
                                  <input
                                    key={relay.time2.status}
                                    id={"t2Status" + relayIndex}
                                    type="checkbox"
                                    defaultChecked={
                                      relay.time1.status ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <span className={styles.slider}></span>
                                </label>
                              </div>
                              <label>ตั้งค่าวันที่ 2 : </label>
                              <div className={styles.weekday}>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t2day0" + relayIndex}
                                    defaultChecked={
                                      relay.time2.date[0] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t2day0" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    อาทิตย์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    key={relay.time2.date[1]}
                                    type="checkbox"
                                    id={"t2day1" + relayIndex}
                                    defaultChecked={
                                      relay.time2.date[1] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t2day1" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    จันทร์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t2day2" + relayIndex}
                                    defaultChecked={
                                      relay.time2.date[2] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t2day2" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    อังคาร
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t2day3" + relayIndex}
                                    defaultChecked={
                                      relay.time2.date[3] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t2day3" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    พุธ
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t2day4" + relayIndex}
                                    defaultChecked={
                                      relay.time2.date[4] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t2day4" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    พฤหัส
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t2day5" + relayIndex}
                                    defaultChecked={
                                      relay.time2.date[5] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t2day5" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    ศุกร์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t2day6" + relayIndex}
                                    defaultChecked={
                                      relay.time2.date[6] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t2day6" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    เสาร์
                                  </label>
                                </label>
                              </div>
                              <div>
                                <button
                                  className="btn btn-primary"
                                  style={
                                    relay.timeFunction
                                      ? { fontSize: "12px" }
                                      : {
                                          fontSize: "12px",
                                          backgroundColor: "#DDDDDD",
                                          borderColor: "#DDDDDD",
                                          color: "#73879C",
                                        }
                                  }
                                  onClick={
                                    relay.timeFunction
                                      ? () =>
                                          putminitime(
                                            relayIndex,
                                            relay.relayID,
                                            2
                                          )
                                      : () => {}
                                  }
                                >
                                  บันทึก
                                </button>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                padding: "5px",
                                border: "solid 1px #c4c4c4",
                                borderRadius: "10px",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <label>ตั้งค่าเวลา 3 : เวลาเปิด: </label>
                                <input
                                  id={"time3on" + relayIndex}
                                  type="time"
                                  defaultValue={relay.time3.time_on}
                                  style={{ margin: "10px" }}
                                  disabled={relay.timeFunction ? false : true}
                                />
                                <label> เวลาปิด :</label>
                                <input
                                  id={"time3off" + relayIndex}
                                  type="time"
                                  defaultValue={relay.time3.time_off}
                                  style={{ margin: "10px" }}
                                  disabled={relay.timeFunction ? false : true}
                                />
                                <label
                                  className={styles.switch2}
                                  style={{ marginLeft: "auto" }}
                                >
                                  <input
                                    key={relay.time3.status}
                                    id={"t3Status" + relayIndex}
                                    type="checkbox"
                                    defaultChecked={
                                      relay.timeFunction
                                        ? relay.time1.status
                                          ? true
                                          : false
                                        : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <span className={styles.slider}></span>
                                </label>
                              </div>
                              <label>ตั้งค่าวันที่ 3 : </label>
                              <div className={styles.weekday}>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t3day0" + relayIndex}
                                    defaultChecked={
                                      relay.time3.date[0] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t3day0" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    อาทิตย์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t3day1" + relayIndex}
                                    defaultChecked={
                                      relay.time3.date[1] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t3day1" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    จันทร์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t3day2" + relayIndex}
                                    defaultChecked={
                                      relay.time3.date[2] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t3day2" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    อังคาร
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t3day3" + relayIndex}
                                    defaultChecked={
                                      relay.time3.date[3] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t3day3" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    พุธ
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t3day4" + relayIndex}
                                    defaultChecked={
                                      relay.time3.date[4] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t3day4" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    พฤหัส
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t3day5" + relayIndex}
                                    defaultChecked={
                                      relay.time3.date[5] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t3day5" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    ศุกร์
                                  </label>
                                </label>
                                <label>
                                  <input
                                    type="checkbox"
                                    id={"t3day6" + relayIndex}
                                    defaultChecked={
                                      relay.time3.date[6] == 1 ? true : false
                                    }
                                    disabled={relay.timeFunction ? false : true}
                                  />
                                  <label
                                    htmlFor={"t3day6" + relayIndex}
                                    style={
                                      !relay.timeFunction
                                        ? {
                                            backgroundColor: "#dddddd",
                                            color: "#73879C",
                                          }
                                        : {}
                                    }
                                  >
                                    เสาร์
                                  </label>
                                </label>
                              </div>
                              <div>
                                <button
                                  className="btn btn-primary"
                                  style={
                                    relay.timeFunction
                                      ? { fontSize: "12px" }
                                      : {
                                          fontSize: "12px",
                                          backgroundColor: "#DDDDDD",
                                          borderColor: "#DDDDDD",
                                          color: "#73879C",
                                        }
                                  }
                                  onClick={
                                    relay.timeFunction
                                      ? () =>
                                          putminitime(
                                            relayIndex,
                                            relay.relayID,
                                            3
                                          )
                                      : () => {}
                                  }
                                >
                                  บันทึก
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal"
                              onClick={() =>
                                modalOff("modalstyleTime" + relayIndex)
                              }
                            >
                              ปิด
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id={"modalstyletime" + relayIndex}
                      className={styles.modal}
                      style={{ display: "none" }}
                    ></div>
                    <div key={index} className="">
                      <div className="x_panel">
                        <div className="x_title" style={{ display: "flex" }}>
                          <h2>รีเลย์ที่ {relayIndex}</h2>

                          <label
                            className={styles.switch2}
                            style={{ marginLeft: "auto" }}
                          >
                            <input
                              key={relay.status}
                              id={"status" + relayIndex}
                              type="checkbox"
                              style={{
                                width: "30px",
                                height: "30px",
                                display: "block",
                              }}
                              checked={relay.status ? true : false}
                              onChange={() =>
                                changeStatus(
                                  "status" + relayIndex,
                                  relay.relayID
                                )
                              }
                            />
                            <span className={styles.slider}></span>
                          </label>

                          <div className="clearfix"></div>
                        </div>
                        <div
                          className="x_content"
                          style={{
                            display: " block",
                          }}
                        >
                          <h2
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <label>
                              <i className="fa fa-clock-o"></i> ตั้งค่าเวลา :
                              <h
                                className={
                                  relay.timeFunction ? styles.online : ""
                                }
                                style={{ marginLeft: "5px" }}
                              >
                                {relay.timeFunction ? "เปิด" : "ปิด"}
                              </h>
                            </label>
                            <ul
                              className="nav navbar-right panel_toolbox"
                              style={{ marginLeft: "auto" }}
                            >
                              <li style={{ marginRight: "5px" }}>
                                <a
                                  role="button"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={
                                    relay.timeFunction
                                      ? () => {
                                          modalOn(
                                            "modalstyleTime" + relayIndex
                                          );
                                        }
                                      : () => {}
                                  }
                                >
                                  <i className="fa fa-wrench"></i>
                                </a>
                              </li>
                              <a
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <label className={styles.switch2}>
                                  <input
                                    key={relay.timeFunction}
                                    id={"tStatus" + relayIndex}
                                    type="checkbox"
                                    onClick={() =>
                                      settimeFunction(
                                        "tStatus" + relayIndex,
                                        relay.relayID
                                      )
                                    }
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      display: "block",
                                    }}
                                    checked={relay.timeFunction ? true : false}
                                    onChange={() => {}}
                                  />
                                  <span className={styles.slider}></span>
                                </label>
                              </a>
                            </ul>
                          </h2>
                          <h2>
                            <label>รอบที่ 1 :</label>
                            <label
                              className={
                                relay.time1.status ? styles.online : ""
                              }
                              style={{ marginLeft: "5px" }}
                            >
                              {relay.time1.status ? "เปิด" : "ปิด"}
                            </label>
                          </h2>
                          <h2 className={relay.timeFunction ? "brief" : ""}>
                            เปิด : <i className="fa fa-clock-o"></i>{" "}
                            {relay.time1.time_on} | ปิด:{" "}
                            <i className="fa fa-clock-o"></i>{" "}
                            {relay.time1.time_off}
                          </h2>
                          <h2>
                            <label>วัน </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time1.date[0] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              อา
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time1.date[1] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              จ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time1.date[2] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              อ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time1.date[3] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              พ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time1.date[4] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              พฤ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time1.date[5] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              ศ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time1.date[6] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              ส
                            </label>
                          </h2>
                          <h2>
                            <label> รอบที่ 2 : </label>

                            <label
                              className={
                                relay.time2.status ? styles.online : ""
                              }
                              style={{ marginLeft: "5px" }}
                            >
                              {relay.time2.status == 1 ? "เปิด" : "ปิด"}
                            </label>
                          </h2>
                          <h2 className={relay.timeFunction ? "brief" : ""}>
                            เปิด : <i className="fa fa-clock-o"></i>{" "}
                            {relay.time2.time_on} | ปิด:{" "}
                            <i className="fa fa-clock-o"></i>{" "}
                            {relay.time2.time_off}
                          </h2>
                          <h2>
                            <label>วัน </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time2.date[0] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              อา
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time2.date[1] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              จ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time2.date[2] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              อ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time2.date[3] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              พ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time2.date[4] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              พฤ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time2.date[5] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              ศ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time2.date[6] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              ส
                            </label>
                          </h2>
                          <h2>
                            <label>รอบที่ 3 :</label>
                            <label
                              className={
                                relay.time3.status ? styles.online : ""
                              }
                              style={{ marginLeft: "5px" }}
                            >
                              {relay.time3.status == 1 ? "เปิด" : "ปิด"}
                            </label>
                          </h2>
                          <h2>
                            เปิด : <i className="fa fa-clock-o"></i>{" "}
                            {relay.time3.time_on} | ปิด:{" "}
                            <i className="fa fa-clock-o"></i>{" "}
                            {relay.time3.time_off}
                          </h2>
                          <h2>
                            <label>วัน </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time3.date[0] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              อา
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time3.date[1] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              จ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time3.date[2] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              อ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time3.date[3] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              พ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time3.date[4] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              พฤ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time3.date[5] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              ศ
                            </label>{" "}
                            <label
                              style={
                                relay.timeFunction
                                  ? relay.time3.date[6] == 1
                                    ? dayactive
                                    : dayunactive
                                  : dayunactive
                              }
                            >
                              ส
                            </label>
                          </h2>
                          <div className="x_title"></div>
                          <div>
                            <h2
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <label>
                                <i className="fa fa-database"></i> ตั้งค่าข้อมูล{" "}
                              </label>
                              <label
                                className={
                                  relay.dataFunction ? styles.online : ""
                                }
                                style={{ marginLeft: "5px" }}
                              >
                                {relay.dataFunction ? "เปิด" : "ปิด"}
                              </label>
                              <ul
                                className="nav navbar-right panel_toolbox"
                                style={{ marginLeft: "auto" }}
                              >
                                <li style={{ marginRight: "5px" }}>
                                  <a
                                    role="button"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    onClick={
                                      relay.dataFunction
                                        ? () => {
                                            modalOn(
                                              "modalstyleData" + relayIndex
                                            );
                                            setdataValue([
                                              relay.data1.min,
                                              relay.data1.max,
                                            ]);
                                          }
                                        : () => {}
                                    }
                                  >
                                    <i className="fa fa-wrench"></i>
                                  </a>
                                </li>
                                <a
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label className={styles.switch2}>
                                    <input
                                      key={relay.dataFunction}
                                      onClick={() =>
                                        setdataFunction(
                                          "dStatus" + relayIndex,
                                          relay.relayID
                                        )
                                      }
                                      id={"dStatus" + relayIndex}
                                      type="checkbox"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        display: "block",
                                      }}
                                      checked={
                                        relay.dataFunction ? true : false
                                      }
                                      onChange={() => {}}
                                    />
                                    <span className={styles.slider}></span>
                                  </label>
                                </a>
                              </ul>
                            </h2>
                            <h2
                              className={
                                relay.data1.status ? styles.online : ""
                              }
                            >
                              <i className="fa fa-sun-o"></i> {relay.data1.data}{" "}
                              {relay.data1.status ? "เปิด" : "ปิด"}
                            </h2>
                            <h2>
                              เปิดเมื่อค่า
                              {relay.data1.compare == "high"
                                ? "มากกว่า"
                                : "น้อยกว่า"}
                            </h2>
                            <h2 className={relay.dataFunction ? "brief" : ""}>
                              ค่าน้อยสุด:{" "}
                              <strong
                                className={relay.dataFunction ? "minvalue" : ""}
                              >
                                {relay.data1.min}{" "}
                                <i className="fa fa-long-arrow-down"></i>
                              </strong>{" "}
                              | ค่ามากสุด:{" "}
                              <strong
                                className={relay.dataFunction ? "maxvalue" : ""}
                              >
                                {relay.data1.max}{" "}
                                <i className="fa fa-long-arrow-up"></i>
                              </strong>
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div>
        <p style={{ color: "red" }}>ปุ่มทดสอบ Modal success wating fail</p>
        <button onClick={() => setsuccess(true)}>SUCCESS</button>
        <button onClick={() => setwait(true)}>WAITING</button>
        <button onClick={() => setfail(true)}>ERROR</button>

        <button onClick={() => reloadData()}>Reload</button>
      </div>
    </>
  );
}
node.Layout = Layout;
