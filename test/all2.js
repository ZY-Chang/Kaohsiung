// ES6 fetch

// const url="https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c";
// const url="https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
// let jsonData={};

// fetch(url, {method: 'get'})
//   .then((response) => {
//   return response.json();
// }).then((data) => {
//     jsonData=data.result.records;
//     console.log(jsonData);
// }).catch((err)=>{
//     console.log("錯誤訊息:",err);
// })


// 查看內容
// console.log(xhr);

const xhr=new XMLHttpRequest();
xhr.open("get","https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c",true)
xhr.send();
console.log(xhr);
