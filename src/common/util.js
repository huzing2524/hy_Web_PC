import Http from './http'

/**
 * 格式化时间戳
 * @param date
 * @returns {number}
 */
export function parseDate(date) {
  return Date.parse(date) / 1000
}

/**
 * Date-格式 2019-03-28
 * @param timestamp
 * @returns {string}
 */
export function getFullDate(timestamp) {
    if (parseInt(timestamp) === 0) {
        return '-'
    } else {
        let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = extra(date.getFullYear()) + '.';
        let M = extra(date.getMonth() + 1) + '.';
        let D = extra(date.getDate()) + ' ';
        let h = extra(date.getHours()) + ':';
        let m = extra(date.getMinutes()) + ':';
        let s = extra(date.getSeconds());
        return Y + M + D + h + m + s;
    }
}

export function getDateChange(timestamp) {
  if (parseInt(timestamp) === 0) {
    return '-'
  } else {
    let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = extra(date.getFullYear()) + '-';
    let M = extra(date.getMonth() + 1) + '-';
    let D = extra(date.getDate()) + ' ';
    let h = extra(date.getHours()) + ':';
    let m = extra(date.getMinutes()) + ':';
    let s = extra(date.getSeconds());
    return Y + M + D + h + m + s;
  }
}

export function getYMDDateString(timestamp) {
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = extra(date.getFullYear()) + '-'
    let M = extra(date.getMonth() + 1) + '-'
    let D = extra(date.getDate())
    return Y + M + D
}

/**
 * Date.格式 2019.03.05
 * @param timestamp
 * @returns {string}
 */
export function getYMDDateDecimalString(timestamp) {
    if (timestamp === 0)
        return ''
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = extra(date.getFullYear()) + '.'
    let M = extra(date.getMonth() + 1) + '.'
    let D = extra(date.getDate())
    return Y + M + D
}

export function getDateString(timestamp) {
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let M = extra(date.getMonth() + 1) + '.'
    let D = extra(date.getDate()) + ' '
    let h = extra(date.getHours()) + ':'
    let m = extra(date.getMinutes()) + ':'
    let s = extra(date.getSeconds())
    return M + D + h + m + s
}

export function getTimeString(timestamp) {
    if (timestamp === 0)
        return ''
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let M = extra(date.getMonth() + 1) + '月'
    let D = extra(date.getDate()) + '日 '
    let h = extra(date.getHours()) + ':'
    let m = extra(date.getMinutes())
    return M + D + h + m
}

export function getYMDHMDateString(timestamp) {
    if (timestamp === 0)
        return ''
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = extra(date.getFullYear()) + '.'
    let M = extra(date.getMonth() + 1) + '.'
    let D = extra(date.getDate()) + ' '
    let h = extra(date.getHours()) + ':'
    let m = extra(date.getMinutes())
    return Y + M + D + h + m
}

export function getMDHMDateString(timestamp) {
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let M = extra(date.getMonth() + 1) + '.'
    let D = extra(date.getDate()) + ' '
    let h = extra(date.getHours()) + ':'
    let m = extra(date.getMinutes())
    return M + D + h + m
}

export function getMDDateString(timestamp) {
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let M = extra(date.getMonth() + 1) + '.'
    let D = extra(date.getDate()) + ' '
    return M + D
}

export function getMDCNDateString(timestamp) {
    let date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let M = extra(date.getMonth() + 1) + '月'
    let D = extra(date.getDate()) + '日'
    return M + D
}

/**
 * 日期转时间戳
 * @param date
 * @returns {string}
 */
export function getTimestampByDate(date) {
    let timestamp = ''
    if (date) {
        timestamp = new Date(date).getTime() / 1000 + ''
    }
    return timestamp
}

/**
 * 补位函数 如果传入数字小于10，数字前补一位0。
 * @param x
 * @returns {*}
 */
function extra(x) {
    if (x < 10) {
        return '0' + x
    } else {
        return x
    }
}

/**
 * 小数点超出保留num位
 * @param floatNum
 * @param num
 * @returns {number}
 */
