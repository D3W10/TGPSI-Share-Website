document.getElementsByTagName("button")[0].addEventListener("click", async () => {
    let pageIndex = 1, ghInfo;

    do {
        ghInfo = await fetch(`https://api.github.com/repos/D3W10/TGPSI-Share/releases?per_page=1&page=${pageIndex}`, {
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