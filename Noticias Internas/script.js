const categorias = [
    { categoria: "Todas", value: "" },
    { categoria: "Home", value: "home" },
    { categoria: "RH", value: "rh" },
    { categoria: "Portal Gestor", value: "portalGestor" },
    { categoria: "Gerência Industrial", value: "gerenciaIndustrial" },
    { categoria: "Comercial Marketing", value: "comercialMarketing" },
    { categoria: "Negócios Internacionais", value: "negociosInternacionais" },
    { categoria: "Quem Somos", value: "quemSomos" },
    { categoria: "Tecnologia da Informação", value: "tecnologiaInformacao" },
    { categoria: "Logística", value: "logistica" },
    { categoria: "Auditoria e Controles Internos", value: "auditoria" },
    { categoria: "Contabilidade", value: "contabilidade" },
    { categoria: "Fiscal Tributário", value: "fiscalTributario" },
    { categoria: "Suprimentos", value: "suprimentos" },
    { categoria: "Desenvolvedores", value: "desenvolvedores" },
    { categoria: "Afuvi", value: "afuvi" },
    { categoria: "Qualidade e Tecnologia", value: "qualidadeTecnologia" },
    { categoria: "Controladoria", value: "controladoria" },
]                            



// FETCH PARA RETORNAR DADOS DO DATASET
const getNoticias = (param => new Promise((resolve, reject) => {
    const constraints = [{
        _field: 'categoria',
        _initialValue: param,
        _finalValue: param,
        _type: 1,
        _likeSearch: false,
    }];

    const datasetOptions = {
        name: 'ds_noticias_internas',
        fields: [],
        constraints,
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


}));

// FETCH PARA RETORNAR DADOS DA API DE DOCUMENTS
const getDocument = ((documentId, documentVersion) => new Promise((resolve, reject) => {
    fetch(window.location.origin + `/api/public/ecm/document/${documentId}/${documentVersion}`)
        .then(response => response.json()).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
}));


/* EXECUÇÃO DOS FETCHS */

// Execução do fetch da API de dataset
var arrayFinal = new Array();
console.info("Iniciando requisição, agurarde...");

categorias.forEach(async categoria => {
    let ArrayAux = new Array();

    await getNoticias(categoria.value).then(async result => {
        const resultado = result.content.values;    //  Retorno de dados do dataset
        ArrayAux = [...resultado];
        
        for (var i in resultado) {
            // Execução do fetch de API de documents
            const data = await getDocument(resultado[i]['metadata#id'], resultado[i]['metadata#version']);
            const colleagueId = data.content.colleagueId;
            ArrayAux[i] = Object.assign(ArrayAux[i], { "colleagueId": colleagueId });   //  Adicionando o colleagueId no objeto retornado pelo ds
        }

        arrayFinal[categoria.categoria] = ArrayAux;
        console.log(arrayFinal);
        // console.log(JSON.stringify(arrayFinal)) //  Log para copiar os dados no console
    })
});
