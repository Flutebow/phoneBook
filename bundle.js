(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const addNewContactBtn = document.querySelector(".add-btn");
const newContactModal = document.getElementById("add-modal");
const updateContactModal = document.getElementById("update-modal");
const delModal = document.querySelector("#del-modal");
const backdrop = document.querySelector(".backdrop");
const showFilterBtn = document.querySelector(".filter-btn");
const filter = document.querySelector(".filter");
const cancelAddBtn = newContactModal.querySelector(".cancel-add");
const confirmAddBtn = newContactModal.querySelector(".confirm-add");
const cancelUpdateBtn = updateContactModal.querySelector(".cancel-update");
const confirmUpdateBtn = updateContactModal.querySelector(".confirm-update");
const addFirstName = document.getElementById("first-name");
const addLastName = document.getElementById("last-name");
const addNumberInput = document.getElementById("number");
const filterInput = document.getElementById("filter");
const updateFirstName = document.getElementById("update-first-name");
const updateLastName = document.getElementById("update-last-name");
const updateNumber = document.getElementById("update-number");
const cancelDelBtn = document.querySelector(".cancel-del");
const confirmDelBtn = document.querySelector(".confirm-del");

let modNumber;
let delContact;

class Contact {
    constructor(firstName, lastName, number) {
        this.firstName = firstName,
            this.lastName = lastName,
            this.number = number;
    }
}

class UI {
    static addContact(contact) {
        const contactList = document.querySelector(".list-body");
        const row = document.createElement("tr");
        row.classList.add("contact")
        row.innerHTML = `
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.number}</td>
        <td class="edit"><button class="mod-btn"><i class="fa fa-edit"></i> EDIT</button><button class="del-btn"><i class="fa fa-times"></i> DEL</button>
        `
        contactList.appendChild(row);
    }
    static deleteContact(target) {
        target.remove();
    }

    static filterContacts(e) {
        const inputText = e.target.value.toLowerCase().trim();

        document.querySelectorAll(".contact").forEach(contact => {
            let fullName = contact.firstElementChild.textContent.toLowerCase().replace(/ +/g, "") +
                contact.children[1].textContent.toLowerCase().replace(/ +/g, "");

            if (fullName.includes(inputText.replace(/ +/g, "")) ||
                contact.children[2].textContent.toLowerCase().replace(/ +/g, "").includes(inputText.replace(/ +/g, ""))) {
                contact.style.display = "table-row";

            } else {
                contact.style.display = "none";
            }
        });
    }

    static updateContact(e) {
        const contacts = document.querySelectorAll("tr");
        contacts.forEach(contact => {
            if (modNumber === contact.children[2].textContent) {
                contact.children[0].textContent = updateFirstName.value;
                contact.children[1].textContent = updateLastName.value;
                contact.children[2].textContent = updateNumber.value;
            }
        });
    }
}

class LStorage {
    static getContacts() {
        let phoneList;
        if (localStorage.getItem("contacts") === null) {
            phoneList = [];
        } else {
            phoneList = JSON.parse(localStorage.getItem("contacts"));
        }
        return phoneList;
    }
    static addToLocalStorage(contact) {
        const contacts = LStorage.getContacts();
        contacts.push(contact);
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }

    static retrieveContacts() {
        const contacts = LStorage.getContacts();

        contacts.forEach(contact => {
            UI.addContact(contact);
        });
    }

    static removeFromLocalStorage(number) {
        const contacts = LStorage.getContacts();

        contacts.forEach((contact, index) => {
            if (number === contact.number) {
                contacts.splice(index, 1);
            }
        });
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }

    static updateContactLS() {
        const contacts = LStorage.getContacts();

        const updatedContact = {
            firstName: updateFirstName.value,
            lastName: updateLastName.value,
            number: updateNumber.value
        };

        contacts.forEach((contact, index) => {
            if (modNumber === contact.number) {
                contacts.splice(index, 1, updatedContact);
            }
        });
        localStorage.setItem("contacts", JSON.stringify(contacts));

    }

}
addNewContactBtn.addEventListener("click", (e) => {
    toggleModal(e);
});

backdrop.addEventListener("click", (e) => {
    toggleModal(e);
    clearInputs();
});

showFilterBtn.addEventListener("click", () => {
    filter.classList.toggle("visible");
    clearInputs();
});

cancelAddBtn.addEventListener("click", (e) => {
    toggleModal(e);
    clearInputs();
});

confirmAddBtn.addEventListener("click", (e) => {

    const fName = addFirstName.value,
        lName = addLastName.value,
        number = addNumberInput.value;

    //Instantiate new contact
    const contact = new Contact(fName, lName, number);

    //check if success or error
    if (fName === "" || lName === "" || number === "") {
        alert("Please fill all requred fields")
    } else {
        //Add contact to list
        UI.addContact(contact);
        LStorage.addToLocalStorage(contact);
        //Clear fields
        clearInputs();
        toggleModal(e);
    }
});


cancelUpdateBtn.addEventListener("click", (e) => {
    toggleModal(e);
    clearInputs();

});

confirmUpdateBtn.addEventListener("click", (e) => {
    if (!updateFirstName.value || !updateLastName.value || !updateNumber.value) {
        alert("Fill all requred fields")
    } else {
        LStorage.updateContactLS();
        UI.updateContact();
        toggleModal(e);
        clearInputs();
    }

});

cancelDelBtn.addEventListener("click", (e) => {
    toggleModal(e);
});

confirmDelBtn.addEventListener("click", (e) => {
    LStorage.removeFromLocalStorage(delContact.children[2].textContent);
    UI.deleteContact(delContact);
    toggleModal(e);
});

document.querySelector(".phone-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("del-btn")) {
        delContact = e.target.parentElement.parentElement;
        toggleModal(e);
    }

    if (e.target.classList.contains("mod-btn")) {
        updateFirstName.value = e.target.parentElement.parentElement.firstElementChild.textContent;
        updateLastName.value = e.target.parentElement.parentElement.children[1].textContent;
        updateNumber.value = e.target.parentElement.previousElementSibling.textContent;

        modNumber = e.target.parentElement.previousElementSibling.textContent;

        updateContactModal.classList.toggle("visible");
        backdrop.classList.toggle("visible");
    }
});

