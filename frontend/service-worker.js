/*
client browser에 등록될 service worker 코드 조각
title, body로 구성된 notification 생성
*/
self.addEventListener("push", (event)=>{
    const {title, body} = event.data.json();
    event.waitUntil(self.registration.showNotification(title,{body}));
})