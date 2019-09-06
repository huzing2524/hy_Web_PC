
// import * as storage from '_common/session_torage'

const key = {
  chScheduleList:'chScheduleList',  // 班次列表
  chSandingData: 'chSandingData',   // 要修改或添加的砂光锯切数据
  chEditType: 'chEditType',         // 砂光锯切 0: 新增 1:修改
}

const setItem = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

const getItem = (key) => {
  return JSON.parse(window.sessionStorage.getItem(key)) || ''
}

const clear = () => {
  window.sessionStorage.clear()
}

// 根据班次名称，获取班次uuid
const getScheduleUuid = (scheduleName) => {
  const scheduleList = getItem(key.chScheduleList) || []
  let uuid
  scheduleList.forEach(element => {
    if(element.name == scheduleName) {
      uuid = element.uuid
    }
  });
  return uuid
}

export {
  key,
  setItem,
  getItem,
  clear,
  getScheduleUuid,
}