import { createNotification } from "../components/notification.js";

const form = document.querySelector('#form');
const formList = document.querySelector('#form_list');
const ul = document.querySelector('ul');
const createBtn = document.querySelector('#create_btn');
const nameInput = document.querySelector('#name_input');
const numberInput = document.querySelector('#number_input');
const notification = document.querySelector('#notification');

let textNotification = '';
let isNotificationTrue = '';
const message =(bool, text) => {
    createNotification(bool, text);
    setTimeout(() => {
        notification.innerHTML = '';
    }, 2000);
};

(async () => {
    try {
        const { data } = await axios.get('/api/contacts');
        data.forEach(contact => {
            const listItem = document.createElement('li');
            listItem.id = contact.id;
            listItem.classList.add('flex', 'flex-row', 'bg-slate-600', 'px-1', 'py-1', 'rounded-md', 'border-zinc-400', 'border-2', 'gap-2', 'justify-around');
            listItem.innerHTML = `
            <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${contact.name}</p>
            <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${contact.number}</p>
            <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
            <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar contacto">
            </button>
            <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
            <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar contacto">
            </button>
            `;
            ul.append(listItem);
        });
        
    } catch (error) {
        console.log(error);
        console.log(error.response.status);
        if (error.response.status === 401) {
            textNotification = 'Debes iniciar sesión';
            isNotificationTrue = true;
            message(isNotificationTrue, textNotification);
        }
        window.location.pathname = '/login'
    }
})();

// Regex validation
const NAME_REGEX = /^[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]+(\s*[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]*)+(\s*[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]*)?$/;
const NUMBER_REGEX = /^[0-9]{6,16}$/;

// Validation
let nameValidation = false;
let numberValidation = false;
const validation = (input, regexValidation, btn) => {
    btn.disabled = nameValidation && numberValidation ? false : true;

    if (input.value === '') {
        input.classList.remove('outline-red-700', 'outline-green-700', 'outline', 'outline-yellow-600', 'border-yellow-600');
        input.classList.add('focus:outline-slate-700', 'outline-4');
    } else if (regexValidation) {
        input.classList.remove('focus:outline-slate-700', 'outline-red-700', 'outline-yellow-600', 'border-yellow-600');
        input.classList.add('outline-green-700', 'outline-4', 'outline');
    } else {
        input.classList.remove('focus:outline-slate-700', 'outline-green-700', 'outline-yellow-600', 'border-yellow-600');
        input.classList.add('outline-red-700', 'outline-4', 'outline');
    }
};

nameInput.addEventListener('input', e => {
    nameValidation = NAME_REGEX.test(e.target.value);
    validation(nameInput, nameValidation, createBtn);
});

numberInput.addEventListener('input', e => {
    numberValidation = NUMBER_REGEX.test(e.target.value);
    validation(numberInput, numberValidation, createBtn);
});

// Add
form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!nameValidation || !numberValidation) {
        validation(nameInput, nameValidation, createBtn);
        validation(numberInput, numberValidation, createBtn);
    }

    const { data } = await axios.post('/api/contacts', { name: nameInput.value, number: numberInput.value });

    const listItem = document.createElement('li');
    listItem.id = data.id;
    listItem.classList.add('flex', 'flex-row', 'bg-slate-600', 'px-1', 'py-1', 'rounded-md', 'border-zinc-400', 'border-2', 'gap-2', 'justify-around');
    listItem.innerHTML = `
    <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${data.name}</p>
    <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${data.number}</p>
    <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
        <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar contacto">
    </button>
    <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
        <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar contacto">
    </button>
    `;
    ul.append(listItem);

    textNotification = 'Contacto nuevo creado';
    isNotificationTrue = false;
    message(isNotificationTrue, textNotification);

    nameInput.value = '';
    numberInput.value = '';
    createBtn.disabled = true;
    nameValidation = false;
    numberValidation = false;
    validation(nameInput, nameValidation, createBtn);
    validation(numberInput, numberValidation, createBtn);
});


