

function navigator_descriptor(){
    platform = navigator.platform
    userAgent = navigator.userAgent
    memory = navigator.deviceMemory
    final = "UA : " + userAgent + "\nPlatform : " + platform  + "\nBellek Miktarı : " + memory + "gb"
    return final
}

