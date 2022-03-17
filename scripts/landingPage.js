const navbar = document.getElementById('nav')
const isAdmin = localStorage.getItem('isAdmin')

if(isAdmin=='true'){
    navbar.innerHTML=
    `
        <li class="nav-item"> <a class="btn btn-outline-light" href="./addProduct.html">+Add Product</a> </li>
        <li class="nav-item"> <a class="nav-link" onclick="logout()">Logout</a> </li>
 
    `
    displayProducts(true)
}else{
    navbar.innerHTML=
    `
        <li class="nav-item"> <a class="nav-link" href="./userProfile.html">My Profile</a> </li>
        <li class="nav-item"> <a class="nav-link" onclick="logout()">Logout</a> </li>
 
    `
const cart = []
displayProducts(false)

function addToCart(id){
    if(cart.length!=0){
        if(cart.includes(id)){
            alert("already on cart")
        }else{
            cart.push(id)
            alert('Item has been added')
            localStorage.setItem('cart',cart)
        }
    }else{
        cart.push(id)
        alert('Item has been added')
        localStorage.setItem('cart',cart)
    }
}
let empty = 
`
    <div>
        <h1>No Products available at the moment</h1>
    </div>
`
const cartDOM = document.getElementById('cart')
///////////////Mouse hover On cart
        //initialize cartDOM
cartDOM.innerHTML =
    `
    <img src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png" style="width:50px;">
    `
///////////////cartDOM events
cartDOM.addEventListener('mouseleave',(e)=>{
    e.target.style=
    `
    width:50px;
    float:right;
    `
    e.target.innerHTML =
    `
            <img src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png" style="width:50px;">
    `

})

cartDOM.addEventListener('mouseenter',(e)=>{
    e.target.style=
    `
    padding-top:4vh;
    height:90vh;
    width:50vh;
    float:right;
     `
     displayCart(e.target)
})
function displayCart(targetDOM)
{
    if(cart.length==0){
        targetDOM.innerHTML=
        `
            <h3>Cart</h3>
            Your Cart is Empty
        `
    }else{
        console.log(localStorage.removeItem('cart'))
        targetDOM.innerHTML=
        `
            <h3>Cart</h3>
        `
            fetch(`https://thawing-hamlet-00090.herokuapp.com/api/products/productsInfos`,{
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({prods:cart})
            })
            .then(data=>data.json())
            .then(data=>{
                data.forEach(data=>{
                    let{name,price}=data
                targetDOM.innerHTML+=
                    `
                    <div class = "row py-2">
                        <p class="col-6">product name</p>
                        <p class="col-2">quantity</p>
                        <p class="col-2">price</p>
                    </row>
                        <div class = "row productInfo">
                            <div class="col-6">
                                ${name}
                            </div>
                            <div class="col-2" id="quantity">    
                            1
                            </div>                            
                            <div class="col-2">
                                P${price}
                            </div>
                            <div class="col-2 d-flex">
                                <button class="btn btn-outline-success" onclick="addOne(this,${price})">+</button>
                                <button class="btn btn-outline-danger" onclick="minusOne(this,${price})">-</button>
                            </div>
                        </div>
                            
                    `
                })
                targetDOM.innerHTML+=
                `
                <button class="btn btn-success" onclick="checkout(this.parentElement)">CheckOut</button>
                `
            })
    }   
}
function addOne(DOM,basePrice){
    let targetDOM= DOM.parentElement.parentElement.children[1]
    let currentVal = parseInt(targetDOM.innerHTML)+1
    targetDOM.innerHTML = currentVal
    let priceDOM = DOM.parentElement.parentElement.children[2]
    let price=parseInt(priceDOM.innerHTML.trim().slice(1))
    priceDOM.innerHTML = `P${price+basePrice}`
}
function minusOne(DOM,basePrice){
    let targetDOM= DOM.parentElement.parentElement.children[1]
    let currentVal = parseInt(targetDOM.innerHTML)-1
    let priceDOM = DOM.parentElement.parentElement.children[2]
    let price=parseInt(priceDOM.innerHTML.trim().slice(1))
    priceDOM.innerHTML = `P${price-basePrice}`
    if(currentVal==0){
        //remove item from cart
    }
    targetDOM.innerHTML = currentVal
}

function checkout(parentDOM){
    let testDOM = parentDOM.getElementsByClassName("productInfo")
    let toCheckOut =[]
    let totalPrice=0;

    for(x=0;x<=testDOM.length-1;x++){
        let prodName=testDOM[x].children[0].innerHTML.trim()
        let prodQuantity=testDOM[x].children[1].innerHTML.trim()
        let prodPrice=testDOM[x].children[2].innerHTML.trim().slice(1)
        
        totalPrice += parseInt(prodPrice)
        console.log(prodName,prodPrice,prodQuantity)
        toCheckOut.push({
            productId:cart[x],
            quantity:prodQuantity
        })
    }
    let newOrder=
    {
        totalAmount:totalPrice,
        products:toCheckOut
    }
    fetch('https://thawing-hamlet-00090.herokuapp.com/api/orders/create',{
        method:"POST",
        headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify(newOrder)
    }).then(result=>result.json(),error=>alert(error))
    .then(result=>{
        
        if(result.status=="error"){
            console.log(result)
            alert("Something went wrong, we could not process the order")
        }else{
            alert("Order has been posted, Thank you")
            window.location.reload()
        }
    })
}

}
function displayProducts(isAdmin){
    const productSection = document.getElementById('products')
    fetch("https://thawing-hamlet-00090.herokuapp.com/api/products/").then(result=>result.json())
.then(result=>{
    if(result==null){
       productSection.innerHTML = empty
    }else{
        productSection.innerHTML = 
        result.map(data=>{
            if(isAdmin){
                return(
                    ` 
                     <div class="card w-75">
                        <div class="card-header">
                            <h3>${data.name}</h3>
                        </div>
                        <div class="card-body row">
                        <div class="col-4">
                          <img class="img-fluid w-50 bg-success" src="https://cdn-icons-png.flaticon.com/512/3724/3724788.png">
                         </div>
                            <blockquote class="blockquote mb-0 col-6">
                                    <p> ${data.description}.</p>
                                    
                                    <p>P${data.price}</p>
                                <a class="btn btn-outline-success" href="./updateProduct.html?id=${data._id}")">Update Product</a>
                                <footer class="btn btn-outline-danger" onclick="deleteProduct(\'${data._id}\')">Remove Product</footer>
                            </blockquote>
                        </div>
                    </div>
                    `)
                
            }else{
            return(
        ` 
        <div class="card w-75">
           <div class="card-header">
               <h3>${data.name}</h3>
           </div>
           <div class="card-body row">
           <div class="col-4">
             <img class="img-fluid w-50 bg-success" src="https://cdn-icons-png.flaticon.com/512/3724/3724788.png">
            </div>
            <blockquote class="blockquote mb-0 col-6">
                    <p> ${data.description}.</p>
                    <p>P${data.price}</p>
                <footer class="btn btn-outline-dark" onclick="addToCart(\'${data._id}\')">Add to Cart</footer>
            </blockquote>
            </div>
        </div>
     </div>   
        `)}
        }).join('')
    }
},error=>alert(error))

}

