document.addEventListener("DOMContentLoaded", function () {
    const checkinsLeftDiv = document.getElementById("remaining-check-ins");

    chrome.storage.local.get("remainingCheckInsToMiss", function (data) {
        let remaining = data.remainingCheckInsToMiss;
        checkinsLeftDiv.textContent = `Você ainda pode perder ${remaining} check-ins para chegar a 24%.`;
    });
});
