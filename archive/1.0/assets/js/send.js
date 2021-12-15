const APIKey = "qYrf0foxOCaGK1TNs4DMV8mtlLlmR5w18HZKazDd";
var FilesInfoBridge, WTFileList = new Array(), RCount = 0, byteUnits = ["Bytes", "KB", "MB", "GB", "TB"], embedColors = ["16008636", "16235336", "55286", "16346225", "10364831", "16744085", "27858"], lastType;

function FilePrepare(event, type) {
    let fileSizeTxtTotal = 0;
    document.getElementsByClassName("filesSend")[0].disabled = false;
    if (type == 1) {
        FilesInfoBridge = event.dataTransfer.files;
        for (let i = 0; i < FilesInfoBridge.length; i++)
            fileSizeTxtTotal += FilesInfoBridge[i].size
        do {
            fileSizeTxtTotal /= 1024;
            RCount++;
        } while (fileSizeTxtTotal > 1024);
        document.getElementById("sendSize").innerHTML = `${fileSizeTxtTotal.toFixed(2)} ${byteUnits[RCount]}`;
        document.getElementsByClassName("sendDetails")[0].style.visibility = "visible";
    }
    else {
        FilesInfoBridge = event.srcElement.files;
        for (let i = 0; i < FilesInfoBridge.length; i++)
            fileSizeTxtTotal += FilesInfoBridge[i].size
        do {
            fileSizeTxtTotal /= 1024;
            RCount++;
        } while (fileSizeTxtTotal > 1024);
        document.getElementById("sendSize").innerHTML = `${fileSizeTxtTotal.toFixed(2)} ${byteUnits[RCount]}`;
        document.getElementsByClassName("sendDetails")[0].style.visibility = "visible";
    }
    RCount = 0;
    addFiles(event, type, 0);
}

function addFiles(event, type, reverse) {
    if (reverse == 0) {
        var fileDiv, fileName, fileNameTxt, fileSize = 0, fileSizeTxt = 0;
        document.getElementsByClassName("filesText")[0].style.display = "none";
        document.getElementById("filesDiv").style.justifyContent = "unset";
        document.getElementById("filesDiv").style.alignItems = "unset";
        document.querySelectorAll(".filesDivT").forEach(function(FileElmt) {
            FileElmt.remove();
        });
        if (type == 1) {
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                fileDiv = document.createElement("div");
                fileDiv.classList.add("filesDivT");
                fileName = document.createElement("span");
                fileNameTxt = event.dataTransfer.files[i].name.replace(/.*[\/\\]/, "");
                if (fileNameTxt.length > 20) {
                    fileNameTxt = fileNameTxt.slice(0, 20);
                    fileNameTxt = `${fileNameTxt}...`;
                }
                fileName.innerHTML = fileNameTxt;
                fileName.classList.add("filesDivTT");
                fileSize = document.createElement("span");
                fileSizeTxt = event.dataTransfer.files[i].size;
                do {
                    fileSizeTxt /= 1024;
                    RCount++;
                } while (fileSizeTxt > 1024);
                fileSize.innerHTML = `${fileSizeTxt.toFixed(2)} ${byteUnits[RCount]}`;
                fileDiv.appendChild(fileName);
                fileDiv.appendChild(fileSize);
                document.getElementById("filesDiv").style.display = "block";
                document.getElementById("filesDiv").style.justifyContent = "unset";
                document.getElementById("filesDiv").style.alignItems = "unset";
                document.getElementById("filesDiv").appendChild(fileDiv);
                RCount = 0;
            }
        }
        else {
            for (let i = 0; i < event.srcElement.files.length; i++) {
                fileDiv = document.createElement("div");
                fileDiv.classList.add("filesDivT");
                fileName = document.createElement("span");
                fileNameTxt = event.srcElement.files[i].name.replace(/.*[\/\\]/, '');
                if (fileNameTxt.length > 20) {
                    fileNameTxt = fileNameTxt.slice(0, 20);
                    fileNameTxt = `${fileNameTxt}...`;
                }
                fileName.innerHTML = fileNameTxt;
                fileName.classList.add("filesDivTT");
                fileSize = document.createElement("span");
                fileSizeTxt = event.srcElement.files[i].size;
                do {
                    fileSizeTxt /= 1024;
                    RCount++;
                } while (fileSizeTxt > 1024);
                fileSize.innerHTML = `${fileSizeTxt.toFixed(2)} ${byteUnits[RCount]}`;
                fileDiv.appendChild(fileName);
                fileDiv.appendChild(fileSize);
                document.getElementById("filesDiv").style.display = "block";
                document.getElementById("filesDiv").style.justifyContent = "unset";
                document.getElementById("filesDiv").style.alignItems = "unset";
                document.getElementById("filesDiv").appendChild(fileDiv);
                RCount = 0;
            }
        }
        lastType = type;
    }
    else {
        document.getElementsByClassName("filesText")[0].style.display = "block";
        document.getElementById("filesDiv").style.display = "flex";
        document.getElementById("filesDiv").style.justifyContent = "center";
        document.getElementById("filesDiv").style.alignItems = "center";
        document.querySelectorAll(".filesDivT").forEach(function(FileElmt) {
            FileElmt.remove();
        });
    }
}

