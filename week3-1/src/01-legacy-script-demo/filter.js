window.filterSecrets = function filterSecrets(keyword, status) {
    var normalizedKeyword = keyword.trim().toLowerCase();

    return window.secretCatalog.filter(function filterItem(item) {
        var matchesKeyword =
            normalizedKeyword.length === 0 || item.title.toLowerCase().indexOf(normalizedKeyword) >= 0;
        var matchesStatus = status === "all" || item.status === status;

        return matchesKeyword && matchesStatus;
    });
};