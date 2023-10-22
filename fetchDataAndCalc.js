chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.url.includes("userdata")) {
            const isExtensionRequest = details.requestHeaders.some(
                (header) =>
                    header.name === "SentByExtension" && header.value === "true"
            );

            if (!isExtensionRequest) {
                resendRequest(details.url, details.requestHeaders);
            }
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

function resendRequest(url, headersArray) {
    let formattedHeaders = {};
    for (let header of headersArray) {
        formattedHeaders[header.name] = header.value;
    }

    formattedHeaders["SentByExtension"] = "true";

    fetch(url, {
        method: "GET",
        headers: formattedHeaders,
    })
        .then((response) => response.json())
        .then((data) => {
            calcRemainingCheckIns(data.responseData.activities);
        })
        .catch((error) => {
            //console.error("Error:", error);
        });
}

function calcRemainingCheckIns(activitiesArray) {
    //attendance1
    //attendance2
    //attendance3

    // 10 = presente
    // 0 = falta
    // -1 = data futura

    let missedCheckIns = 0;
    let futureCheckIns = 0;
    let completedCheckIns = 0;

    let classDays = 0;

    activitiesArray.forEach((activity) => {
        if (!activity.date) return;

        classDays++;
        for (let i = 1; i <= 3; i++) {
            const attendance = activity[`attendance${i}`];

            if (attendance === 10) completedCheckIns++;
            else if (attendance === 0) missedCheckIns++;
            else if (attendance === -1) futureCheckIns++;
        }
    });

    const totalCheckIns = classDays * 3;
    const totalCheckInsLostToEndWith25 = totalCheckIns * 0.25;
    const remainingCheckInsToLoose = Math.floor(
        totalCheckInsLostToEndWith25 - missedCheckIns
    );

    console.log(
        "Você ainda pode perder ",
        remainingCheckInsToLoose,
        " check-ins"
    );
}
