import { React, useState, useEffect, useRef } from "react";

import styles from "../styles/node.module.scss";
import { Bar, Scatter, Line, Chart } from "react-chartjs-2";
import { getTHsensor } from "../assets/getTHsensor";
import { sensoricon } from "../assets/sensoricon";
import { isDatakeys } from "../assets/isDatakeys";
import axios from "axios";

export default function GraphData(props) {
  const [graph, setgraph] = useState(true);
  //const [graphDataList, setgarphDataList] = useState([]);
  const [graphDataSelect, setgarphDataSelect] = useState([]);
  const [graphZone, setgraphZone] = useState([]);
  const [graphMode, setgraphMode] = useState([]);
  let graphDataList = props.graphDataList;
  let zoneIDlist = props.zoneIDlist;
  let dataList = props.dataList;
  const data = {
    labels: [
      1643165606463, 1643169206463, 1643172806463, 1643176406463, 1643180006463,
      1643183606463, 1643187206463, 1643190806463, 1643194406463, 1643198006463,
      1643201606463, 1643205206463, 1643208806463, 1643212406463, 1643216006463,
      1643219606463, 1643223206463, 1643226806463, 1643230406463, 1643234006463,
      1643237606463, 1643241206463, 1643244806463, 1643248406463, 1643252006463,
      1643255606463, 1643259206463, 1643262806463, 1643266406463, 1643270006463,
      1643273606463, 1643277206463, 1643280806463, 1643284406463, 1643288006463,
      1643291606463, 1643295206463, 1643298806463, 1643302406463, 1643306006463,
      1643309606463, 1643313206463, 1643316806463, 1643320406463, 1643324006463,
      1643327606463, 1643331206463, 1643334806463, 1643338406463, 1643342006463,
      1643345606463, 1643349206463, 1643352806463, 1643356406463, 1643360006463,
      1643363606463, 1643367206463, 1643370806463, 1643374406463, 1643378006463,
      1643381606463, 1643385206463, 1643388806463, 1643392406463, 1643396006463,
      1643399606463, 1643403206463, 1643406806463, 1643410406463, 1643414006463,
      1643417606463, 1643421206463, 1643424806463, 1643428406463, 1643432006463,
      1643435606463, 1643439206463, 1643442806463, 1643446406463, 1643450006463,
      1643453606463, 1643457206463, 1643460806463, 1643464406463, 1643468006463,
      1643471606463, 1643475206463, 1643478806463, 1643482406463, 1643486006463,
      1643489606463, 1643493206463, 1643496806463, 1643500406463, 1643504006463,
      1643507606463, 1643511206463, 1643514806463, 1643518406463, 1643522006463,
    ],
    datasets: [
      {
        label: "My First dataset",
        data: [
          0.5574072935783745, 0.12453323877293476, 0.16356667870116093,
          0.1590013847217382, 0.33760583079902906, 0.6961636893171119,
          0.7600905948916423, 0.38724809548620254, 0.08007346289735984,
          0.9452967898464848, 0.20387651001650076, 0.0318687831730311,
          0.7522331086597056, 0.5199464721879208, 0.7418910420250999,
          0.418259350698585, 0.8567588678136173, 0.45522381290329017,
          0.8861577716625657, 0.9435532047069666, 0.6753137785838514,
          0.7510725809076169, 0.42020442810379377, 0.44022370335119265,
          0.6880893885850576, 0.7554789115200631, 0.17833827353461706,
          0.34871939751970293, 0.5892716146236758, 0.21191223842040685,
          0.5590037560770276, 0.5897535714687232, 0.6478082195342882,
          0.12783749117665288, 0.36084433643164204, 0.5029750480254687,
          0.3720816908205784, 0.8615881196841249, 0.17734403396668652,
          0.8784691756073544, 0.6223604839573822, 0.037971424000034615,
          0.8366945142612989, 0.6095028306403776, 0.26962885648723534,
          0.3056515629897161, 0.1134348154082343, 0.340999533815568,
          0.14100410224498572, 0.4973587684672274, 0.11026415724303651,
          0.35531865084392233, 0.8069571245491327, 0.15089674690199484,
          0.1827018148968531, 0.557634113936067, 0.299443650045627,
          0.9737539454106179, 0.2432771875699382, 0.0324299183691763,
          0.23251426738053915, 0.3011958186924202, 0.1746657579538986,
          0.522880492409262, 0.8566543045518304, 0.34980540999795573,
          0.812316766776161, 0.17576861347969452, 0.029745928011970957,
          0.2011801774815425, 0.5331240015989536, 0.29501484189145266,
          0.4567702932494193, 0.4189962432917689, 0.45898755234825894,
          0.29367095563253964, 0.8049680260954968, 0.5319691322801414,
          0.12497505240621343, 0.041644817971890014, 0.36964638443624387,
          0.40444738419948245, 0.5769634879626535, 0.9219222449906881,
          0.8188944858141369, 0.850637314149497, 0.8856098587206538,
          0.5796360629519066, 0.261986322932499, 0.6346073485710662,
          0.8679439475404109, 0.5350950011372007, 0.4437132097476961,
          0.9231878686598365, 0.3176404048762904, 0.4711990925671672,
          0.9847843561990386, 0.7906161103818048, 0.7371512255478478,
          0.5268266327432873,
        ],
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      point: {
        radius: 0,
      },
      line: {
        borderWidth: 1.5,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba( 0, 0, 1)",
        },
        grid: {
          color: "rgba(0, 0, 0, 1)",
        },
      },
      y: {
        min: 1,
        max: 200000,
        type: "logarithmic",
        ticks: {
          color: "rgba(0, 0, 0, 1)",
        },
        grid: {
          color: "rgba(0, 0, 0, 1)",
        },
      },
    },
    plugins: {
      downsample: {
        enabled: true,
        threshold: 20, // max number of points to display per dataset
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true, // SET SCROOL ZOOM TO TRUE
          },
          mode: "xy",
          speed: 100,
        },
        pan: {
          enabled: true,
          mode: "xy",
          speed: 100,
        },
      },
    },
  };
  useEffect(() => {
    if (localStorage.graphData != undefined) {
      props.setgarphDataList(JSON.parse(localStorage.graphData));
    }
  }, []);
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
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgb(255, 99, 132)",
        },
      ],
    };
    let tempState = graphDataList;
    props.setgarphDataList((graphDataList) => [...graphDataList, newGraph]);
    tempState = [...tempState, newGraph];
    setgraphMode((graphMode) => [...graphMode, 1]);
    localStorage.setItem("graphMode", graphMode);
    localStorage.setItem("graphData", JSON.stringify(tempState));
  }
  function deleteGraph(id) {
    let tempState = props.graphDataList;
    let newState = [];
    let graphModeState = graphMode;
    for (let i = 0; i < tempState.length; i++) {
      const graph = tempState[i];
      if (graph.id !== id) {
        newState.push(graph);
      }
      if (graph.id == id) {
        graphModeState.splice(i, 1);
      }
    }
    setgraphMode(() => [...graphModeState]);
    props.setgarphDataList(() => [...newState]);
    localStorage.setItem("graphMode", graphMode);
    localStorage.setItem("graphData", JSON.stringify(newState));
  }
  //===========COLOR=============//
  function changeGraphColor(index, color) {
    let tempState = graphDataList;
    let tempGraph = tempState[index];
    tempGraph.datasets[0].borderColor = color;
    tempGraph.datasets[0].backgroundColor = color;
    tempState[index] = tempGraph;
    props.setgarphDataList(tempState);
    localStorage.setItem("graphData", JSON.stringify(graphDataList));
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
    //setgraphMode(temp_state);
    //console.log(graphMode);
    localStorage.setItem("graphMode", temp_state);
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
        borderColor: colorHex,
      };
      console.log("datapoint");
      console.log(_datapoint.data);
      for (let i = 0; i < _datapoint.data.length; i++) {
        const data = _datapoint.data[i];
        const atime = new Date(data._time);
        const btime = new Date(data._time).getTime();
        console.log("testtime");
        console.log(btime);
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const akey = keys[i];
          if (isDatakeys(akey)) {
            adata.label = getTHsensor(akey).name;
            adata.data.push(data[akey]);
          }
        }
        _garphData.labels.push(btime);
      }
      let temp_state = graphDataList;
      _garphData.id = temp_state[index].id;
      _garphData.datasets.push(adata);
      console.log(_garphData);
      temp_state[index] = _garphData;
      props.setgarphDataList((graphDataList) => [...temp_state]);
      localStorage.setItem("graphData", JSON.stringify(temp_state));
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
        console.log("datapoint");
        console.log(_datapoint.data);
        let _garphData = {
          labels: [],
          datasets: [],
          id: "123",
        };
        let adata = {
          label: "",
          data: [],
          backgroundColor: colorHex,
          borderColor: colorHex,
        };
        for (let i = 0; i < _datapoint.data.length; i++) {
          const data = _datapoint.data[i];
          const atime = new Date(data._time);
          const btime = new Date(data._time).getTime();

          const keys = Object.keys(data);
          for (let i = 0; i < keys.length; i++) {
            const akey = keys[i];
            if (isDatakeys(akey)) {
              adata.label = getTHsensor(akey).name;
              adata.data.push(data[akey]);
            }
          }
          _garphData.labels.push(btime);
        }
        let temp_state = graphDataList;
        _garphData.id = temp_state[index].id;
        _garphData.datasets.push(adata);
        console.log(_garphData);
        temp_state[index] = _garphData;
        props.setgarphDataList((graphDataList) => [...temp_state]);

        localStorage.setItem("graphData", JSON.stringify(temp_state));
      }
    } else {
    }
    localStorage.setItem("graphData", JSON.stringify(graphDataList));
  }

  return (
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
                  className={graph ? "fa fa-chevron-up" : "fa fa-chevron-down"}
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
            //console.log("graphDataList");
            //console.log(graphDataList);
            return (
              <div
                key={graphdata.id}
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
                    flexDirection: "row",
                  }}
                >
                  <div>
                    เลือกโซน :{" "}
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
                  </div>{" "}
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
                            document.getElementById("gmode" + graphindex).value
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
                  <div>
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
                  </div>
                  <div>
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
                  </div>
                  <div>
                    {" "}
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
                  </div>
                  <div>
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
                      defaultValue={
                        graphdata.datasets[0].label == ""
                          ? "#FF6384"
                          : graphdata.datasets[0].borderColor
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
                  </div>
                  <button
                    className="btn btn-danger"
                    style={{
                      marginLeft: "auto",
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
                  type={"line"}
                  key={graphdata.id}
                  data={graphdata}
                  options={{
                    responsive: true,
                    elements: {
                      line: { tension: 0.4 },
                    },
                    animation: false,
                    interaction: {
                      mode: "nearest",
                      axis: "x",
                      intersect: false,
                    },
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        grid: { display: false },
                        type: "time",
                        time: {
                          unit: "hour",
                        },
                        ticks: {
                          source: "auto",
                          maxRotation: 0,
                          autoSkip: true,
                          count: 5,
                        },
                      },
                    },
                  }}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "350px",
                  }}
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
  );
}
