export const paginate = (array, amountPerPage) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += amountPerPage)
        chunks.push(array.slice(i, i + amountPerPage));
    return chunks;
};

export const getPage = (chunks, page) => chunks?.[page - 1];
