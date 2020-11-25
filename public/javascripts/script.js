//User page
document.getElementById('change-location').addEventListener('click', function(e){
    const formEl = document.getElementById('edit-location-form');
    if(formEl.classList.contains('hidden')){
        formEl.classList.remove('hidden');
        e.target.textContent = "Cancel Changes";
    } else {
        formEl.classList.add('hidden');
        e.target.textContent = "Add/Change Location";
    }
});

//New race page
document.getElementById('new-race').addEventListener('click', function(e){
    const formEl = document.getElementById('new-race-form');
    if(formEl.classList.contains('hidden')){
        formEl.classList.remove('hidden');
    } else {
        formEl.classList.add('hidden');
    }
});