export function toFixedNum(floatNum, num) {
    return Math.round(parseFloat(floatNum) * Math.pow(10, num)) / Math.pow(10, num)
}

/**
 * 压缩图片
 * @param imageData
 * @param maxWidth
 * @param maxHeight
 * @returns {Promise<any>}
 */
let canvas = document.createElement('canvas')
let context = canvas.getContext('2d')
export function getDataUrl(imageData, maxWidth, maxHeight) {
    return new Promise((resolve) => {
        let img = new Image()
        img.onload = function() {
            let originWidth = img.width
            let originHeight = img.height
            let targetWidth = originWidth,
                targetHeight = originHeight
            if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                    targetWidth = maxWidth
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth))
                } else {
                    targetHeight = maxHeight
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight))
                }
            }
            canvas.width = targetWidth
            canvas.height = targetHeight
            context.clearRect(0, 0, targetWidth, targetHeight)
            context.drawImage(img, 0, 0, targetWidth, targetHeight)
            let dataurl = canvas.toDataURL('image/jpeg', 1.0)
            resolve(dataurl)
        }
        img.src = imageData
    })
}

/**
 * 整理给后端的参数，非空才加入新的对象
 * @param params
 * @returns {*}
 * @constructor
 */
export function ArrangeParams(params) {
    params = params || {}
    let newParams = {}
    Object.keys(params).forEach((item) => {
        if ((params[item] || params[item] === 0) && (params[item] + '').length) {
            newParams[item] = params[item]
        }
    })
    return newParams
}

export function ArrangeHttpMethod(method) {
    let httpMethod = Http.httpGet
    switch (method) {
        case 'post':
            httpMethod = Http.httpPost
            break
        case 'put':
            httpMethod = Http.httpPut
            break
        case 'delete':
            httpMethod = Http.httpDelete
            break
        default:
            httpMethod = Http.httpGet
    }
    return httpMethod
}

export const isDev = process.env.NODE_ENV === 'development'

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (content instanceof 'String') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
};

/**
 * 生成随机字符串(可指定长度)
 * @param len
 * @returns {string}
 */
export const randomString = (len) => {
    len = len || 8;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

/**
 * randomWord 产生任意长度随机字母数字组合
 * @param randomFlag 是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 * @param min
 * @param max
 * @returns {string}
 * 调用方法:
 * 生成 3 - 32 位随即字符串
 * randomWord(true,3,32);    例如：olyOXUF5oDsuMmXl3Mi48
 * 生成 32 位随机字符串
 * randomWord(false,32);     例如：fjpnWj29Bb8boiXbLeDF0nxkR4aYcLRl
 */
export const randomWord = (randomFlag, min, max) => {
    let str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};

/**
 * 获取url后参数
 */
export const GetRequest = () => {
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

/**
 * 生成随机颜色值
 */
export const getRandomColor = () => {
    const rgb = [];
    for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16);
        color = color.length === 1 ? '0' + color : color;
        rgb.push(color)
    }
    return '#' + rgb.join('')
};

/**
 * 验证身份证号
 * @param el 号码输入input
 * @returns {boolean}
 */
export const checkCardNo = (el) => {
    let txtval = el.value;
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(txtval);
};

/**
 * 获取字符串字节长度
 * @param {String}
 * @returns {Boolean}
 */