async function FileSend() {
    if (FilesInfoBridge != undefined) {
        document.getElementById("footerBackS").setAttribute("lock", "");
        document.getElementById("filesInputB").setAttribute("lock", "");
        document.getElementsByClassName('filesSend')[0].disabled = true;
        var LoadIcon = document.createElement("img");
        LoadIcon.src = "./assets/icons/load.gif";
        LoadIcon.classList.add("sideFooterLoad");
        document.getElementsByClassName("sideFooterBtn")[0].insertBefore(LoadIcon, document.getElementsByClassName("filesSend")[0]);
        // PART 1 - START
        let response1 = await fetch('https://dev.wetransfer.com/v2/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${APIKey}`
            },
            body: JSON.stringify({ "user_identifier": "5eb6b98e-ddaa-4f5b-9d03-7bd4d91aa05f" })
        });
        if (response1.status !== 200)
            return console.warn('Parece que houve um problema. Código de Erro: ' + response1.status);
        let data1 = await response1.json()
        const Token = data1.token;
        console.info("Parte 1 - Completa");
        document.getElementsByClassName("sendProgressBar")[0].style.width = "5%";
        // PART 1 - END

        // PART 2 - START
        for (let i = 0; i < FilesInfoBridge.length; i++)
            WTFileList[i] = {"name": `${FilesInfoBridge[i].name}`, "size": `${FilesInfoBridge[i].size}`}
        let response2 = await fetch('https://dev.wetransfer.com/v2/transfers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${APIKey}`,
                'Authorization': `Bearer ${Token}`
            },
            body: JSON.stringify({ "message": "TGPSI Share", "files": WTFileList })
        });
        if (response2.status !== 201)
            return console.warn('Parece que houve um problema. Código de Erro: ' + response2.status);
        let data2 = await response2.json()
        console.info("Parte 2 - Completa");
        document.getElementsByClassName("sendProgressBar")[0].style.width = "10%";
        // PART 2 - END

        // PART 3 - START
        var ProgressBarSplit = 90 / FilesInfoBridge.length;
        for (let i = 0; i < FilesInfoBridge.length; i++) {
            let response3 = await fetch(`https://dev.wetransfer.com/v2/transfers/${data2.id}/files/${data2.files[i].id}/upload-url/1`, {
                method: 'GET',
                headers: {
                    'x-api-key': `${APIKey}`,
                    'Authorization': `Bearer ${Token}`
                }
            });
            if (response3.status !== 200)
                return console.warn('Parece que houve um problema. Código de Erro: ' + response3.status);
            let data3 = await response3.json()
            console.info(`Parte 3.${i + 1} - Completa`);
            document.getElementsByClassName("sendProgressBar")[0].style.width = `${Number(document.getElementsByClassName("sendProgressBar")[0].style.width.replace("%", "")) + ProgressBarSplit / 3}%`;
            // PART 3 - END

            // PART 4 - START
            let response4 = await fetch(`${data3.url}`, {
                method: 'PUT',
                body: FilesInfoBridge[i]
            });
            console.info(`Parte 4.${i + 1} - Completa`);
            document.getElementsByClassName("sendProgressBar")[0].style.width = `${Number(document.getElementsByClassName("sendProgressBar")[0].style.width.replace("%", "")) + ProgressBarSplit / 3}%`;
            // PART 4 - END

            // PART 5 - START
            let response5 = await fetch(`https://dev.wetransfer.com/v2/transfers/${data2.id}/files/${data2.files[i].id}/upload-complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${APIKey}`,
                    'Authorization': `Bearer ${Token}`
                },
                body: JSON.stringify({ "part_numbers": 1 })
            });
            if (response5.status !== 200)
                return console.warn('Parece que houve um problema. Código de Erro: ' + response5.status);
            console.info(`Parte 5.${i + 1} - Completa`);
            document.getElementsByClassName("sendProgressBar")[0].style.width = `${Number(document.getElementsByClassName("sendProgressBar")[0].style.width.replace("%", "")) + ProgressBarSplit / 3}%`;
            // PART 5 - END
        }
        // PART 6 - START
        let response6 = await fetch(`https://dev.wetransfer.com/v2/transfers/${data2.id}/finalize`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${APIKey}`,
                'Authorization': `Bearer ${Token}`
            }
        });
        if (response6.status !== 200)
            return console.warn('Parece que houve um problema. Código de Erro: ' + response6.status);
        let data6 = await response6.json()
        console.info("Parte 6 - Completa");
        document.getElementsByClassName("sendProgressBar")[0].style.width = "100%";
        // PART 6 - END

        // PART 7 - START
        var outputURL = data6.url.replace("https://we.tl/t-", "");
        document.getElementById("outputCode").innerHTML = outputURL;
        let randomColorNum = Math.floor(Math.random() * 7);
        let response7 = await fetch("https://discord.com/api/webhooks/780517198808350753/g4eBIPOZEyOwQfJ-xCdh5UMdYshM6Wtfq5tk8E_Uab6a-YS6Op9q9-d2CGCYTqtGlVSa", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "embeds": [ { "title": "TGPSI Share", "description": `Alguém acabou de enviar um novo ficheiro para o TGPSI Share!\`\`\`${outputURL}\`\`\`\n[Transferir Agora](${data6.url})`, "color": `${embedColors[randomColorNum]}` } ] })
        });
        // PART 7 - END

        document.getElementById("sendPanel").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("sendPanel").style.display = "none";
            document.getElementsByClassName("sidePanel")[0].style.height = "279px";
            document.getElementsByClassName("sendProgressBar")[0].style.width = "0%";
            document.getElementsByClassName("sideFooterBtn")[0].removeChild(LoadIcon);
            document.getElementById("footerBackS").removeAttribute("lock");
            document.getElementById("filesInputB").removeAttribute("lock");
            document.getElementById("doneImg").style.visibility = "visible";
            document.getElementsByClassName("sendDetails")[0].style.visibility = "hidden";
            addFiles(undefined, undefined, 1);
            document.getElementById("donePanel").style.display = "block";
            setTimeout(() => {
                document.getElementById("donePanel").style.opacity = "1";
            }, 400);
        }, 400);
    }
}