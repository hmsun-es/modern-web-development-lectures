export function filterSecrets(items, keyword, status) {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return items.filter((item) => {
        const matchesKeyword =
            normalizedKeyword.length === 0 || item.title.toLowerCase().includes(normalizedKeyword);
        const matchesStatus = status === "all" || item.status === status;

        return matchesKeyword && matchesStatus;
    });
}