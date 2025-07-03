//generic API call function
export const apiCall = async (url, method = 'GET', data = null, headers = {}) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };


    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const baseUrl = import.meta.env.MODE == "development"? "http://localhost:8080" + url : url;
        const response = await fetch(baseUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};