const editValidation = (name, number, btn) => {
    nameValidation = true;
    numberValidation = true;
    name.addEventListener('input', e => {
        nameValidation = NAME_REGEX.test(e.target.value);
        validation(name, nameValidation, btn);
    });
    
    number.addEventListener('input', e => {
        numberValidation = NUMBER_REGEX.test(e.target.value);
        validation(number, numberValidation, btn);
    });
};




formList.addEventListener('submit', async e => {
    e.preventDefault();

    // Delete
    if (e.submitter.children[0].alt === 'eliminar contacto') {
        const li = e.submitter.parentElement;
        await axios.delete(`/api/contacts/${li.id}`);
        li.remove();

        textNotification = 'Contacto eliminado';
        isNotificationTrue = true;
        message(isNotificationTrue, textNotification);
    };

    // Edit
    if (e.submitter.children[0].alt === 'editar contacto') {
        const name = e.submitter.parentElement.children[0].textContent;
        const number = e.submitter.parentElement.children[1].textContent;
        console.log(e.submitter.parentElement.id);
        const editable = e.submitter.parentElement;
        editable.innerHTML = `
            <input type="text" placeholder="${name}" value="${name}" class="text-black w-2/5 px-3 rounded-lg bg-slate-100 outline-yellow-600 border-yellow-600 border-2 font-semibold">
            <input type="text" placeholder="${number}" value="${number}" class="text-black w-2/5 px-3 rounded-lg bg-slate-100 outline-yellow-600 border-yellow-600 border-2 font-semibold">
            <button class="bg-green-600 rounded-lg disabled:opacity-50 hover:bg-green-500 hover:scale-110 transition ease-in-out">
                <img src="/images/save.svg" class="w-6 h-6 m-1" alt="guardar">
            </button>
            <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
                <img src="/images/cancel.svg" class="w-6 h-6 m-1" alt="cancelar">
            </button>
        `;
        const nameEdit = editable.children[0];
        const numberEdit = editable.children[1];
        const saveBtn = editable.children[2];
        editValidation(nameEdit, numberEdit, saveBtn);
        
    };

    // Save
    if (e.submitter.children[0].alt === 'guardar') {
        const name = e.submitter.parentElement.children[0];
        const number = e.submitter.parentElement.children[1];
        const editable = e.submitter.parentElement;
        console.log(e.submitter.parentElement.id);

        if (e.submitter.parentElement.children[0].value === '') {
            textNotification = 'El nombre no puede estar vacío';
            isNotificationTrue = true;
            message(isNotificationTrue, textNotification);
            return
        };
        if (e.submitter.parentElement.children[1].value === '') {
            textNotification = 'El número no puede estar vacío';
            isNotificationTrue = true;
            message(isNotificationTrue, textNotification);
            return
        };
        
        await axios.patch(`/api/contacts/${editable.id}`, { name: name.value, number: number.value });
        editable.innerHTML = `
        <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${name.value}</p>
        <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${number.value}</p>
        <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
            <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar contacto">
        </button>
        <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
            <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar contacto">
        </button>
        `;

        textNotification = 'Contacto actualizado';
        isNotificationTrue = false;
        message(isNotificationTrue, textNotification);
    };

    // Cancel
    if (e.submitter.children[0].alt === 'cancelar') {
        const name = e.submitter.parentElement.children[0].placeholder;
        const number = e.submitter.parentElement.children[1].placeholder;
        const editable = e.submitter.parentElement;
        editable.innerHTML = `
        <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${name}</p>
        <p class="flex items-center w-2/5 bg-slate-500 px-3 rounded-md text-lg font-medium">${number}</p>
        <button class="bg-red-600 rounded-lg disabled:opacity-50 hover:bg-red-500 hover:scale-110 transition ease-in-out">
            <img src="/images/trash.svg" class="w-6 h-6 m-1" alt="eliminar contacto">
        </button>
        <button class="bg-yellow-600 rounded-lg disabled:opacity-50 hover:bg-yellow-500 hover:scale-110 transition ease-in-out">
            <img src="/images/edit.svg" class="w-6 h-6 m-1" alt="editar contacto">
        </button>
        `;
    }
});

