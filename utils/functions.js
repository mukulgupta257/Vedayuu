const stripHTML = (html) => {
  const result = new DOMParser().parseFromString(html, "text/html");
  return result.body.textContent;
}
const dateFormatter = (date) => {
  //05-Feb-2022
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var dateJs = new Date(date);
  var result = dateJs.getDate().toString().length == 1 ? '0' + dateJs.getDate() + '-' + monthNames[dateJs.getMonth()] + '-' + dateJs.getFullYear() :
    dateJs.getDate() + '-' + monthNames[dateJs.getMonth()] + '-' + dateJs.getFullYear();

  return result;
}
function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }
  return (false)
}
function downloadFile(fileName, flag) {
  //Set the File URL.
  var url = fileName;
  var name;
  if (flag) {
    name = fileName.split('/')[fileName.split('/').length-1];
  } else {
    name = fileName.split('file')[1].split('=')[1];
  }

  //Create XMLHTTP Request.
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.responseType = "blob";
  req.onload = function () {
    //Convert the Byte Data to BLOB object.
    var blob = new Blob([req.response], { type: "application/octetstream" });

    //Check the Browser type and download the File.
    var isIE = false || !!document.documentMode;
    if (isIE) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(blob);
      var a = document.createElement("a");
      a.setAttribute("download", name);
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  req.send();
};
function shareMyPost(type, path) {
  var URL;
  if (type == "FB") { //facebook sharer link
    URL = `https://www.facebook.com/sharer/sharer.php?u=${path}`
  } else if (type == "LI") { //linkedIn sharer link
    URL = `https://www.linkedin.com/sharing/share-offsite/?url=${path}`
  } else if (type == "TW") { //twitter sharer link
    URL = `https://twitter.com/intent/tweet?url=${path}`
  }
  window.open(URL, '_blank')
}
function getReadTime(string) {
  if(typeof string == 'number') {
    return string+' '+'min read'  
  } else {
    var time = Math.ceil(string.match(/(\w+)/g).length/175) //275 words per minute
    console.log(time)
    if(time<2) {
      time=2;
    }
    return time+' '+'min read'
  }
}
export { stripHTML, validateEmail, dateFormatter, downloadFile, shareMyPost, getReadTime };