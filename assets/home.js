(async function () {
    let randomQuery = null;
    if (Math.floor(Math.random() * 2) == 0)
        randomQuery = "cliffs";
    else
        randomQuery = "city";

    let upInfo = await fetch("https://api.unsplash.com/photos/random?query=" + randomQuery + "&orientation=landscape", {
        method: "GET",
        headers: {
            Authorization: "Client-ID MkmaXl5HCFr1psAbRtB_LBIFirxvm2jBBd6whLChuWo"
        }
    });
    upInfo = await upInfo.json();

    document.body.style.backgroundImage = "url(" + upInfo.urls.full + ")";
    document.getElementById("attribution").setAttribute("href", upInfo.user.links.html);
    document.querySelector("#attribution > span").innerHTML = upInfo.user.name;
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