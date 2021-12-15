const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var dlCode = urlParams.get("dl"), QR, IODBackground = document.createElement("style");
const SidePanel = document.getElementById("sidePanel");
const SPHeights = {"Home": "336px", "Send": "339px", "Receive": "193px", "Done": "299px"};

if (dlCode != undefined || dlCode != null) {
    document.getElementById("homePanel").style.display = "none";
    document.getElementById("downloadPanel").style.display = "block";
    document.getElementById("downloadPanel").style.opacity = "1";
    FileDownload(dlCode);
} else {
    SidePanel.style.height = SPHeights.Home;
}

(async function () {
    try {
        var utilsResponse = await fetch("https://tgpsi-utils.herokuapp.com/imageofday");
        var Img = await utilsResponse.json();
        IODBackground.innerHTML = `#main { background-image: url(${Img.URL}); }`;
    } catch (error) {
        console.warn("Usando o fundo pré definido!");
        IODBackground.innerHTML = "#main { background-image: url(./assets/overview.jpg); }";
    }
    document.getElementsByTagName("head")[0].appendChild(IODBackground);
})();


// LISTENERS

document.getElementById("openSendButton").addEventListener("click", () => {
    document.getElementById("homePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("homePanel").style.display = "none";
        SidePanel.style.height = SPHeights.Send;
        document.getElementById("sendPanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("sendPanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("openReceiveButton").addEventListener("click", () => {
    document.getElementById("homePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("homePanel").style.display = "none";
        SidePanel.style.height = SPHeights.Receive;
        document.getElementById("receivePanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("receivePanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("footerBackS").addEventListener("click", () => {
    if (!document.getElementById("footerBackS").hasAttribute("lock")) {
        document.getElementById("sendPanel").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("sendPanel").style.display = "none";
            SidePanel.style.height = SPHeights.Home;
            document.getElementById("homePanel").style.display = "block";
            setTimeout(() => {
                document.getElementById("homePanel").style.opacity = "1";
            }, 400);
        }, 400);
    }
});

document.getElementById("footerBackR").addEventListener("click", () => {
    document.getElementById("receivePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("receivePanel").style.display = "none";
        SidePanel.style.height = SPHeights.Home;
        document.getElementById("receiveDetails").style.visibility = "hidden";
        document.getElementById("receiveMessage").classList.remove("rmAnimate");
        document.getElementById("homePanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("homePanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("filesInputBox").addEventListener("click", () => {
    if (!document.getElementById("filesInputBox").hasAttribute("lock")) {
        document.getElementById("filesInput").click();
    }
});

document.getElementById("fileCode").addEventListener("keyup", (event) => {
    if (document.getElementById("fileCode").value.length == 0) {
        document.getElementById("filesReceive").disabled = true;
    }
    else {
        document.getElementById("filesReceive").disabled = false;
        if (event.key == "Enter")
            FileReceive();
    }
});

document.getElementById("doneImg").addEventListener("click", () => {
    document.getElementById("homePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("homePanel").style.display = "none";
        SidePanel.style.height = SPHeights.Done;
        document.getElementById("donePanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("donePanel").style.opacity = "1";
        }, 400);
    }, 400);
});

const resizeObserverR = new ResizeObserver(entries => {
    if (entries[0].target.clientWidth > 171) {
        document.getElementById("receiveMessage").style.animation = "movetxt 7s linear infinite";
    }
    else {
        document.getElementById("receiveMessage").removeAttribute("style");
    }
});

resizeObserverR.observe(document.getElementById("receiveMessage"));

const resizeObserverD = new ResizeObserver(entries => {
    if (entries[0].target.clientWidth > 171) {
        document.getElementById("downloadMessage").style.animation = "movetxt 7s linear infinite";
    }
    else {
        document.getElementById("downloadMessage").removeAttribute("style");
    }
});

resizeObserverD.observe(document.getElementById("downloadMessage"));


// FUNCTIONS

function CopyToClipboard() {
    var copyText = document.getElementById("outputCode").innerHTML;
    copyText = `https://tgpsi-share.netlify.app/?dl=${copyText}`;
    var TextArea = document.createElement("textarea");
    TextArea.value = copyText;
    document.body.appendChild(TextArea);
    TextArea.select();
    TextArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(TextArea);
    document.getElementById("doneCopy").innerText = "Copiado!";
    setTimeout(() => {
        document.getElementById("doneCopy").innerText = "Copiar Link";
    }, 3000);
}

function BackD() {
    document.getElementById("donePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("donePanel").style.display = "none";
        SidePanel.style.height = SPHeights.Home;
        document.getElementById("homePanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("homePanel").style.opacity = "1";
        }, 400);
    }, 400);
}

async function CreateQRCode() {
    var CodeQR = `https://tgpsi-share.netlify.app/?dl=t-${document.getElementById("outputCode").innerHTML}` ;
    new QRious({
        element: document.getElementsByTagName("canvas")[0],
        value: CodeQR,
        backgroundAlpha: 0,
        foreground: "#007aff",
        size: 140
    });
    document.getElementById("doneInfo").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("doneInfo").style.display = "none";
        document.getElementById("footerBackD").onclick = function() { BackDQR(); };
        document.getElementById("doneQR").style.display = "flex";
        setTimeout(() => {
            document.getElementById("doneQR").style.opacity = "1";
        }, 400);
    }, 400);
}

function BackDQR() {
    document.getElementById("doneQR").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("doneQR").style.display = "none";
        document.getElementById("footerBackD").onclick = function() { BackD(); };
        document.getElementById("doneInfo").style.display = "block";
        setTimeout(() => {
            document.getElementById("doneInfo").style.opacity = "1";
        }, 400);
    }, 400);
}

async function dragAndDrop(event, mode) {
    event.preventDefault();
    event.stopPropagation();
    if (!document.getElementById("filesInputBox").hasAttribute("lock")) {
        if (mode == "over") {
            document.getElementById("filesChoose").innerText = "Preparado para enviar!";
            document.getElementById("filesDrop").innerText = "Apenas larga-o e eu trato do resto!";
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById("filesInputBox").style.borderColor = "var(--dark-air-l5)";
            }
            else {
                document.getElementById("filesInputBox").style.borderColor = "var(--light-air-l5)";
            }
        }
        else {
            if (mode == "leave") {
                document.getElementById("filesChoose").innerText = "Escolher ficheiros";
                document.getElementById("filesDrop").innerText = "Ou arraste para aqui!";
                if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.getElementById("filesInputBox").style.borderColor = "var(--dark-air-l3)";
                }
                else {
                    document.getElementById("filesInputBox").style.borderColor = "var(--light-air-l3)";
                }
            }
            else {
                if (mode == "drop") {
                    document.getElementById("filesChoose").innerText = "Escolher ficheiros";
                    document.getElementById("filesDrop").innerText = "Ou arraste para aqui!";
                    colorizeBorder();
                    FilePrepare(event, 1);
                }
            }
        }
    }
}

async function colorizeBorder() {
    var borderColors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#5856D6", "#AF52DE"];
    for (const color of borderColors) {
        document.getElementById("filesInputBox").style.borderColor = color;
        await sleep(200);
    }
    document.getElementById("filesInputBox").removeAttribute("style");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("footerBackD").onclick = function() {
    BackD();
};