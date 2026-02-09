let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list(){
    category_nav_list.classList.toggle("active")

}

let nav_links = document.querySelector(".nav_links")

function open_Menu() {
    nav_links.classList.toggle("active")
}


var cart = document.querySelector('.cart');

function open_close_cart() {
    cart.classList.toggle("active")
}

fetch('products.json')
.then(response => response.json())
.then(data => {
    
    const addToCartButtons = document.querySelectorAll(".btn_add_cart")

    addToCartButtons.forEach(button =>{
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute('data-id')
            const selcetedProduct = data.find(product => product.id == productId)
            

            addToCart(selcetedProduct)

            const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)

            allMatchingButtons.forEach(btn =>{
                btn.classList.add("active")
                btn.innerHTML = `      <i class="fa-solid fa-cart-shopping"></i> Item in cart`
            })
        })
    })
    
    
})


function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem('cart')) || []

    cart.push({... product , quantity: 1})
    localStorage.setItem('cart' , JSON.stringify(cart))


    updateCart()
}



function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items")

    const cart = JSON.parse(localStorage.getItem('cart')) || []


    var total_Price = 0
    var total_count = 0

    cartItemsContainer.innerHTML = "" ;
    cart.forEach((item , index) => {

        let total_Price_item = item.price * item.quantity;

        total_Price += total_Price_item
        total_count += item.quantity

    
        cartItemsContainer.innerHTML += `
        
            <div class="item_cart">
                <img src="${item.img}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">$${total_Price_item}</p>
                    <div class="quantity_control">
                        <button class="decrease_quantity" data-index=${index}>-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="Increase_quantity" data-index=${index}>+</button>
                    </div>
                </div>

                <button class="delete_item" data-inex="${index}" ><i class="fa-solid fa-trash-can"></i></button>
            </div>


        `
    })


    const price_cart_total = document.querySelector('.price_cart_toral')
    
    const count_item_cart = document.querySelector('.Count_item_cart')

    const count_item_header = document.querySelector('.count_item_header')
    
    price_cart_total.innerHTML = `$ ${total_Price}`

    count_item_cart.innerHTML = total_count

    count_item_header.innerHTML = total_count


    const increaseButtons = document.querySelectorAll(".Increase_quantity")
    const decreaseButtons = document.querySelectorAll(".decrease_quantity")

    increaseButtons.forEach(button => {
        button.addEventListener("click" , (event) =>{
            const itemIndex = event.target.getAttribute("data-index")
            increaseQuantity(itemIndex)
        })
    })


    decreaseButtons.forEach(button => {
        button.addEventListener("click" , (event) =>{
            const itemIndex = event.target.getAttribute("data-index")
            decreaseQuantity(itemIndex)
        })
    })



    const delteButtons = document.querySelectorAll('.delete_item')
    
    delteButtons.forEach(button =>{
        button.addEventListener('click' , (event) =>{
            const itemIndex = event.target.closest('button').getAttribute('data-inex')
            removeFromCart(itemIndex)
        })
    })

}


function increaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    cart[index].quantity += 1
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}

function decreaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []

    if (cart[index].quantity > 1){
        cart[index].quantity -= 1
    }
 
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}





function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    const removeProduct = cart.splice(index , 1)[0]
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCart()
    updateButoonsState(removeProduct.id)
}


function updateButoonsState(productId) {
    const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
    allMatchingButtons.forEach(button =>{
        button.classList.remove('active');
        button.innerHTML = `      <i class="fa-solid fa-cart-shopping"></i> add to cart`
    })
}

updateCart()

// تفعيل عرض المنتجات في صفحة Checkout
function displayCheckoutItems() {
    const checkoutItemsContainer = document.querySelector(".ordersummary .items");
    const subtotalElement = document.querySelector(".subtotal_checkout");
    const totalElement = document.querySelector(".total_checkout");
    
    if (checkoutItemsContainer) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
        checkoutItemsContainer.innerHTML = "";

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            checkoutItemsContainer.innerHTML += `
                <div class="item_cart">
                    <div class="image_name">
                        <img src="${item.img}" alt="">
                        <div class="content">
                            <h4>${item.name}</h4>
                            <p class="price_cart">$${item.price * item.quantity}</p>
                            <div class="quantity_control">
                                <button onclick="changeQuantity(${index}, -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button onclick="changeQuantity(${index}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${index})" class="delete_item"><i class="fa-solid fa-trash-can"></i></button>
                </div>`;
        });

        subtotalElement.innerHTML = `$${total}`;
        totalElement.innerHTML = `$${total + 20}`; // إضافة 20 شحن
    }
}

// دالة لتغيير الكمية من صفحة Checkout
window.changeQuantity = function(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity + delta > 0) {
        cart[index].quantity += delta;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        displayCheckoutItems();
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", displayCheckoutItems);


// الرابط الذي حصلت عليه من جوجل
const scriptURL = 'https://script.google.com/macros/s/AKfycbzzO7QSUTWccgv6xuumrM3LvHBq73slPhH5pOikt8VKKOi6qzWAzPnlbzcRoVyeWlOa/exec';

const checkoutForm = document.querySelector('.checkout form');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
        e.preventDefault();
        
        // تغيير نص الزر ليشعر العميل أن الطلب جاري إرساله
        const submitBtn = checkoutForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // تجميع المنتجات في نص واحد لعرضها في الشيت
        let orderDetails = cart.map(item => `${item.name} (Qty: ${item.quantity})`).join(' | ');

        // تجهيز البيانات للإرسال
        const formData = new FormData(checkoutForm);
        formData.append('Order_Details', orderDetails);
        formData.append('Total_Price', document.querySelector(".total_checkout").innerText);

        // عملية الإرسال الفعلي
        fetch(scriptURL, { method: 'POST', body: formData})
            .then(response => {
                alert("تم استلام طلبك بنجاح! شكراً لتسوقك معنا.");
                localStorage.removeItem('cart'); // تفريغ السلة بعد نجاح الطلب
                window.location.href = "index.html"; // العودة للصفحة الرئيسية
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("للأسف حدث خطأ، يرجى المحاولة مرة أخرى.");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}