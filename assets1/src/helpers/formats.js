// 千分位
export function toThousand(number) {
  let newNumber;
  if (number) {
    const nextNumber = `${number}`;
    if (nextNumber.indexOf(',') > -1) return nextNumber;
    if (nextNumber === '' || nextNumber === '-') return '-';
    newNumber = nextNumber.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
  }
  return newNumber;
}

// 百分号
export function toPercent(number) {
  let newNumber = '';
  if (number) {
    if (number === '-') return number;
    newNumber = `${number}%`;
  }
  return newNumber;
}

// 百分号
export function toHMSUntilNow(startTime) {
  const mSeconds = new Date(new Date().getTime() - startTime);
  const times = parseInt(mSeconds / 1000, 10);
  const hours = parseInt(times / 3600, 10);
  const minutes = parseInt((times - (hours * 3600)) / 60, 10);
  const seconds = times - (hours * 3600) - (minutes * 60);
  return `${hours}:${minutes}:${seconds}`;
}

export function toCapitalize(string) {
  const str = string.toLowerCase();
  const reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
  return str.replace(reg, m => m.toUpperCase());
}
