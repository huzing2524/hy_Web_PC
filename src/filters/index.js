import dayjs from 'dayjs';

/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value
 */
const timeFilter = (value) => {
    if (!value) {
        return ''
    }
    value = value.toString();
    if (value) {
        if (value.length === 13) {
            return dayjs(Number(value)).format("YYYY-MM-DD HH:mm:ss");
        }
        return dayjs.unix(Number(value)).format("YYYY-MM-DD HH:mm:ss");
    } else {
        return '-';
    }
}

/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value 2019.04.28
 */
const timePointFilter = (value) => {
    if (!value) {
        return ''
    }
  value = value.toString();
  if (value) {
    if (value.length === 13) {
      return dayjs(Number(value)).format("YYYY.MM.DD");
    }
    return dayjs.unix(Number(value)).format("YYYY.MM.DD");
  } else {
    return '.';
  }
}

/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value 2019.04.28
 */
const timeYearMonthFilter = (value) => {
  value = value.toString();
  if (value) {
    if (value.length === 13) {
      return dayjs(Number(value)).format("MM.DD");
    }
    return dayjs.unix(Number(value)).format("MM.DD");
  } else {
    return '.';
  }
}

/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value 04.28 10:46
 */
const timeMDHMFilter = (value) => {
  value = value.toString();
  if (value) {
    if (value.length === 13) {
      return dayjs(Number(value)).format("MM.DD HH:mm");
    }
    return dayjs.unix(Number(value)).format("MM.DD HH:mm");
  } else {
    return ':';
  }
}

/**
 * 格式化时间戳（秒|毫秒）
 * @param {timestamp} value 2019.01.23 13:11
 */
const timeYMDHMFilter = (value) => {
  value = value.toString();
  if (value) {
    if (value.length === 13) {
      return dayjs(Number(value)).format("YYYY.MM.DD HH:mm");
    }
    return dayjs.unix(Number(value)).format("YYYY.MM.DD HH:mm");
  } else {
    return ':';
  }
}

/**
 * 手机号格式化
 * @param {String} phone
 */
const formatPhone = (phone) => {
    phone = phone.toString();
    return phone.substr(0, 3) + '****' + phone.substr(7, 11);
};

/**
 * 4位一空格（格式化银行卡）
 * @param {String} val
 */
const formatBank = (val) => {
    if (val) {
        return val.toString().replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
    }
};

/**
 * 浮点数保留两位数并且每三位加逗号
 * @param {String} val
 */
const formatFloatNum = (val) => {
  if (val) {
      let valString = parseFloat(val).toFixed(2).toString();
      let intpart = parseInt(valString).toFixed(0).toString().replace(/\B(?=(\d{3})+$)/g, ',');
      let array = valString.split(".");
      let floatPart = array.length === 2 ? "." + array[1] : ".00"; //预定义小数部分
      return intpart + floatPart;
    }
    return val;
};

/**
 * 千分位格式化
 * @param {数字} val
 */
const toThousands = (val) => {
    let num = (val || 0).toString(),
        result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}

/**
 * 格式化小数位
 * @param val 传入的值
 * @param pos 保留的小数位
 * @returns {*}
 */
const formatFloat = (val, pos = 2) => {
    let f = parseFloat(val);
    if (isNaN(f)) {
        return false;
    }
    f = Math.round(val * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + pos) {
        s += '0';
    }
    return s;
}

/**
 * 格式化时长
 * @param second
 * @returns {string}
 */
const realFormatSecond = (second) => {
    let secondType = typeof second;

    if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second);

        let hours = Math.floor(second / 3600);
        second = second - hours * 3600;
        let mimute = Math.floor(second / 60);
        second = second - mimute * 60;

        return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
        return '0:00:00'
    }
};

export default {
    timeFilter,
    timePointFilter,
    timeYearMonthFilter,
    timeMDHMFilter,
    timeYMDHMFilter,
    formatPhone,
    formatBank,
    formatFloatNum,
    toThousands,
    formatFloat,
    realFormatSecond,
}
