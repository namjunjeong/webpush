//logging을 위한 모듈
var logger = (msg)=>{
    var today = new Date();

    var year = today.getFullYear();//년
    var month = ('0' + (today.getMonth() + 1)).slice(-2); //월
    var day = ('0' + today.getDate()).slice(-2);//날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    let milliseconds = today.getMilliseconds(); //밀리초

    var dateString = year + '-' + month  + '-' + day + ' | ' + hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
    console.log(dateString);
    console.log(msg)
}

export default logger;