// 景點列表
const attractionsList=document.querySelector(".attractions");
// 景點標題
const areaH4=document.querySelector(".area");
// 選單
const select=document.querySelector(".search");
// 熱門標籤
const quickItem=document.querySelector(".quickItem");
// 頁碼
const pageView=document.querySelector(".pageView");
// 回到頂端
const goTopBtn=document.querySelector(".goTop");
// 分隔線
const line=document.querySelector(".line");

// 所有資料、當前頁面資料
let allData=[];
let currentData=[];

// 每個地區的景點
let perAttraction=[];
// value地區對照表
// let zoneNoRepeat=[];
let zoneArray=[]


// 預設頁碼
let _currentPage=1;
// 每頁的景點數量
const _perPage=6;
// 總共頁數
let _totalPage=0;


// API
const xhr=new XMLHttpRequest();
xhr.open("get","https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json",true)
xhr.send(null);
xhr.onload=()=>{
    // 取出資料
        const array=JSON.parse(xhr.responseText);
        console.log(array);
        
    // 篩選出不重複的地區，並加入選項
        // 將需要的資料篩選出來
        // 取出所有景點的區域
        //Set 物件 允許你存儲任何類型的唯一值，並且當你嘗試添加重複的值時，它會自動忽略。
        let zone=new Set(); 
        for(let i=0 ; i<array.result.records.length ; i++){
            const currentZone = array.result.records[i].Zone;//
            if (!zone.has(currentZone)) {
                zone.add(currentZone);
            }
            allData.push({
                Zone:array.result.records[i].Zone,
                Add:array.result.records[i].Add,
                Name:array.result.records[i].Name,
                Opentime:array.result.records[i].Opentime,
                Tel:array.result.records[i].Tel,
                Picture1:array.result.records[i].Picture1
            });
        }
        zoneArray = [...zone]; //把zoneSet變成array

        // 篩選掉重複的區域
        // filter回傳陣列裡面所有符合條件的元素（以陣列方式），如果找不到，會回傳一個空陣列，可以放三個參數，分別是處理到的元素（必須）、該元素 index（選擇性） 以及原陣列（選擇性）
        // str.indexOf(str2) 字串查詢，回傳字串所在索引，也可以做陣列元素查詢，回傳元素所在索引
        // 當有多個element值都一樣，indexOf只會回傳第一個找到的座標
        // 當index找出來的座標和元素本身的座標不一樣，就不回傳，藉此來去除重複出現的元素
        // zoneNoRepeat = zone.filter((element, index, array)=>{
        //     return array.indexOf(element) === index;
        // });

        // 加入選項
        let optionStr=`<option value="none" selected disabled hidden>- - 請選擇選行政區 - -</option> `;
        for(let i=0 ; i<zoneArray.length ; i++){
            optionStr+=`<option value="${i}">${zoneArray[i]}</option>`;
            // 新增perAttraction元素
            perAttraction.push([]);
        }
        select.innerHTML=optionStr;

    // 根據value區域對照表，將區域代碼塞進資料中，並篩選出每個地區的景點
        for(let i=0 ; i<allData.length ; i++){
            for(let j=0 ; j<zoneArray.length ; j++){
                if(allData[i].Zone===zoneArray[j]){
                    allData[i].ZoneValue= zoneArray.indexOf(allData[i].Zone);
                    perAttraction[j].push(allData[i])
                }
            } 
        }
    // 顯示熱門地區按鈕， 篩選出景點數量最多的地區
        // 使用concat 讓兩組陣列不共用同一個記憶體
        let hotZone=perAttraction.concat();
        // 熱門按鈕的數量
        const btnTotal=4;
        let btnStr="";
        // 依照景點數量多寡排序地區
        hotZone.sort((a,b)=>{
            return a.length < b.length ? 1 : -1;
        })
        for(let i=0 ; i<btnTotal ; i++){
            btnStr+=`<button class="hot" value="${hotZone[i][0].ZoneValue}">${hotZone[i][0].Zone}</button>`
        }
        quickItem.innerHTML=btnStr;

    // 載入所有景點
        getAllAttractions();
}

// 監聽
    // 選單
select.addEventListener('change',update,false);
    // 熱門地區 ( 綁定事件要改成父元素，不然動態增加的元件無法監聽 )
quickItem.addEventListener("click",update,false);
    // 跳頁
pageView.addEventListener("click",switchPage,false);
    // 滾動
window.addEventListener("scroll",scrollTo,false);
    // 回到頂部
goTopBtn.addEventListener("click",goToTop,false);


// 預設載入所有景點
function getAllAttractions(){
    // 更改小標題
    areaH4.textContent="高雄景點";
    // 顯示景點
    currentData=allData;
    getCurrentAttraction();
}

