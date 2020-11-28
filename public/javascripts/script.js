const deleteBtnEls = document.querySelectorAll('.delete-item');
const modalContainerEl = document.getElementById('modal-container');
const modalContentEL = document.getElementById('modal-content');
const modalConfirmEl = document.getElementById('modal-confirm');
const modalCancelEl = document.getElementById('modal-cancel');
const changeLocationEl = document.getElementById('change-location');
const newRaceEl = document.getElementById('new-race');
const raceDropDownEl = document.getElementById('existing-races');
const commentContEls = document.querySelectorAll('.comment-container');

//General functions
modalCancelEl.addEventListener('click', function(e){
    modalConfirmEl.action="";
    modalContentEL.textContent = "";
    modalContainerEl.classList.add('hidden');
});


if(deleteBtnEls){
    deleteBtnEls.forEach(function(btn){
        btn.addEventListener('click', function(e){
            const ids = e.target.id.split('-');
            let itemName = ids[0]
            let itemID = ids[1];
            let race = ids[3];
            modalContainerEl.classList.remove('hidden');
            modalContentEL.textContent = "Are you sure you want to delete this?";
            modalConfirmEl.action=`/races/${race}/${itemName}s/${itemID}?_method=DELETE`;
        })
    });
}




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


//Show race page

if(commentContEls){
    commentContEls.forEach(function(c){
        let deleteEl = c.firstElementChild;
        c.addEventListener('mouseenter', function(e){
            deleteEl.classList.remove('hidden');
        });
        c.addEventListener('mouseleave', function(e){
            deleteEl.classList.add('hidden');
        });
    })
}