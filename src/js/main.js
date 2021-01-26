const form = document.querySelector('form');
const submitBtn = form.elements.SubmitBtn;
const algorithmsChooser = form.elements.Algorithms;
const algorithms = {
    AES : {
        name: 'AES',
        encrypt : CryptoJS.AES.encrypt,
        decrypt: CryptoJS.AES.decrypt
    },
    DES: {
        name: 'DES',
        encrypt: CryptoJS.DES.encrypt,
        decrypt: CryptoJS.DES.decrypt
    },
    TripleDES: {
        name: 'Triple DES',
        encrypt: CryptoJS.TripleDES.encrypt,
        decrypt: CryptoJS.TripleDES.decrypt
    }
};
let actionType = 'encrypt';
const encryptBtn = document.querySelector('#encrypt');
const decryptBtn = document.querySelector('#decrypt');
const warningDiv = document.querySelector('#warning');
const resultDiv = document.querySelector('#result-div');
const resultElem = document.querySelector('#result');
const copyResultBtn = document.querySelector('#copy-result');
const passphraseField = form.elements.Passphrase;
const togglePassphraseBtn = document.querySelector('#toggle-passphrase');
let isPassphraseVisible = false;

document.addEventListener('DOMContentLoaded', () => {
    insertAlgorithms(algorithms);
    submitBtn.addEventListener('click', handleSubmit);
    encryptBtn.addEventListener('click', updateAction);
    decryptBtn.addEventListener('click', updateAction);
    copyResultBtn.addEventListener('click', () => copyToClipboard(resultElem));
    togglePassphraseBtn.addEventListener('click', togglePassphrase);
});

function insertAlgorithms(array){
    for(let algorithm in array){
        let option = document.createElement('option');
        option.id = algorithm;
        option.textContent = algorithm;
        algorithmsChooser.appendChild(option);
    }
}

function updateAction(e){
    actionType = e.target.getAttribute('action');
    if(actionType == 'decrypt'){
        encryptBtn.classList.remove('active');
        decryptBtn.classList.add('active');
    } else if(actionType== 'encrypt'){
        decryptBtn.classList.remove('active');
        encryptBtn.classList.add('active');
    }
}

function handleSubmit(){
    const algorithm = algorithmsChooser.value;
    const passphrase = passphraseField.value;
    if(passphrase.length < 10){
        updateDiv('Password must have at least 10 characters.', 'warning');
        return;
    }
    const message = form.elements.Message.value;
    if(!message){
        updateDiv('Message can\'t be empty', 'warning');
        return;
    }
    updateDiv('','warning');
    process({algorithm, actionType, passphrase, message});
}

function updateDiv(content, type){
    if(!content){
        type == 'warning' ? warningDiv.classList.remove('active-warning') : resultDiv.classList.remove('active-result');
    } else {
        if(type == 'warning'){
        warningDiv.textContent = content;
        warningDiv.classList.add('active-warning');
        } else {
            resultElem.textContent = content;
            resultDiv.classList.add('active-result');
        }
    }
}
function copyToClipboard(element){
    const textarea = document.createElement('textarea');
    textarea.value = element.textContent;
    textarea.readOnly = true;
    textarea.style.position = 'absolute';
    textarea.style.top = '-100vh';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, element.textContent.length);
    document.execCommand('copy');
    copyResultBtn.textContent = 'Copied';
    document.body.removeChild(textarea);
}
function togglePassphrase(){
    const toggleImg = document.querySelector('#toggle-passphrase img');
    if(!isPassphraseVisible){
        passphraseField.type = 'text';
        toggleImg.src = 'src/imgs/eye-off.svg';
        isPassphraseVisible = true;
    } else {
        passphraseField.type = 'password';
        toggleImg.src = 'src/imgs/eye.svg';
        isPassphraseVisible = false;
    }
}
function process({algorithm, actionType, passphrase, message}){
    let result;
    console.log(algorithm);
    if(actionType == 'encrypt'){
        result = algorithms[algorithm].encrypt(message, passphrase);
    } else if(actionType == 'decrypt'){
        result = algorithms[algorithm].decrypt(message, passphrase);
        result = result.toString(CryptoJS.enc.Utf8);
    }
    updateDiv(result, 'result');
    copyResultBtn.textContent = 'Copy';
}