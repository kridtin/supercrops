export function getTHsensor(text) {
  if (text == "weather_temperature") {
    return { name: "อุณหภูมิอากาศ", vocabulary: "°C" };
  } else if (text == "weather_humidity") {
    return { name: "ความชื้นอากาศ", vocabulary: "%RH" };
  } else if (text == "weather_light_lux") {
    return { name: "ความเข้มแสง", vocabulary: "Lux" };
  } else if (text == "weather_Light_par") {
    return { name: "ความเข้มแสง", vocabulary: "umol" };
  } else if (text == "weather_co2") {
    return { name: "คาร์บอนไดออกไซด์ในอากาศ", vocabulary: "ppm" };
  } else if (text == "weather_pm25") {
    return { name: "PM2.5 ในอากาศ", vocabulary: "ug/m" };
  } else if (text == "weather_pm10") {
    return { name: "PM10 ในอากาศ", vocabulary: "ug/m" };
  } else if (text == "weather_wind_direc") {
    return { name: "ทิศทางลม", vocabulary: "°" };
  } else if (text == "weather_wind_speed") {
    return { name: "ความเร็วลม", vocabulary: "m/s" };
  } else if (text == "weather_rain_gauge") {
    return { name: "ปริมาณน้ำฝน", vocabulary: "mm/h" };
  } else if (text == "weather_pressure") {
    return { name: "ความดันอากาศ", vocabulary: "kPa" };
  } else if (text == "weather_o2") {
    return { name: "ออกซิเจน", vocabulary: "ppm" };
  } else if (text == "weather_smoke") {
    return { name: "ควัน", vocabulary: "ppm" };
  } else if (text == "soil_temperature") {
    return { name: "อุณหภูมิในดิน", vocabulary: "°C" };
  } else if (text == "soil_moisture") {
    return { name: "ความชื้นในดิน", vocabulary: "%" };
  } else if (text == "soil_ec") {
    return { name: "การนำไฟฟ้า:EC", vocabulary: "uS/cm" };
  } else if (text == "soil_ph") {
    return { name: "กรด-ด่าง", vocabulary: "pH" };
  } else if (text == "soil_n") {
    return { name: "ไนโตรเจน:N", vocabulary: "uS/Cm" };
  } else if (text == "soil_p") {
    return { name: "ฟอสฟอรัส:P", vocabulary: "uS/Cm" };
  } else if (text == "soil_k") {
    return { name: "โพรแทสเซียม:K", vocabulary: "uS/Cm" };
  } else if (text == "water_temperature") {
    return { name: "อุณหภูมิน้ำ", vocabulary: "°C" };
  } else if (text == "water_ph") {
    return { name: "กรด-ด่าง", vocabulary: "pH" };
  } else if (text == "water_do") {
    return { name: "ปริมาณออกซิเจนละลายในน้ำ", vocabulary: "mg/L" };
  } else if (text == "water_ec") {
    return { name: "การนำไฟฟ้า:EC", vocabulary: "uS/cm" };
  } else if (text == "water_nh3") {
    return { name: "แอมโนเนีย", vocabulary: "ppm" };
  } else if (text == "water_cl") {
    return { name: "คลอรีน", vocabulary: "mg/L" };
  } else if (text == "water_phosphate") {
    return { name: "ฟอสฟีน", vocabulary: "ppm" };
  } else if (text == "water_nitrite") {
    return { name: "ไนไตรท์", vocabulary: "mg/L" };
  } else if (text == "water_turbidity") {
    return { name: "ความขุ่นน้ำ", vocabulary: "mg/L" };
  } else if (text == "gas_pressure") {
    return { name: "ความดัน", vocabulary: "Pa" };
  } else if (text == "gas_no2") {
    return { name: "ไนโตรเจนไดออกไซด์", vocabulary: "ppm" };
  } else if (text == "gas_so2") {
    return { name: "ซัลเฟอร์ไดออกไซด์", vocabulary: "ppm" };
  } else if (text == "gas_pm25") {
    return { name: "PM 2.5", vocabulary: "ug/m" };
  } else if (text == "gas_temperature") {
    return { name: "อุณหภูมิ", vocabulary: "°C" };
  } else {
    return text;
  }
}
