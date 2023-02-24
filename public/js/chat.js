const socket = io()

//DOM Elements
const chatContainer = document.getElementById('chat-container')
const messagesSection = document.getElementById('messages-section')
const form = document.getElementById('chat-form')
const formUser = document.getElementById('user-input')
const cleanButton = document.getElementById('clean-button')

messagesSection.scrollTop = messagesSection.scrollHeight - messagesSection.clientHeight

// Authentication

let user;

Swal.fire({
    title: 'Welcome to our chatroom',
    input: 'text',
    text: 'Enter a username',
    inputValidator: (value) =>{
        return !value && 'You must enter a username'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    padding: '16px'
})
.then(result => {
    user = result.value
    form.innerHTML +=`<input type="text" value=${user} name="user" id="user-input"hidden>`
    socket.emit('login', user)
    if (user === "admin") {
        cleanButton.removeAttribute('hidden')
    }
})

// Toast

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast)=>{
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


//Message Send

form.addEventListener('submit', event =>{
    event.preventDefault()
    const formData = new FormData(form)
    const payload = new URLSearchParams(formData)

    const requestOptions = {
        method: 'POST',
        body: payload
    }
    fetch(form.action, requestOptions)
    .then(response => response.json())
    .catch(error => console.log(error))

    form.reset()
})

//Delete Messages

cleanButton.addEventListener('click', async event =>{
    const alert = confirm('Are you sure? \nThis action will delete all messages permanently')
    if (alert) {
        fetch ('/api/chat',{method:'delete'})
    }
})

// Socket Listeners

socket.on('welcome', user=>{
    Toast.fire({
        icon: 'success',
        title: `Welcome ${user}`
    })
})

socket.on('newMessage', data=>{
        messagesSection.innerHTML += `
        <div class="message-box ${user === data.user? "me-message":"user-message"}">
                <p class="user-tag">${data.user}:</p>
                <p class="message-tag">${data.message}</p>
            </div>`
        messagesSection.scrollTop = messagesSection.scrollHeight - messagesSection.clientHeight
})

socket.on('new-user', user =>{
    Toast.fire({
        icon: 'info',
        title: `${user} is online`
    })
})

socket.on('cleanChat', data =>{
    messagesSection.innerHTML = ''
    Toast.fire({
        icon: 'warning',
        title: `All messages has been deleted by admin`
    })
})