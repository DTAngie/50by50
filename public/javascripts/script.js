const changeLocationEl = document.getElementById('change-location');
const newRaceEl = document.getElementById('new-race');
const raceDropDownEl = document.getElementById('existing-races');

//User page
if(changeLocationEl){
    changeLocationEl.addEventListener('click', function(e){
        const formEl = document.getElementById('edit-location-form');
        toggleForm(document.getElementById('edit-location-form'));
    });

}

//New race page
if(newRaceEl){
    newRaceEl.addEventListener('click', function(e){
        const formEl = document.getElementById('new-race-form');
        toggleForm(document.getElementById('new-race-form'));
         if(raceDropDownEl.nextElementSibling.classList.contains('open')){
            toggleForm(raceDropDownEl.nextElementSibling);
            raceDropDownEl.selectedIndex = -1;
         }
    });
}

if(raceDropDownEl){
    const formEl = raceDropDownEl.nextElementSibling;
    
    raceDropDownEl.addEventListener('change', function(e){
        if(e.target.value !== "" && !formEl.classList.contains('open')){
            formEl.classList.add('open');
        } else {
            formEl.classList.remove('open');
        }
        if(document.getElementById('new-race-form').classList.contains('open')){
            toggleForm(document.getElementById('new-race-form'));
        }
    });
}

function toggleForm(formElement){
    if(formElement.classList.contains('open')){
        formElement.classList.remove('open');
    } else {
        formElement.classList.add('open');
    }
}