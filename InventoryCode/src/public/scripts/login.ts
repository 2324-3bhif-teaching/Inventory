import {initKeycloak, keycloak} from "./keycloak";


export function loadKeyCloak() {
    initKeycloak().then((authenticated) => {
        if (authenticated){
            location.href = "index.html";
        }
    });

    const loginbtn = document.getElementById("login");

    if(loginbtn){
        loginbtn.addEventListener("click", () => {
            keycloak.login().then(() => {
                location.href = "index.html";
            });
        });
    }else{
        console.error("Element with ID 'login' not found");
    }

}
(window as any).loadKeyCloak = loadKeyCloak;
