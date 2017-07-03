export const dateTimeToDateString = dateTime => {
  // TODO
  // Date english
  const dateString = dateTime.substring(8, 10) + '/' + dateTime.substring(5, 7)  + '/' + dateTime.substring(0, 4);
  return dateString
}

export const isEmpty = string => {
  if (!string || string === null || string === '<p>undefined</p>') return true
  else {
    return false
  }
}

export const isChanged = (str1, str2) => {
  if (isEmpty(str1) && isEmpty(str2)) return false
  if (str1 === str2) return false
  else return true
}

export const objectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
