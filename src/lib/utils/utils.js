export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function screenAnimation(identifier, anim) {
    document.querySelector(identifier).style.display = "block";
    document.querySelector(identifier).style.animation = `2s ease-in 0s 1 normal forwards running ${anim}`;
}

document.onselectstart = (e) => {e.preventDefault();}; 