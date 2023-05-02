const container = document.querySelector('#container');
const notification = document.querySelector('#notification');

(async () => {
    const tokenUrl = window.location.pathname.split('/resetPassword/')[1];

    if (!tokenUrl) {
        
        container.innerHTML = `
        <form class="flex flex-col p-4 rounded-lg gap-4 bg-zinc-200 shadow-lg">
            <h1 class="text-lg">Escribe tu correo para la verificación de la contraseña</h1>
            <label for="email-input" class="font-bold">Email</label>
            <input type="email" id="email-input" class="rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <button 
                class="bg-slate-700 py-2 px-4 rounded-lg font-bold text-white hover:bg-slate-400 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
                Enviar correo
            </button>
        </form>
        `;

        const form = container.children[0];
        const emailInput = form.children[2];

        form.addEventListener('submit', async e => {
            e.preventDefault();

            try {
                const email = { email: emailInput.value };
                await axios.post('/api/resetPassword', email);
                container.innerHTML = `
                <div class="flex flex-col p-4 rounded-lg gap-4 bg-zinc-200 shadow-lg">
                    <h1 class="text-lg">Se te ha enviado un correo electrónico para reiniciar contraseña</h1>
                </div>
                `;
            } catch (error) {
                console.log(error);
                container.innerHTML = `
                    <div class="flex flex-col p-4 rounded-lg gap-4 bg-zinc-200 shadow-lg">
                        <h1 class="text-lg">El correo electrónico no se encuentra registado, por favor, regístrate.</h1>
                    </div>
                    `;
                setTimeout(() => {
                    container.innerHTML = `
                    <form class="flex flex-col p-4 rounded-lg gap-4 bg-zinc-200 shadow-lg">
                        <h1 class="text-lg">Escribe tu correo para la verificación de la contraseña</h1>
                        <label for="email-input" class="font-bold">Email</label>
                        <input type="email" id="email-input" class="rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
                        <button 
                            class="bg-slate-700 py-2 px-4 rounded-lg font-bold text-white hover:bg-slate-400 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                        >
                            Enviar correo
                        </button>
                    </form>
                    `;
                }, 3000);

            }
        });

    } else {
        const token = tokenUrl.split('/')[0];
        await axios.get(`/api/resetPassword/${token}`);
        container.innerHTML = `
        <form class="flex flex-col p-4 rounded-lg gap-4 bg-zinc-200 shadow-lg">
            <h1 class="text-lg">Escribe tu nueva contraseña</h1>
            <label for="password-input" class="font-bold">Nueva contraseña</label>
            <input type="password" id="password-input" class="rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <label for="match-input" class="font-bold">Confirmar contraseña</label>
            <input type="password" id="match-input" class="rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <button 
                id="form-btn"
                disabled
                class="bg-slate-700 py-2 px-4 rounded-lg font-bold text-white hover:bg-slate-400 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
                Registrar
            </button>
        </form>
        `;
        const form = container.children[0];
        const passwordInput = document.querySelector('#password-input');
        const matchInput = document.querySelector('#match-input');
        const formBtn = document.querySelector('#form-btn');
        const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/;
        let passwordValidation = false;
        let matchValidation = false;
        const validation = (input, regexValidation) => {
            formBtn.disabled = passwordValidation && matchValidation ? false : true;

            if (input.value === '') {
                input.classList.remove('outline-red-700', 'outline-green-700', 'outline-2', 'outline');
                input.classList.add('focus:outline-slate-700');
            } else if (regexValidation) {
                input.classList.remove('focus:outline-slate-700', 'outline-red-700');
                input.classList.add('outline-green-700', 'outline-2', 'outline');
            } else {
                input.classList.remove('focus:outline-slate-700', 'outline-green-700');
                input.classList.add('outline-red-700', 'outline-2', 'outline');
            }
        };
        passwordInput.addEventListener('input', e => {
            passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
            matchValidation = e.target.value === matchInput.value;
            validation(passwordInput, passwordValidation);
            validation(matchInput, matchValidation);
        });

        matchInput.addEventListener('input', e => {
            matchValidation = e.target.value === passwordInput.value;
            validation(matchInput, matchValidation);
        });
        form.addEventListener('submit', async e => {
            e.preventDefault();
            try {
                const newPassword = passwordInput.value;
                await axios.patch(`/api/resetPassword/${token}`, { password: passwordInput.value });
                passwordInput.value = '';
                matchInput.value = '';
                validation(passwordInput, false);
                validation(matchInput, false);
                window.location.pathname = '/login';
            } catch (error) {
                console.log(error);
            };
        });
    }
})();