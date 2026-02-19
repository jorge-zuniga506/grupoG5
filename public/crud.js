export async function getAllData(resource) {
    const response = await fetch(`http://localhost:3001/${resource}`);
    return await response.json();
}

export async function postData(resource, data) {
    const response = await fetch(`http://localhost:3001/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function patchData(resource, id, data) {
    const response = await fetch(`http://localhost:3001/${resource}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function deleteData(resource, id) {
    const response = await fetch(`http://localhost:3001/${resource}/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}
