const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return null;
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    return dateStr;
};

const getMonthFromDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const isDateInMonth = (dateStr, monthStr) => {
    if (!dateStr || !monthStr) return false;
    return dateStr.startsWith(monthStr);
};

module.exports = {
    formatDate,
    getMonthFromDate,
    isDateInMonth
};
