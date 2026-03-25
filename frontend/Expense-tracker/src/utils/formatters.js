export const formatCurrency = (amount = 0) => {
    return `${Number(amount).toLocaleString('en-IN')}`;
}

export const formatDate = (date) => {
    new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

export const getTodayIso = () => {
    return new Date().toISOString().split('T')[0];
}

export const getInitial = (name = "") => {
    return name[0]?.toUpperCase() || "U";
}