(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const addNewContactBtn = document.querySelector(".add-btn"),
    newContactModal = document.getElementById("add-modal"),
    updateContactModal = document.getElementById("update-modal"),
    delModal = document.querySelector("#del-modal"),
    backdrop = document.querySelector(".backdrop"),
    showFilterBtn = document.querySelector(".filter-btn"),
    filter = document.querySelector(".filter"),
    cancelAddBtn = newContactModal.querySelector(".cancel-add"),
    confirmAddBtn = newContactModal.querySelector(".confirm-add"),
    cancelUpdateBtn = updateContactModal.querySelector(".cancel-update"),
    confirmUpdateBtn = updateContactModal.querySelector(".confirm-update"),
    addFirstName = document.getElementById("first-name"),
    addLastName = document.getElementById("last-name"),
    addNumberInput = document.getElementById("number"),
    filterInput = document.getElementById("filter"),
    updateFirstName = document.getElementById("update-first-name"),
    updateLastName = document.getElementById("update-last-name"),
    updateNumber = document.getElementById("update-number"),
    cancelDelBtn = document.querySelector(".cancel-del"),
    confirmDelBtn = document.querySelector(".confirm-del");

let modNumber,
    delContact;

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

    static updateContact() {
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

    const contact = new Contact(fName, lName, number);

    if (fName === "" || lName === "" || number === "") {
        alert("Please fill all requred fields")
    } else {
        UI.addContact(contact);
        LStorage.addToLocalStorage(contact);
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

filterInput.addEventListener("keyup", UI.filterContacts);

document.addEventListener("DOMContentLoaded", LStorage.retrieveContacts);

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
        toggleModal(e);
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

///https://github.com/Flutebow/phoneBook.git
},{}]},{},[1]);
