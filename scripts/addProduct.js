const newName = document.getElementById('name')
const newDescription = document.getElementById('description')
const newPrice = document.getElementById('price')

const form = document.getElementById('newProduct')

form.addEventListener('submit',(e)=>{
    e.preventDefault()

    fetch(`https://thawing-hamlet-00090.herokuapp.com/api/products/create`,{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem('token')}`,
            "Content-type":"application/json"
        },
        body:JSON.stringify({
            name:newName.value,
            description:newDescription.value,
            price:newPrice.value
        })
    }).then(result=>result.json(),error=>console.log(error))
    .then(result=>{
        if(result.status=="error"){
            alert(result.error)
        }else{
            alert("Saved Successfully")
        }
        window.location.replace('./landingPage.html')
    })
})