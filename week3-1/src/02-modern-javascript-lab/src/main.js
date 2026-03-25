import { secretCatalog } from "./data.js";
import { filterSecrets } from "./filterSecrets.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main>
    <h1>Modern JavaScript Lab</h1>
    <p id="result-count"></p>
    <div>
      <input id="keyword" type="text" placeholder="keyword 입력" />
      <select id="status-filter">
        <option value="all">전체</option>
        <option value="active">active</option>
        <option value="archived">archived</option>
      </select>
      <button id="search-button" type="button">검색</button>
    </div>
    <ul id="result-list"></ul>
  </main>
`;

const keywordInput = document.querySelector("#keyword");
const statusFilter = document.querySelector("#status-filter");
const searchButton = document.querySelector("#search-button");
const resultCount = document.querySelector("#result-count");
const resultList = document.querySelector("#result-list");

function renderResults(items) {
    resultCount.textContent = `검색 결과 ${items.length}건`;
    resultList.innerHTML = items.length
        ? items.map((item) => `<li>${item.title} (${item.status})</li>`).join("")
        : "<li>조건에 맞는 항목이 없습니다.</li>";
}

function runSearch() {
    const items = filterSecrets(secretCatalog, keywordInput.value, statusFilter.value);
    renderResults(items);
}

searchButton.addEventListener("click", runSearch);
runSearch();