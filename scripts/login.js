const form = document.getElementById('login')

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let email = document.getElementById('email')
    let password = document.getElementById('password')

        fetch('https://thawing-hamlet-00090.herokuapp.com/api/users/login',{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                email:email.value,
                password:password.value
            })
        }).then(result=>result.json(),error=>alert('something went wrong, couldn`t connect to server'))
        .then(result=>{
            if(result.status == "error")
            {
                alert(result.error)
            }else{
                localStorage.setItem('token',result.token)
                localStorage.setItem('email',result.email)
                localStorage.setItem('isAdmin',result.isAdmin)

                alert("login successful")

                window.location.replace('./landingPage.html')
            }
        })

})