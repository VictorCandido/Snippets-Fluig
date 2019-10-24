var getComunidades = () => new Promise((resolve, reject) => {
    const url = 'http://www.vipalnet.com.br/api/public/social/community/listCommunities';
    
    fetch(url).then(response => response.json() ).then(data => {
        resolve(data);
    }).catch(error => {
        reject(error);
    })
});

var getComunidadePosts = (communityAlias, limit = 10) => new Promise((resolve, reject) => {
    const url = `http://www.vipalnet.com.br/api/public/social/post/listSortedPost/${communityAlias}?limit=${limit}`;
    
    fetch(url).then(response => response.json() ).then(data => {
        resolve(data);
    }).catch(error => {
        reject(error);
    })
});

var getDocument = (documentId) => new Promise((resolve, reject) => {
    const url = `http://www.vipalnet.com.br/api/public/ecm/document/activedocument/${documentId}`;
    
    fetch(url).then(response => response.json() ).then(data => {
        resolve(data);
    }).catch(error => {
        reject(error);
    })
});

var arrayFinal = new Array();

console.info("Iniciando requisição, aguarde...");
getComunidades().then(async comunidadesData => {
    const comunidades = comunidadesData.content.filter(e => e.name.startsWith('Comunicação Interna'));

    for(var i in comunidades){
        var arrayAux = new Array();
        const communityAlias = comunidades[i].alias;

        const postData = await getComunidadePosts(communityAlias);
        const posts = postData.content;

        arrayAux = [...posts];
        console.log(arrayAux)
        
        for(var j in posts){
            const attachments = posts[j].attachments;

            for (var k in attachments){
                const documentId = new URL(`http://url.com${attachments[k].url}`).searchParams.get('app_ecm_navigation_doc');

                const documentData = await getDocument(documentId);
                const document = documentData.content;

                Object.assign(arrayAux[j].attachments[k], { fileVolume: document.fileURL }); 
            }
        }
        arrayFinal[comunidades[i].name] = arrayAux;
    }

    console.log("Requisição finalizada!")
});