// 選擇地區後，更新頁面資料
function update(e){
    if(e.target.nodeName !== "SELECT" && e.target.nodeName !== "BUTTON"){return};
    // 重置當前頁碼
    _currentPage=1;
    // 重置當前景點資料
    currentData=[];
    // 從perAttraction抓出該地區的景點
    const index= e.target.value;
    currentData=perAttraction[index];
    // 更改小標題
    areaH4.textContent=zoneArray[index];
    // 更改選單內容
    select.value=index;
    // 顯示景點
    getCurrentAttraction();
    // 回到景點頂部
    document.documentElement.scrollTop = line.offsetTop;
}

// 載入當前景點、依據頁數顯示
function getCurrentAttraction(){
    // 起始資料、結束資料
    let startData=_currentPage*_perPage-_perPage;
    let endData=startData+_perPage-1;
    if(endData>currentData.length-1){
        endData=currentData.length-1;
    }
    // 計算、顯示頁數
    calPage(currentData.length);
    // 顯示資料
    let str="";
    for(let i = startData ; i <= endData ; i++){
        str+=`
        <div class="item">
            <div class="itemTitle">
                <p>${currentData[i].Name}</p>
                <p>${currentData[i].Zone}</p>
            </div>
            <img class="itemImg" src="${currentData[i].Picture1}">    
            <p><img src="./img/icon/icons_clock.png">${currentData[i].Opentime}</p>
            <p><img src="./img/icon/icons_pin.png">${currentData[i].Add}</p>
            <p><img src="./img/icon/icons_phone.png">${currentData[i].Tel}</p>
        </div>`
    }
    attractionsList.innerHTML=str;
}

// 計算、顯示頁數
function calPage(num){
    // 計算頁數，無條件進位 （總共資料／每一頁顯示多少資料）
    _totalPage=Math.ceil(num/_perPage);
    // 頁數太多，減少頁次     
    /**
     * 頁碼顯示邏輯 ：
     * 1.最多顯示五頁（當前頁面-2 到 當前頁面+2）
     * 2.若當前頁面在最前或最後面（或是頁面不足），超出的部分不顯示
     *   舉例來說：當前頁面=2，應該顯示 0~4 頁，但最小只有第 1 頁，所以第 0 頁不會顯示
     */
    // 最前頁
    let minPage=1;
    // 最後頁
    let maxPage=_totalPage;
    // 顯示範圍：最多顯示（當前頁面）前後幾頁
    const pageScope=2
    // 最多顯示頁數（=當前頁面(一頁)+顯示範圍*2）
    const viewTotalPage=pageScope*2+1;
    // 當前頁面大於 顯示範圍，最前頁往上調整 (舉例顯示範圍+-2，當前頁面>2時，minPage就不等於 1 )
    if(_currentPage > pageScope){
        minPage=_currentPage-pageScope;
    }
    // 當前頁面小於 總共頁數-顯示範圍，並且總共頁數夠多，最後頁往下調整 
    // (舉例顯示範圍+-2，總共頁數=10，當前頁面<10-2時，maxPage就不等於10)
    if(_currentPage < _totalPage-pageScope && _totalPage > viewTotalPage){
        maxPage=parseInt(_currentPage)+pageScope;
    }
    // 顯示頁碼
        if(_totalPage>=1){
            let pageContent='<li><a href="#">< prev</a></li>';
            for(let i=minPage ; i<=maxPage ; i++){
                if(i === _currentPage){
                    pageContent+=`<li><a href="#" class="active">${i}</a></li>`;
                }else{
                    pageContent+=`<li><a href="#" >${i}</a></li>`;
                }
            }
            pageContent+='<li><a href="#">next ></a></li>';
            pageView.innerHTML=pageContent;
        }else{
            pageView.innerHTML="";
        }
}

// 跳頁
function switchPage(e){
    e.preventDefault();
    // 在第一頁的時候沒辦法再往前
    if(e.target.textContent==="< prev"){
        if(_currentPage === 1){
            _currentPage=1;
        }else{
            _currentPage--;
        }
    // 在第最後一頁的時候沒辦法再往後
    }else if(e.target.textContent==="next >"){
        if(_currentPage === _totalPage){
            _currentPage=_totalPage;
        }else{
            _currentPage++;
        }
    }else {
		_currentPage = e.target.textContent;
	}
    getCurrentAttraction();
    // 回到景點頂部
    document.documentElement.scrollTop = line.offsetTop;
}


// goTop按鈕事件
    // 控制按鈕出現或隱藏
function scrollTo() {
    // 顯示畫面距離頁面頂部的高度（超過顯示按鈕）
    const btnShowHeight=400;
    if (scrollY > btnShowHeight) {
		goTopBtn.style.display = "block";
	} else {
		goTopBtn.style.display = "none";
	}
}
    // 回到頂部
function goToTop(){
    document.documentElement.scrollTop = 0;
}