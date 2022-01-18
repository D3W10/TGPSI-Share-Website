(async function () {
    let panelSizes = { "homePanel": "295px", "downloadPanel": "236px" };
    let randomQuery = null, unsplashAK = document.getElementsByTagName("meta")[5].content;
    document.getElementsByTagName("meta")[5].remove();
    document.getElementById("card").style.height = panelSizes.homePanel;

    if (Math.floor(Math.random() * 2) == 0)
        randomQuery = "cliff";
    else
        randomQuery = "city";

    let upInfo = await fetch("https://api.unsplash.com/photos/random?query=" + randomQuery + "&orientation=landscape", {
        method: "GET",
        headers: {
            Authorization: "Client-ID " + unsplashAK
        }
    });
    upInfo = await upInfo.json();

    document.body.style.backgroundImage = "url(" + upInfo.urls.full + ")";
    document.getElementById("attribution").setAttribute("href", upInfo.user.links.html + "?utm_source=TGPSI%20Share&utm_medium=referral");
    document.querySelector("#attribution > span").innerHTML = upInfo.user.name;

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("dl") != null) {
        document.getElementById("homePanel").style.opacity = "0";
        await Sleep(400);
        document.getElementById("homePanel").style.display = "none";
        document.getElementById("card").style.height = panelSizes.downloadPanel;
        document.getElementById("downloadPanel").style.display = "block";
        await Sleep(400);
        document.getElementById("downloadPanel").style.opacity = "1";
        await Sleep(900);
        
        window.location.assign("tgpsi-share://download/" + urlParams.get("dl"));

        await Sleep(2500);
        document.getElementById("downloadPanel").style.opacity = "0";
        await Sleep(400);
        document.getElementById("downloadPanel").style.display = "none";
        document.getElementById("card").style.height = panelSizes.homePanel;
        document.getElementById("homePanel").style.display = "block";
        await Sleep(400);
        document.getElementById("homePanel").style.opacity = "1";
    }
}());

document.getElementsByTagName("button")[0].addEventListener("click", async () => {
    let pageIndex = 1, ghInfo;

    do {
        ghInfo = await fetch(`https://api.github.com/repos/D3W10/TGPSI-Share/releases?per_page=1&page=${pageIndex}`, {
            method: "GET",
            headers: {
                accept: "application/vnd.github.v3+json"
            }
        });
        ghInfo = await ghInfo.json();
        pageIndex++;
    }
    while (ghInfo[0].prerelease == true)

    window.open(ghInfo[0].assets[0].browser_download_url, "_self");
});

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}