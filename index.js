var navigationBar
var navigationBarContent



var firebaseConfig = {
    apiKey: "AIzaSyCC-L7FsrHSWtMFFO-h6Wy6O25ajwB2umk",
    authDomain: "webaunchy.firebaseapp.com",
    projectId: "webaunchy",
    storageBucket: "webaunchy.firebasestorage.app",
    messagingSenderId: "70120009216",
    appId: "1:70120009216:web:7851767f50a23acb4ef2e5",
    databaseURL: "https://webaunchy-default-rtdb.europe-west1.firebasedatabase.app"
  };

var app = firebase.initializeApp(firebaseConfig)
var db = firebase.database()






async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Günlükleme başarısız oldu: ', error);
        return 'Bilinmiyor';
    }
}

function securityLogger(ipAddress) {
    const timestamp = new Date();

    db.ref("webaunchy/" + timestamp).set({
        ip: ipAddress,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        memory: navigator.deviceMemory || "unknown"
    });
}





function openNavigationBar(){
    if(navigationBar.style.height == "100%"){
        navigationBar.style.height = "55px"
        navigationBar.style.backgroundColor = "rgba(0, 0, 0, 0.623)"
        navigationBarContent.style.opacity = "0"
        setTimeout(() => {
            navigationBarContent.style.display = "none"
        }, 600);  
    }
    else{
        navigationBar.style.height = "100%"
        navigationBar.style.backgroundColor = "#101010"
        setTimeout(() => {
            navigationBarContent.style.display = "flex"
        }, 150);
        navigationBarContent.style.opacity = "1"
        
    }
}


window.onload = async function() {
    navigationBar = document.getElementById("navigationBar")
    navigationBarContent = document.getElementById("navigationBarContent")
    const ipAddress = await getIpAddress();
    if(localStorage.getItem("gunlukleme") != "kapalı"){
        securityLogger(ipAddress);
    }
    else{
        console.info("Günlükleme kapatıldı.")
    }
}


