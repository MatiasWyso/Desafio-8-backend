const logoutButton = document.getElementById('logout-button')

logoutButton?.addEventListener('click', ()=>{
    fetch('/api/session/logout')
    .then(window.location.href = '/')
})