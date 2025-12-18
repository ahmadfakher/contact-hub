var img = document.getElementById("profileImg");
var fname = document.getElementById("fullName");
var phone = document.getElementById("phoneNo");
var email = document.getElementById("emailAddress");
var address = document.getElementById("address");
var group = document.getElementById("group");
var notes = document.getElementById("notes");
var favourite = document.getElementById("favourite");
var emergency = document.getElementById("emergency");
var contactList = [];

// Get contacts from local storage
if (JSON.parse(localStorage.getItem("contacts")) !== null) {
    contactList = JSON.parse(localStorage.getItem("contacts"));
} else {
    contactList = [];
}
displayContacts(contactList);


// changing the form buttons
function changeBtn() {
    document.getElementById("submitBtn").classList.replace("d-none", "d-flex");
    document.getElementById("updateBtn").classList.replace("d-flex", "d-none");
}

// Validate full name function
function validateInput(element) {
    var regex = {
        fullName: /^[a-zA-Z ]{2,50}$/,
        phoneNo: /^(002|\+2){0,1}01[0-25][0-9]{8}$/,
        emailAddress: /^[a-zA-Z0-9][a-zA-Z0-9_]{0,}(\.[a-zA-Z0-9_]{1,}){0,1}@[a-zA-Z0-9]{1,}\.[a-zA-Z]{2,}$/
    }
    var isValid = regex[element.id].test(element.value.trim());
    var isEmpty = element.value.trim() === "" ? true : false;
    if (!isValid && element.value !== "") {
        element.classList.add("is-invalid");
        element.nextElementSibling.classList.remove("d-none");
    } else {
        element.classList.remove("is-invalid");
        element.nextElementSibling.classList.add("d-none");
    }

    return [isValid, isEmpty];
}

// Validate inputs and show errors before submission
function validateBeforeSubmit() {
    var isNameValid = validateInput(fullName);
    if (isNameValid[1]) {
        Swal.fire({
            icon: "error",
            title: "Missing Name",
            text: "Please enter a name for the contact!"
        });
        return false;
    }
    else if (!isNameValid[0]) {
        Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Name should contain only letters and spaces (2-50 characters)"
        });
        return false;
    }
    var isPhoneValid = validateInput(phoneNo);
    if (isPhoneValid[1]) {
        Swal.fire({
            icon: "error",
            title: "Missing Phone",
            text: "Please enter a phone number!"
        });
        return false;
    }
    else if (!isPhoneValid[0]) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone",
            text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)"
        });
        return false;
    }
    var isEmailValid = validateInput(emailAddress);
    if (!isEmailValid[1] && !isEmailValid[0]) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address"
        });
        return false;
    }
    return true;
}

// Add contact to array if no errors
function addContact() {
    if (dupPhone(phone.value)) { return; };
    if (dupMail(email.value)) { return; };
    if (validateBeforeSubmit()) {
        const modalElement = document.getElementById("staticBackdrop");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        Swal.fire({
            icon: "success",
            title: "Added!",
            text: "Contact has been added successfully.",
            timer: 2000,
            showConfirmButton: false
        });
        var contact = {
            contactImg: img.files[0] ? `images/${img.files[0].name}` : "",
            fullname: fname.value,
            phoneno: phone.value,
            emailaddress: email.value,
            contactaddress: address.value,
            contactgroup: group.value,
            contactnotes: notes.value,
            fav: favourite.checked,
            emg: emergency.checked
        }
        contactList.push(contact);
        localStorage.setItem("contacts", JSON.stringify(contactList));
        displayContacts(contactList);
        clearData();
    }
}

// Search for phone number if duplicate
function dupPhone(phoneNo, idx = -1) {
    for (var i = 0; i < contactList.length; i++) {
        if (i === +idx) continue;
        if (contactList[i].phoneno === phoneNo) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Phone Number",
                html: `A contact with this phone number already exists: ${contactList[i].fullname}`
            });
            return true;
        }
    }
    return false;
}

function dupMail(mailAdd, idx = -1) {
    for (var i = 0; i < contactList.length; i++) {
        if (i === +idx) continue;
        if (contactList[i].emailaddress === mailAdd) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Email Address",
                html: `A contact with this email address already exists: ${contactList[i].fullname}`
            });
            return true;
        }
    }
    return false;
}

