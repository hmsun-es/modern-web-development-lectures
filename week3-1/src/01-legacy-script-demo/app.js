var keywordInput = document.querySelector("#keyword");
var statusFilter = document.querySelector("#status-filter");
var searchButton = document.querySelector("#search-button");
var resultCount = document.querySelector("#result-count");
var resultList = document.querySelector("#result-list");

function renderResults(items) {
    resultList.innerHTML = "";
    resultCount.textContent = "검색 결과 " + items.length + "건";

    items.forEach(function appendItem(item) {
        var listItem = document.createElement("li");
        listItem.textContent = item.title + " (" + item.status + ")";
        resultList.appendChild(listItem);
    });

    if (items.length === 0) {
        resultList.innerHTML = "<li>조건에 맞는 항목이 없습니다.</li>";
    }
}

function runSearch() {
    var items = window.filterSecrets(keywordInput.value, statusFilter.value);
    renderResults(items);
}

searchButton.addEventListener("click", runSearch);
runSearch();