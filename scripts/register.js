const form = document.getElementById('register')

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let password = document.getElementById('password').value
    let cpassword = document.getElementById('cpassword').value

    if(password!=cpassword)
    {
        alert("Password does not match!")
        document.getElementById('password').value = ""
        document.getElementById('cpassword').value = ""
    }else{
        let email = document.getElementById('email').value
        console.log("equal",email)

        fetch('https://thawing-hamlet-00090.herokuapp.com/api/users/register',{
            method:'POST',
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        .then(result=>result.json())
        .then(result=>{
            if(result.status=="error"){
                alert("Email already registered")
                window.location.reload()
            }else{
                alert('Email successfully registered!')
                window.location.replace('./login.html')
            }
        })

    }
})