// Clear Form Data
function clearData() {
    fname.value = "";
    phone.value = "";
    email.value = "";
    address.value = "";
    group.value = "";
    notes.value = "";
    favourite.checked = false;
    emergency.checked = false;
}

// Get Favourites
function getFavCount() {
    var favCount = 0;

    for (let i = 0; i < contactList.length; i++) {
        if (contactList[i].fav === true) {
            favCount++;
        }
    }

    return favCount;
}

// Get Emergency
function getEmgCount() {
    var emgCount = 0;

    for (let i = 0; i < contactList.length; i++) {
        if (contactList[i].emg === true) {
            emgCount++;
        }
    }

    return emgCount;
}

// Add favourite cards
function addFav() {
    var favHTML = "";
    for (let i = 0; i < contactList.length; i++) {
        if (contactList[i].fav === true) {
            const img = contactList[i].contactImg === "";
            const showImg = img ? `<p class="m-0 text-white fw-semibold">${contactList[i].fullname[0]}</p>` : `<img src="${contactList[i].contactImg}" class="img-fluid" alt="">`;
            favHTML += `
            <div class="col-12 col-sm-6 col-xl-12">
                <div class="p-2 rounded-4 fav-card-hov border border-1 border-dark border-opacity-10">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex gap-2 align-items-center">
                            <div
                                class="blue-icon small-icon overflow-hidden rounded-3 d-flex align-items-center justify-content-center">
                                ${showImg}
                            </div>
                            <div>
                                <p class="m-0 fw-medium f-14">${contactList[i].fullname}</p>
                                <p class="m-0 text-black text-opacity-50">${contactList[i].phoneno}</p>
                            </div>
                        </div>
                        <a href="tel:${contactList[i].phoneno}"
                            class="d-flex text-decoration-none justify-content-center align-items-center summary-card-icon green-icon rounded-3">
                            <i class="fa-solid fa-phone fa-2xs"></i>
                        </a>
                    </div>
                </div>
            </div>
            `
        }
    }
    if (favHTML === "") {
        document.getElementById("no-fav").classList.replace("d-none", "d-block");

    } else {
        document.getElementById("no-fav").classList.replace("d-block", "d-none");
    }

    document.getElementById("fav-cards").innerHTML = favHTML;
}

// Add emergency cards
function addEmg() {
    var emgHTML = "";
    for (let i = 0; i < contactList.length; i++) {
        if (contactList[i].emg === true) {
            const img = contactList[i].contactImg === "";
            const showImg = img ? `<p class="m-0 text-white fw-semibold">${contactList[i].fullname[0]}</p>` : `<img src="${contactList[i].contactImg}" class="img-fluid" alt="">`;
            emgHTML += `
                <div class="col-12 col-sm-6 col-xl-12">
                    <div class="p-2 rounded-4 emg-card-hov border border-1 border-dark border-opacity-10">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex gap-2 align-items-center">
                                <div
                                    class="blue-icon small-icon overflow-hidden rounded-3 d-flex align-items-center justify-content-center">
                                    ${showImg}
                                </div>
                                <div>
                                    <p class="m-0 fw-medium f-14">${contactList[i].fullname}</p>
                                    <p class="m-0 text-black text-opacity-50">${contactList[i].phoneno}</p>
                                </div>
                            </div>
                            <a href="tel:${contactList[i].phoneno}"
                                class="d-flex justify-content-center text-decoration-none align-items-center summary-card-icon red-icon rounded-3">
                                <i class="fa-solid fa-phone fa-2xs"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `
        }
    }
    if (emgHTML === "") {
        document.getElementById("no-emg").classList.replace("d-none", "d-block");

    } else {
        document.getElementById("no-emg").classList.replace("d-block", "d-none");
    }
    document.getElementById("emg-cards").innerHTML = emgHTML;
}

