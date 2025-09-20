const headersDefault = Object.freeze({"Content-Type": "application/json"});

export const ENDPOINT_EVENTS: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Events`;
export const ENDPOINT_EVENTSSTATUS: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Events/updateStatus`;
export const ENDPOINT_USERS: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Users`;
export const ENDPOINT_PLAYERS: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Players`;
export const ENDPOINT_ADDEVENTS: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Players/addEvents`;
export const ENDPOINT_PLAYERSEVENTS: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Players/Events`;
export const ENDPOINT_ADDPLAYERS: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Team/addPlayersToEvents`;
export const ENDPOINT_TEAM: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Team`;
export const ENDPOINT_GETTEAM: string = `${process.env.NEXT_PUBLIC_TEAM_API}/Team/getTeam`;

export const METHOD = Object.freeze({
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
});

export const PARAMETER = Object.freeze({
    ALLEVENTS: "allEvents",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
});

export async function update(endpoint: string, method: string = METHOD.GET, data: any, id: number) {
    const query = method === METHOD.GET && id > 0 ? `?id=${id.toString()}` : "";
    fetch(endpoint + query, {
        method: method,
        headers: { ...{}, ...headersDefault },
        body: JSON.stringify(data),
    }).then((res) => res).then((res) => {
        return res.json();
    })
    .catch((error) => {
        console.error("ERROR > update", endpoint);
    });
};

export async function get(endpoint: string, method: string = METHOD.GET, id: number, parameter?: string, value?: string) {
    let query = method === METHOD.GET && id > 0 ? `?id=${id.toString()}` : "";
    query = method === METHOD.GET && parameter ? `?${parameter}=${value}` : query;
    return fetch(endpoint + query, {
        method: method,
        headers: { ...{}, ...headersDefault },
    }).then(response => response.json());
};

export async function remove(endpoint: string, method: string = METHOD.GET, id: number) {
    const query = id > 0 ? `?id=${id.toString()}` : "";
    return fetch(endpoint + query, {
        method: method,
        headers: { ...{}, ...headersDefault },
    }).then(response => response.json());
};