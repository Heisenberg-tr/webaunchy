var navigationBar
var navigationBarContent
var navigationBarHamburgerImage
var navigationBarHeaderText
var loginDiv
var loginDivUsernameInput
var loginDivButton
var chatroom
var messageInput
var sendMessageButton

const yasakliKullaniciIsimleri = ["yakup ege", "yakup"]


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


function setUsername(){
    localStorage.setItem("kullaniciIsmi", loginDivUsernameInput.value)
    enterToChatroom()
}

function getUsername(){
    return localStorage.getItem("kullaniciIsmi")
}


function enterToChatroom(){
    loginDiv.style.display = "none"
    chatroom.style.display = "block"

    messageInput.onkeyup = function(){
        if(messageInput.value.length == "0"){
            sendMessageButton.style.display = "none"
        }
        else{
            sendMessageButton.style.display = "block"
        }
    }

    loadMessages()
}

function sendMessage(){
    db.ref('/sohbet/').once('value', function(message_object) {
      var index = parseFloat(message_object.numChildren()) + 1
      db.ref('/sohbet/' + `mesaj_${index}`).set({
        isim: getUsername(),
        mesaj: messageInput.value,
        index: index,
      })
    })
}


function loadMessages(){
    db.ref("/sohbet/").on('value', function(messages_object) {
        chatroom.innerHTML = ""

        if(messages_object.numChildren() == 0){
          return
        }

        var messages = Object.values(messages_object.val());
        var guide = []
        var unordered = []
        var ordered = [] 
  
        for (var i, i = 0; i < messages.length; i++) {
            guide.push(i+1)
            unordered.push([messages[i], messages[i].index]);
        }

        guide.forEach(function(key) {
            var found = false
            unordered = unordered.filter(function(item) {
                if(!found && item[1] == key) {
                    ordered.push(item[0])
                    found = true
                    return false
                }
                else{
                    return true
                }
            })
        })

        var previousUsername = ""

        ordered.forEach(function(data) {
            var messageElement = document.createElement("p")
            var usernameElement = document.createElement("h3")
            messageElement.innerHTML = data.mesaj
            usernameElement.innerHTML = data.isim
            if(previousUsername != data.isim){
                chatroom.append(usernameElement)
            }
            chatroom.append(messageElement)
            previousUsername = data.isim
        })
    
    })
}




window.onload = async function() {
    navigationBar = document.getElementById("navigationBar")
    navigationBarContent = document.getElementById("navigationBarContent")
    navigationBarHamburgerImage = document.getElementById("navigationBarHamburgerImage")
    navigationBarHeaderText = document.getElementById("navigationBarHeaderText")

    if(sessionStorage.getItem("sayfa") == "sohbet"){
        loginDiv = document.getElementById("loginDiv")
        loginDivUsernameInput = document.getElementById("loginDivUsernameInput")
        loginDivButton = document.getElementById("loginDivButton")
        chatroom = document.getElementById("chatroom")
        messageInput = document.getElementById("messageInput")
        sendMessageButton = document.getElementById("sendMessageButton")

        if(localStorage.getItem("kullaniciIsmi") != null){
            enterToChatroom()
        }


        loginDivUsernameInput.onkeyup = function(){
            if(!(yasakliKullaniciIsimleri.includes(loginDivUsernameInput.value)) == false){
                loginDivButton.disabled = true
            }
            else{
                loginDivButton.disabled = false
            }
            if(loginDivUsernameInput.value.length == "0"){
                loginDivButton.disabled = true
            }
        }
    }

    const ipAddress = await getIpAddress();
    if(localStorage.getItem("gunlukleme") != "kapalı"){
        //securityLogger(ipAddress);
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


