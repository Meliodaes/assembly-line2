import {showMenu} from './ui.js';
import {modifPreview, accept, cancel} from './main.js';

//Instanciate function
window.showMenu = showMenu;
window.modifPreview = modifPreview;
window.accept = accept;
window.cancel = cancel;

//Cancel selection
document.onselectstart = (e) => {e.preventDefault();}; 