/*
백엔드와 통신하며 실제 구독을 진행하는 코드
실제 운영할때는 localhost가 아닌 backend server 주소가 필요
*/

import logger from "/modules/logger.mjs"

if ("serviceWorker" in navigator){//서비스워커 등록
        navigator.serviceWorker.register("service-worker.js");
        logger("navigated");
}else{
    logger("error");
}
    
var form = document.getElementById("subform");
var stat = document.getElementById("status");//진행상황 유저에게 전달

form.addEventListener("submit", (e)=>{
    try{
    e.preventDefault();
    let id = document.getElementById("id").value
    logger(id)
    if(id){
        id = id.toString();
        navigator.serviceWorker.ready.then((registration)=>{
            registration.pushManager.getSubscription().then((subscription)=>{
                if(subscription){//이미 구독중일경우
                    logger("already subscribed");
                    let bodydata = JSON.parse(JSON.stringify(subscription));
                    bodydata.id = id;
                    //subscription정보를 백엔드에 전송하여 id 가져오기
                    //만약 등록은 되어있는데 백엔드에 정보가 없다면 정보 insert
                    fetch(`http://localhost:8001/sub`,{
                        mode : "cors",
                        method : "post",
                        credentials : "same-origin",
                        headers :{
                            'Content-Type' : 'application/json',
                        },
                        body : JSON.stringify(bodydata)
                    }).then(res => res.json()).then(data=>{
                        if(data.rescode == "already"){
                            stat.innerText=`already subscribed as id=${data.id}`
                        }else if(data.rescode == "inserted"){
                            stat.innerText="subscribe complete"
                        }else if(data.rescode == "inuse"){
                            stat.innerText="ID already in use"
                        }
                    })
                }else{//신규 subscription
                    fetch('http://localhost:8001/key').then(response => response.json()).then(data => {
                        //public key를 받아온 후 이를통해 subscribe
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: data.key
                        }).then((subscription)=>{
                            let bodydata = JSON.parse(JSON.stringify(subscription));
                            bodydata.id = id;
                            //이후 구독정보를 백엔드에 전송
                            fetch(`http://localhost:8001/sub`,{
                            mode : "cors",
                            method : "post",
                            credentials : "same-origin",
                            headers :{
                                'Content-Type' : 'application/json',
                            },
                            body : JSON.stringify(bodydata)
                            }).then(res => res.json()).then(data=>{
                                if(data.rescode == "inuse"){
                                    stat.innerText="ID already in use"
                                }else if(data.rescode == "inserted"){
                                    stat.innerText="subscribe complete"
                                }
                            })
                        })
                    })

                }
            })
        })
    }else{
        stat.innerText="please input id";
    }
    }catch (err){
        logger(err)
        stat.innerText="error occured. please refresh";
    }
})