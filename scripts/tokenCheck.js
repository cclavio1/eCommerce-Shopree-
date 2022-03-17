let token = localStorage.getItem('token')

if(window.location.pathname=="/pages/login.html"){
    if(token!=undefined){
        window.location.replace('./landingPage.html')
    }
}
else{
    if(token==undefined){
        window.location.replace('./login.html')
    }
}


function logout(){
    localStorage.clear()
    alert("Thanks for shopping with us")
    window.location.reload()
}