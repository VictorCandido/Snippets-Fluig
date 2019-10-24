var arrayFinal = new Array();

// FETCH PARA RETORNAR DADOS DO DATASET.
const getCalendario = () => new Promise((resolve, reject) => {
    const datasetOptions = {
        name: 'ds_calendario_eventos',
        fields: [],
        constraints: [],
        order: [],
    };

    fetch(window.location.origin + '/api/public/ecm/dataset/datasets', {
        method: 'POST',
        redirect: 'follow',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(datasetOptions),
    }).then(response => response.json()).then((data) => {
        resolve(data);
    }).catch((error) => {
        reject(error);
    });
});

// FETCH PARA RETORNAR DADOS DA API DE DOCUMENTS.
const getDocument = (documentId, documentVersion) => new Promise((resolve, reject) => {
    fetch(window.location.origin + `/api/public/ecm/document/${documentId}/${documentVersion}`)
        .then(response => response.json()).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
});

// Consulta da API de dataset.
console.info("Iniciando requisição, aguarde...");

getCalendario().then(async response => {
    const eventos = response.content.values;

    for(var i in eventos){
        const documentId = eventos[i]['metadata#id'];
        const documentVersion = eventos[i]['metadata#version'];

        // Consulta da API de documentos.
        const data = await getDocument(documentId, documentVersion);
        const documentData = data.content;

        // Inclui os valores do dataset dentro do objeto retornado pelo documento
        // e adiciona em um array final.
        arrayFinal[i] = Object.assign(documentData, { datasetData: eventos[i] })
    }
    console.info("Requisição finalizada, dados gerados:");
    console.log(JSON.stringify(arrayFinal))
})