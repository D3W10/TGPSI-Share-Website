async function FileReceive() {
    document.getElementsByClassName('filesReceive')[0].disabled = true;
    var LoadIcon = document.createElement("img");
    LoadIcon.src = "./assets/icons/load.gif";
    LoadIcon.classList.add("sideFooterLoad");
    LoadIcon.style.marginTop = "8px";
    document.getElementsByClassName("sideFooterBtn")[1].insertBefore(LoadIcon, document.getElementsByClassName("filesReceive")[0]);
    let FRCode = document.getElementById("fileCode").value;
    var HerokuResult = await fetch(`https://tgpsi-share.herokuapp.com/${FRCode}`, {
        method: "GET"
    });
    HerokuResult = await HerokuResult.json();
    if (HerokuResult.downloadURI == "Invalid Code") {
        document.getElementsByClassName("receiveError")[0].innerHTML = "Este código é inválido!";
        document.getElementsByClassName("receiveError")[0].style.visibility = "visible";
    }
    else {
        document.getElementsByClassName("sideFooterBtn")[1].removeChild(LoadIcon);
        FinishDL(HerokuResult.downloadURI);
    }
    document.getElementsByClassName("filesReceive")[0].disabled = false;
}

async function FileDownload(FRCode) {
    var HerokuResult = await fetch(`https://tgpsi-share.herokuapp.com/${FRCode}`, {
        method: "GET"
    });
    HerokuResult = await HerokuResult.json();
    if (HerokuResult.downloadURI == "Invalid Code") {
        document.getElementsByClassName("downloadImg")[0].style = "";
        document.getElementsByClassName("downloadImg")[0].src = "./assets/icons/error.svg";
        document.getElementsByClassName("downloadH")[0].innerHTML = "Código Inválido!";
        document.getElementsByClassName("downloadP")[0].innerHTML = "Este código não é válido, verifique se o link é o correto.";
        document.getElementsByClassName("homeDiv")[2].removeChild(document.getElementById("b-download"));
    }
    else {
        document.getElementsByClassName("downloadImg")[0].style = "";
        document.getElementsByClassName("downloadImg")[0].src = "./assets/icons/download.svg";
        document.getElementsByClassName("downloadH")[0].innerHTML = "Está pronto!";
        document.getElementsByClassName("downloadP")[0].innerHTML = "O ficheiro está preparado para ser transferido!";
        document.getElementById("b-download").on = false;
        document.getElementById("b-download").onclick = function () { FinishDL(`${HerokuResult.downloadURI}`) };
        document.getElementById("b-download").disabled = false;
    }
}

async function FinishDL(URI) {
    window.open(URI, "_self");
}