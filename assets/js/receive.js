async function FileReceive() {
    document.getElementById("filesReceive").disabled = true;
    var LoadIcon = document.createElement("img");
    LoadIcon.src = "./assets/icons/load.gif";
    LoadIcon.classList.add("sideFooterLoad");
    LoadIcon.style.marginTop = "8px";
    document.getElementsByClassName("sideFooterBtn")[1].insertBefore(LoadIcon, document.getElementById("filesReceive"));
    let FRCode = document.getElementById("fileCode").value;
    var HerokuResult = await fetch(`https://tgpsi-share.herokuapp.com/${FRCode}`, {
        method: "GET"
    });
    HerokuResult = await HerokuResult.json();
    if (HerokuResult.downloadURI == "Invalid Code") {
        document.getElementById("receiveError").innerHTML = "Este código é inválido!";
        document.getElementById("receiveDetails").style.display = "none";
        document.getElementById("receiveMessage").classList.remove("rmAnimate");
        document.getElementById("receiveError").style.display = "block";
        LoadIcon.parentElement.removeChild(LoadIcon);
    }
    else {
        document.getElementsByClassName("sideFooterBtn")[1].removeChild(LoadIcon);
        await FinishDL(HerokuResult.downloadURI);
        document.getElementById("receiveMessage").innerHTML = HerokuResult.content.description;
        if (document.getElementById("receiveMessage").getBoundingClientRect().width > 171) {
            document.getElementById("receiveMessage").classList.add("rmAnimate");
        }
        else {
            document.getElementById("receiveMessageLimit").style.textAlign = "right";
            document.getElementById("receiveMessage").style.position = "unset";
        }
        document.getElementById("receiveError").style.display = "none";
        document.getElementById("receiveDetails").style.display = "flex";
        document.getElementById("receiveDetails").style.visibility = "visible";
    }
    document.getElementById("filesReceive").disabled = false;
}

async function FileDownload(FRCode) {
    var HerokuResult = await fetch(`https://tgpsi-share.herokuapp.com/${FRCode}`, {
        method: "GET"
    });
    HerokuResult = await HerokuResult.json();
    if (HerokuResult.downloadURI == "Invalid Code") {
        document.getElementById("downloadImg").style = "";
        document.getElementById("downloadImg").src = "./assets/icons/error.svg";
        document.getElementById("downloadH").innerHTML = "Código Inválido!";
        document.getElementById("downloadP").innerHTML = "Este código não é válido, verifique se o link é o correto.";
        document.getElementsByClassName("homeDiv")[2].removeChild(document.getElementById("b-download"));
    }
    else {
        document.getElementById("downloadImg").style = "";
        document.getElementById("downloadImg").src = "./assets/icons/download.svg";
        document.getElementById("downloadH").innerHTML = "Está pronto!";
        document.getElementById("downloadP").innerHTML = "O ficheiro está preparado para ser transferido!";
        let Expire = HerokuResult.content.expires_at.split("T");
        let ExpireS = Expire[0].split("-");
        let ExpireDate = ExpireS[2] + "/" + ExpireS[1] + "/" + ExpireS[0] + " " + Expire[1].replace("Z", "");
        document.getElementById("downloadExpire").innerHTML = ExpireDate;
        document.getElementsByClassName("downloadDetails")[0].style.display = "flex";
        document.getElementById("downloadMessage").innerHTML = HerokuResult.content.description;
        document.getElementsByClassName("downloadDetails")[1].style.display = "flex";
        document.getElementById("b-download").onclick = function () { FinishDL(`${HerokuResult.downloadURI}`) };
        document.getElementById("b-download").disabled = false;
    }
}

async function FinishDL(URI) {
    window.open(URI, "_self");
}