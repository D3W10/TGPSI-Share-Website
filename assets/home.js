const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var dlCode = urlParams.get("dl"), QR;
const SidePanel = document.getElementsByClassName("sidePanel")[0];
const SPHeights = {"Home": "316px", "Send": "336px", "Receive": "173px", "Done": "279px"}

if (dlCode != undefined || dlCode != null) {
    document.getElementById("homePanel").style.display = "none";
    document.getElementById("downloadPanel").style.display = "block";
    document.getElementById("downloadPanel").style.opacity = "1";
    FileDownload(dlCode);
}
else {
    SidePanel.style.height = SPHeights.Home;
}

async function ImageOfTheDay() {
    try {
        var response123 = await fetchWithTimeout("https://cors-anywhere.herokuapp.com/https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1", {
            timeout: 3500
        });
        var res1245 = await response123.json();
        var ImgURL = res1245.images[0].url;
        ImgURL = "https://www.bing.com" + ImgURL;
        document.getElementById("main").style.backgroundImage = `url(${ImgURL})`;
    }
    catch (error) {
        console.warn("Usando o fundo pré definido!");
        document.getElementById("main").style.backgroundImage = "url(./assets/overview.jpg)";
    }
}

async function fetchWithTimeout(resource, options) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
    });
    clearTimeout(id);
  
    return response;
}

ImageOfTheDay();

// LISTENERS

document.getElementById("send").addEventListener("click", () => {
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

document.getElementById("receive").addEventListener("click", () => {
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
        document.getElementById("homePanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("homePanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("filesInputB").addEventListener("click", () => {
    if (!document.getElementById("filesInputB").hasAttribute("lock")) {
        document.getElementById("filesInput").click();
    }
});

document.getElementById("fileCode").addEventListener("keyup", (event) => {
    if (document.getElementById("fileCode").value.length == 0) {
        document.getElementsByClassName("filesReceive")[0].disabled = true;
    }
    else {
        document.getElementsByClassName("filesReceive")[0].disabled = false;
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

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (document.getElementById("qrCode") != null) {
        var QRContent = document.getElementById("qrCode").src.match(/(?<=\?data=)(.*)(?=&color=)/g);
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.getElementById("qrCode").src = `https://api.qrserver.com/v1/create-qr-code/?data=${QRContent}&color=007aff&bgcolor=000000`;
        }
        else {
            document.getElementById("qrCode").src = `https://api.qrserver.com/v1/create-qr-code/?data=${QRContent}&color=007aff&bgcolor=ffffff`;
        }
    }
});

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

function CreateQRCode() {
    var CodeQR = document.getElementById("outputCode").innerHTML;
    CodeQR = `https://tgpsi-share.netlify.app/?dl=t-${CodeQR}`;
    var LDM;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        LDM = "000000";
    }
    else {
        LDM = "ffffff";
    }
    QR = document.createElement("img");
    QR.src = `https://api.qrserver.com/v1/create-qr-code/?data=${CodeQR}&color=007aff&bgcolor=${LDM}`;
    QR.style.width = "140px";
    QR.style.height = "140px";
    QR.id = "qrCode";
    document.getElementById("doneQR").appendChild(QR);
    document.getElementById("doneInfo").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("doneInfo").style.display = "none";
        document.getElementById("footerBackD").onclick = function() {BackDQR()};
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
        document.getElementById("footerBackD").onclick = function() {BackD()};
        document.getElementById("doneQR").removeChild(QR);
        document.getElementById("doneInfo").style.display = "block";
        setTimeout(() => {
            document.getElementById("doneInfo").style.opacity = "1";
        }, 400);
    }, 400);
}

async function dragAndDrop(event, mode) {
    event.preventDefault();
    event.stopPropagation();
    if (!document.getElementById("filesInputB").hasAttribute("lock")) {
        if (mode == "over") {
            document.getElementById("filesChoose").innerText = "Preparado para enviar!";
            document.getElementById("filesDrop").innerText = "Apenas larga-o e eu trato do resto!";
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById("filesInputB").style.borderColor = "var(--dark-grey-plus-plus)";
            }
            else {
                document.getElementById("filesInputB").style.borderColor = "var(--light-grey-plus-plus)";
            }
        }
        else {
            if (mode == "leave") {
                document.getElementById("filesChoose").innerText = "Escolher ficheiros";
                document.getElementById("filesDrop").innerText = "Ou arraste para aqui!";
                if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.getElementById("filesInputB").style.borderColor = "var(--dark-grey)";
                }
                else {
                    document.getElementById("filesInputB").style.borderColor = "var(--light-grey)";
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

function colorizeBorder() {
    document.getElementById("filesInputB").style.borderColor = "#FF3B30";
    setTimeout(() => {
        document.getElementById("filesInputB").style.borderColor = "#FF9500";
        setTimeout(() => {
            document.getElementById("filesInputB").style.borderColor = "#FFCC00";
            setTimeout(() => {
                document.getElementById("filesInputB").style.borderColor = "#34C759";
                setTimeout(() => {
                    document.getElementById("filesInputB").style.borderColor = "#007AFF";
                    setTimeout(() => {
                        document.getElementById("filesInputB").style.borderColor = "#5856D6";
                        setTimeout(() => {
                            document.getElementById("filesInputB").style.borderColor = "#AF52DE";
                            setTimeout(() => {
                                document.getElementById("filesInputB").removeAttribute("style");
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
    }, 200);
}

document.getElementById("footerBackD").onclick = function() {
    BackD();
};