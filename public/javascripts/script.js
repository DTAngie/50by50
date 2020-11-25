//User page
document.getElementById('change-location').addEventListener('click', function(e){
    const formEl = document.getElementById('edit-location-form');
    if(formEl.classList.contains('open')){
        formEl.classList.remove('open');
        e.target.textContent = "Edit";
    } else {
        formEl.classList.add('open');
        e.target.textContent = "Cancel";
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