const toggleModal = (e) => {
    if (e.target.classList.contains("add-btn") ||
        e.target.classList.contains("cancel-add") ||
        e.target.classList.contains("confirm-add")) {
        backdrop.classList.toggle("visible");
        newContactModal.classList.toggle("visible");
    }

    if (e.target.classList.contains("mod-btn") ||
        e.target.classList.contains("cancel-update") ||
        e.target.classList.contains("confirm-update")) {
        backdrop.classList.toggle("visible");
        updateContactModal.classList.toggle("visible");
    }
    if (e.target.classList.contains("backdrop")) {

        backdrop.classList.remove("visible");
        newContactModal.classList.remove("visible");
        updateContactModal.classList.remove("visible");
        delModal.classList.remove("visible");

    }

    if (e.target.classList.contains("del-btn") ||
        e.target.classList.contains("cancel-del") ||
        e.target.classList.contains("confirm-del")) {
        delModal.classList.toggle("visible");
        backdrop.classList.toggle("visible");
    }


};

const clearInputs = () => {
    addFirstName.value = "";
    addLastName.value = "";
    addNumberInput.value = "";
};

//Filter tasks
filterInput.addEventListener("keyup", UI.filterContacts);


document.addEventListener("DOMContentLoaded", LStorage.retrieveContacts);



//ADD SORT LIST FUNCTION BY FIRSTNAME, LASTNAME, NUMBER
///https://github.com/Flutebow/phoneBook.git
},{}]},{},[1]);
