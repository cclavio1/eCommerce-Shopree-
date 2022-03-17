const newName = document.getElementById('name')
const newDescription = document.getElementById('description')
const newPrice = document.getElementById('price')

const form = document.getElementById('newProduct')

const id =  new URLSearchParams(document.location.search).get('id')
fetch(`https://thawing-hamlet-00090.herokuapp.com/api/products/${id}/productInfo`,{
    headers:{
        "Authorization":`Bearer ${localStorage.getItem('token')}`
    }
}).then(result=>result.json())
.then(result=>{
    let prod = result.values
    console.log(prod)
    newName.value = prod.name
    newDescription.value = prod.description
    newPrice.value = prod.price
})

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    fetch(`https://thawing-hamlet-00090.herokuapp.com/api/products/${id}/update`,{
        method:"PATCH",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem('token')}`,
            "Content-type":"application/json"
        },
        body:JSON.stringify({
            name:newName.value,
            description:newDescription.value,
            price:newPrice.value
        })
    }).then(result=>result.json())
    .then(result=>{
        alert("Update Successfully")
        
     window.location.replace('./landingPage.html')
    })
})