// Delete Contact
function deleteContact(idx) {
    Swal.fire({
        title: "Delete Contact?",
        html: `Are you sure you want to delete ${contactList[idx].fullname}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Contact has been deleted.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            contactList.splice(idx, 1);
            localStorage.setItem("contacts", JSON.stringify(contactList));
            displayContacts(contactList);
        }
    });
}

// Toggle favourite
function toggleFav(idx) {
    contactList[idx].fav = !contactList[idx].fav;
    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayContacts(contactList);
}

// Toggle emergency
function toggleEmg(idx) {
    contactList[idx].emg = !contactList[idx].emg;
    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayContacts(contactList);
}

// Search
function searchContacts(element) {
    var matchedResults = [];
    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].fullname.toLowerCase().includes(element.value.toLowerCase()) || contactList[i].emailaddress.toLowerCase().includes(element.value.toLowerCase()) || contactList[i].phoneno.includes(element.value)) {
            matchedResults.push(contactList[i]);
        }
    }
    displayContacts(matchedResults);
}

// update contact
function updateContact(idx) {
    document.getElementById("updateBtn").classList.replace("d-none", "d-flex");
    document.getElementById("submitBtn").classList.replace("d-flex", "d-none");
    img.files[0] = contactList[idx].contactImg;
    fname.value = contactList[idx].fullname;
    phone.value = contactList[idx].phoneno;
    email.value = contactList[idx].emailaddress;
    address.value = contactList[idx].contactaddress;
    group.value = contactList[idx].contactgroup;
    notes.value = contactList[idx].contactnotes;
    favourite.checked = contactList[idx].fav;
    emergency.checked = contactList[idx].emg;
    document.getElementById("updateBtn").dataset.elementId = idx;
}

// save updated contact
function saveContact() {
    const idx = document.getElementById("updateBtn").dataset.elementId;
    if (dupPhone(phone.value, idx)) { return; };
    if (dupMail(email.value, idx)) { return; };
    if (validateBeforeSubmit()) {
        const modalElement = document.getElementById("staticBackdrop");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Contact has been updated successfully.",
            timer: 2000,
            showConfirmButton: false
        });
        contactList[idx].contactImg = img.files[0] ? `images/${img.files[0].name}` : "";
        contactList[idx].fullname = fname.value;
        contactList[idx].phoneno = phone.value;
        contactList[idx].emailaddress = email.value;
        contactList[idx].contactaddress = address.value;
        contactList[idx].contactgroup = group.value;
        contactList[idx].contactnotes = notes.value;
        contactList[idx].fav = favourite.checked;
        contactList[idx].emg = emergency.checked;
        localStorage.setItem("contacts", JSON.stringify(contactList));
        displayContacts(contactList);
        clearData();
    }
}

// Display Contacts
function displayContacts(list) {
    addFav();
    addEmg();
    var contactCards = document.getElementById("contacts-cards");
    var contactsHTML = "";
    console.log(list.length === 0);
    if (list.length === 0) {
        contactCards.classList.replace("d-flex", "d-none");
        document.getElementById("total-no").innerHTML = "0";
        document.getElementById("favourites-no").innerHTML = "0";
        document.getElementById("emergency-no").innerHTML = "0";
        document.getElementById("contact-no").innerHTML = "0";
        document.getElementById("no-contacts").classList.replace("d-none", "d-flex");

        console.log("inside length 0");
        return;
    }
    contactCards.classList.replace("d-none", "d-flex");
    document.getElementById("emergency-no").innerHTML = getEmgCount();
    document.getElementById("favourites-no").innerHTML = getFavCount();
    document.getElementById("total-no").innerHTML = list.length;
    document.getElementById("contact-no").innerHTML = list.length;
    document.getElementById("no-contacts").classList.replace("d-flex", "d-none");


    for (var i = 0; i < list.length; i++) {
        const realIndex = contactList.indexOf(list[i]);
        const emergency = list[i].emg;
        const emergencyActive = emergency ? "active" : "";
        const emergencyHeartIcon = emergency ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"
        const emergencyIcon = emergency ? "d-flex" : "d-none";

        const favourite = list[i].fav;
        const favouriteActive = favourite ? "active" : "";
        const favouriteStarIcon = favourite ? "fa-solid" : "fa-regular"
        const favouriteIcon = favourite ? "d-flex" : "d-none";

        const group = list[i].contactgroup === "";
        const showGroup = group ? "d-none" : "";

        const address = list[i].contactaddress === "";
        const showAddress = address ? "d-none" : "d-flex";

        const email = list[i].emailaddress === "";
        const showEmail = email ? "d-none" : "d-flex";

        const img = list[i].contactImg === "";
        const showImg = img ? `<p class="m-0 text-white fw-semibold h5">${list[i].fullname[0]}</p>` : `<div class="w-100 h-100 overflow-hidden rounded-4"><img src="${list[i].contactImg}" class="img-fluid" alt=""></div>`;

        contactsHTML += `
        <div class="col-12 col-sm-6">
            <div class="shadow d-flex flex-column rounded-4 overflow-hidden h-100">
                <div class="flex-grow-1">
                    <div class="d-flex gap-3 align-items-center p-3 pb-0">
                        <div
                            class="position-relative shadow-sm d-flex align-items-center justify-content-center contact-img rounded-4 blue-icon">
                            ${showImg}
                            <div
                                class="position-absolute top-right bg-warning rounded-circle ${favouriteIcon} align-items-center justify-content-center border border-2 border-white contact-cat-icon">
                                <i class="fa-solid fa-star text-white"></i>
                            </div>
                            <div
                                class="position-absolute bottom-right bg-danger rounded-circle ${emergencyIcon} align-items-center justify-content-center border border-2 border-white contact-cat-icon">
                                <i class="fa-solid fa-heart-pulse text-white"></i>
                            </div>
                        </div>
                        <div>
                            <p class="m-0 fw-semibold">${list[i].fullname}</p>
                            <div class="d-flex gap-2 align-items-center">
                                <div
                                    class="phone-icon bg-primary bg-opacity-10 d-flex align-items-center justify-content-center rounded-3">
                                    <i class="fa-solid fa-phone text-primary fa-2xs"></i>
                                </div>
                                <p class="m-0 f-14 text-dark text-opacity-50">${list[i].phoneno}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 mb-2 d-flex flex-column gap-2 p-3 pt-0">
                        <div class="${showEmail} gap-2 align-items-center">
                            <div
                                class="d-flex gap-2 align-items-center justify-content-center mail-icon rounded-3">
                                <i class="fa-solid fa-envelope fa-2xs"></i>
                            </div>
                            <p class="m-0 f-14 text-dark text-opacity-75">${list[i].emailaddress}</p>
                        </div>
                        <div class="${showAddress} gap-2 align-items-center">
                            <div
                                class="d-flex gap-2 align-items-center justify-content-center address-icon rounded-3">
                                <i class="fa-solid fa-location-dot fa-2xs"></i>
                            </div>
                            <p class="m-0 f-14 text-dark text-opacity-75">${list[i].contactaddress}</p>
                        </div>
                        <div class="d-flex gap-2">
                            <div class="${list[i].contactgroup} ${showGroup} contact-cat w-fit-content px-2 py-1 rounded-2">
                                <p class="m-0 fw-medium">${list[i].contactgroup}</p>
                            </div>
                            <div
                                class="emergency contact-cat w-fit-content px-2 py-1 rounded-2 ${emergencyIcon} align-items-center gap-1">
                                <i class="fa-solid fa-heart-pulse"></i>
                                <p class="m-0 fw-medium">Emergency</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="py-2 px-3 border-top border-1 border-dark border-opacity-10 card-footer d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2">
                        <a href="tel:${list[i].phoneno}"
                            class="footer-icon footer-phone-icon rounded-3 d-flex align-items-center justify-content-center text-decoration-none">
                            <i class="fa-solid fa-phone"></i>
                        </a>
                        <a href="mailto:${list[i].emailaddress}"
                            class="footer-icon footer-mail-icon rounded-3 ${showEmail} align-items-center justify-content-center text-decoration-none">
                            <i class="fa-solid fa-envelope fa-sm"></i>
                        </a>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <a onclick="toggleFav(${realIndex})"
                            class="footer-icon footer-fav-icon rounded-3 ${favouriteActive} d-flex align-items-center justify-content-center text-decoration-none">
                            <i class="${favouriteStarIcon} fa-star fa-sm"></i>
                        </a>
                        <a onclick="toggleEmg(${realIndex})"
                            class="footer-icon footer-emg-icon ${emergencyActive} rounded-3 d-flex align-items-center justify-content-center text-decoration-none">
                            <i class="${emergencyHeartIcon} fa-sm"></i>
                        </a>
                        <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="updateContact(${realIndex})"
                            class="footer-icon border-0  footer-edit-icon rounded-3 d-flex align-items-center justify-content-center text-decoration-none">
                            <i class="fa-solid fa-pen fa-sm"></i>
                        </button>
                        <button onclick="deleteContact(${realIndex})"
                            class="footer-icon border-0 footer-delete-icon rounded-3 d-flex align-items-center justify-content-center text-decoration-none">
                            <i class="fa-solid fa-trash fa-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    contactCards.innerHTML = contactsHTML;
}
