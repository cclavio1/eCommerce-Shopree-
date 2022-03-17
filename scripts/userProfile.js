const profileDOM = document.getElementById('profile')
const ordersDOM = document.getElementById('orders')
fetch('https://thawing-hamlet-00090.herokuapp.com/api/users/userInfo',{
    method:"POST",
    headers:{
        "Authorization":`Bearer ${localStorage.getItem('token')}`,
        "Content-type":"application/json"
    },
    body:JSON.stringify({
        email:localStorage.getItem('email')
    })
}).then(result=>result.json())
.then(result=>{
    profileDOM.innerHTML=
    `
        <div class="text-center bg-light">
                <img class="img-fluid rounded-circle" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png">
                <h3>${result.email}</h3>
        </div>
    `
})


fetch('https://thawing-hamlet-00090.herokuapp.com/api/orders/userOrders',{
    headers:{
        "Authorization":`Bearer ${localStorage.getItem('token')}`
    }
})
.then(result=>result.json())
.then(result=>{
    ordersDOM.innerHTML=
    `
        <h1 class="text-center py-3 bg-primary">My Orders</h1>
    `
    +result.map(data=>{
        return(
            `
            <div class="row py-2 ">
                <div class="col-6">
                <p>Order ID:</p> ${data._id} 
                </div>
                <div class="col-2">
                     <p>Total Amount:</p> ${data.totalAmount} 
                </div>
                <div class="col-2">
                     <p>Date:</p> ${data.purchasedOn.slice(0,10)} 
                </div>
                <button class="col-2 btn-primary" onclick="orderDetails(this,\'${data._id}\')">&gt&gt</button>
                
            </div>
        `
        )
    }).join('')
})

function orderDetails(DOM,data){
    
  DOM.style=`
      width:100%;
      min-height:20vh
  `
  DOM.innerHTML=`
        <div class="row">
            <div class="col-6">
                <h5>Product Name</h5>
            </div>
             <div class="col-3">
                <h5>Quantity</h5>
            </div>
            <div class="col-3">
                <h5>Price</h5>
            </div>
        </div>  
  `

  fetch(`https://thawing-hamlet-00090.herokuapp.com/api/orders/${data}`)
  .then(result=>result.json())
  .then(result=>{
      result.products.forEach(element => {
      
           
                fetch(`https://thawing-hamlet-00090.herokuapp.com/api/products/${element.productId}/productInfo`,{
                    headers:{
                        "Authorization":`Bearer ${localStorage.getItem('token')}`
                    }
                }).then(data=>data.json()
                .then(data=>{
                    console.log(data)
            return(       
                DOM.innerHTML+=
            `
            <div class="row">
                <div class="col-6">
                    <h5>${data.values.name}</h5>
                </div>
                <div class="col-3">
                    <h5>${element.quantity}</h5>
                </div>
                <div class="col-3">
                    <h5>${data.values.price*element.quantity}</h5>
                </div>
            </div>  
            `
            )
                }))
   
      })
  })
}