export const checkLength = (v) => {
    let realLength = 0;
    if (v != null) {
        let len = v.length;
        for (let i = 0; i < len; i++) {
            let charCode = v.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
    }
    return realLength;
};

/**
 * 判断微信浏览器
 * @returns {Boolean}
 */
export const isWeiXin = () => {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
};

/**
 * 浏览器判断
 * 用法示例——多套页面判断是否显示移动端：
 *   let ua = parseUA();
 *   if (!ua.mobile) {
 *       location.href = './pc.html';
 *   }
 */
export const parseUA = () => {
    let u = navigator.userAgent;
    let u2 = navigator.userAgent.toLowerCase();
    return { //移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1,
        //IE内核
        presto: u.indexOf('Presto') > -1,
        //opera内核
        webKit: u.indexOf('AppleWebKit') > -1,
        //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
        //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
        //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
        //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1,
        //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1,
        //是否iPad
        webApp: u.indexOf('Safari') == -1,
        //是否web应该程序，没有头部与底部
        iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
        weixin: u2.match(/MicroMessenger/i) == "micromessenger",
        ali: u.indexOf('AliApp') > -1,
    };
};

/**
 * 生成UUID
 * @returns {string}
 */
export const generateUUID = () => {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

/**
 * 删除左右两端的空格
 * @param str
 * @returns {string | * | void}
 */
export function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 删除左边的空格
 * @param str
 * @returns {string | * | void}
 */
export function ltrim(str) {
    return str.replace(/(^\s*)/g, "");
}

/**
 * 删除右边的空格
 * @param str
 * @returns {string | * | void}
 */
export function rtrim(str) {
    return str.replace(/(\s*$)/g, "");
}

/**
 * 对象数组转二维数组
 * @param objArr
 */
export function obj2Arr(objArr) {
    objArr.length > 0 && objArr.map(item => {
        return Object.values(item);
    })
}

/**
 * 找出对象数组中某属性的最大值
 * @param array
 * @param item
 * @returns val
 */
export function maxItemInObjArr(array, item) {
    let max = Math.max.apply(Math, array.map(function(obj) {
        return obj[item];
    }));
    return max;
}

/**
 * 判断当前网络环境
 */
export const isWifi = () => {
    try {
        let wifi = true;
        let ua = window.navigator.userAgent;
        let con = window.navigator.connection;
        // 如果是微信
        if (/MicroMessenger/.test(ua)) {
            if (ua.indexOf('WIFI') >= 0) {
                return true
            } else {
                wifi = false
            }
            // 如果支持navigator.connection
        } else if (con) {
            let network = con.type;
            if (network !== 'wifi' && network !== '2' && network !== 'unknown') {
                wifi = false
            }
        }
        return wifi
    } catch (e) {
        return false
    }
};

/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
export const fistLetterUpper = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 过滤非法字符串
 */
export const illegalFilter = (str) => {
    // eslint-disable-next-line
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

    if (regEn.test(str) || regCn.test(str)) return false;
    return true;
};

/**
 * 计算字符串长度 (英文占 1 个字符，中文汉字占 2 个字符)
 * @param str
 * @returns {number}
 */
export default function getStrlen(str) {
    let len = 0
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i)
            // 单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++
        } else {
            len += 2
        }
    }
    return len
}

export function timeTab(idx) {
    let end = parseInt((new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)
    let num = ''
    switch (idx) {
        case 1:
            num = 86400
            break
        case 2:
            num = 86400 * 7
            break
        case 3:
            num = 86400 * 30
            break
        case 4:
            num = 86400 * 30 * 3
            break
        case 5:
            num = 86400 * 30 * 3 * 4
            break
    }
    return {
        start: end - num,
        end: end
    }
}
export function toPhoneCall(phoneNum) {
    let u = navigator.userAgent
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (isAndroid) {
        window.android.phoneCall(phoneNum)
    } else if (isIOS) {
        window.webkit && window.webkit.messageHandlers.phoneCall.postMessage(phoneNum)
    } else {
        window.location.href = `tel://${phoneNum}`
    }
}
// 深拷贝
export function deepCopy(obj) {
    let o;
    // 如果  他是对象object的话  , 因为null,object,array  也是'object';
    if (typeof obj === 'object') {
        // 如果  他是空的话
        if (obj === null) {
            o = null;
        } else {
            // 如果  他是数组arr的话
            if (obj instanceof Array) {
                o = [];
                for (let i = 0, len = obj.length; i < len; i++) {
                    o.push(deepCopy(obj[i]));
                }
            }
            // 如果  他是对象object的话
            else {
                o = {};
                for (let j in obj) {
                    o[j] = deepCopy(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o
}
