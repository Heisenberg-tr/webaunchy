var navigationBar
var navigationBarContent
var navigationBarHamburgerImage
var navigationBarHeaderText



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
        memory: navigator.deviceMemory || "Bilinmiyor"
    });
}





function toggleNavigationBar(){
    if(navigationBar.style.height == "100%"){  //navigasyon kapatma eylemi
        navigationBar.style.height = "55px"
        if(window.pageYOffset > 15){
            navigationBar.style.backgroundColor = "rgba(19, 17, 24, 0.623)"
        }
        else{
            navigationBar.style.backgroundColor = "rgba(19, 17, 24, 0)"
            navigationBarHeaderText.style.opacity = "0"
        }
        navigationBarContent.style.opacity = "0"
        navigationBarHamburgerImage.style.opacity = "1"
        setTimeout(() => {
            navigationBarContent.style.display = "none"
            navigationBarHamburgerImage.style.display = "inline"
        }, 600);
        navigationBarHeaderText.style.fontSize = "15px"  
        navigationBarHeaderText.style.top = "0"
    }
    else{  //navigasyon accma eylemi... 
        navigationBar.style.height = "100%"
        navigationBar.style.backgroundColor = "rgb(25, 19, 27)"
        navigationBarHamburgerImage.style.display = "none"
        if(window.pageYOffset < 15){
            navigationBarHeaderText.style.opacity = "1"
        }
        setTimeout(() => {
            navigationBarContent.style.display = "flex"
            navigationBarHamburgerImage.style.opacity = "0"
        }, 150);
        navigationBarContent.style.opacity = "1"
        navigationBarHeaderText.style.fontSize = "30px"
        navigationBarHeaderText.style.top = "15%"
    }
}


window.onload = async function() {
    navigationBar = document.getElementById("navigationBar")
    navigationBarContent = document.getElementById("navigationBarContent")
    navigationBarHamburgerImage = document.getElementById("navigationBarHamburgerImage")
    navigationBarHeaderText = document.getElementById("navigationBarHeaderText")
    const ipAddress = await getIpAddress();
    if(localStorage.getItem("gunlukleme") != "kapalı"){
        securityLogger(ipAddress);
    }
    else{
        console.info("Günlükleme kapatıldı.")
    }

    if(window.pageYOffset < 15){
        navigationBar.style.backgroundColor = "rgba(19, 17, 24, 0)"
        navigationBarHeaderText.style.opacity = "0"
    }


    window.onscroll = function(){
        if(window.pageYOffset < 15){
            navigationBar.style.backgroundColor = "rgba(19, 17, 24, 0)"
            navigationBarHeaderText.style.opacity = "0"
        }
        else{
            navigationBar.style.backgroundColor = "rgba(19, 17, 24, 0.623)"
            navigationBarHeaderText.style.opacity = "1"
        }
    }
}


