const productItem = document.querySelector('.product-item')
const addToCartButton = document.getElementById('add-to-cart-button')

let currentCart;

const addToCart = async (event) =>{
    if(!currentCart){
        await fetch('/api/carts',{method: 'POST'})
        .then(response => response.json())
        .then(data => currentCart = data.cart._id);
    }

    productId = event.target.parentNode.getAttribute('id')
    const amount = event.target.previousElementSibling.children[1].textContent


    await fetch(`/api/carts/${currentCart}/product/${productId}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({amount}),
    })
    .then(alert('item added to cart'))

    event.target.previousElementSibling.children[1].textContent = 1
}


const seeCart = async (event) =>{
    if(!currentCart){
        return alert('cart empty')
    }
    window.location.href = `/cart/${currentCart}`
}

const decreaseAmount = (event) =>{
    const amount = + event.target.nextElementSibling.textContent
    if (amount > 0){
        event.target.nextElementSibling.textContent = amount - 1
    }
}

const increaseAmount = (event) =>{
    const amount = + event.target.previousElementSibling.textContent
    event.target.previousElementSibling.textContent = amount + 1
}

