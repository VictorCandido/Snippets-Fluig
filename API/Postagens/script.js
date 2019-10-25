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

var getLikes = (postId) => new Promise((resolve, reject) => {
    const url = `http://www.vipalnet.com.br/api/public/sociable/likers/v2/${postId}`;
    
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
            const comments = posts[j].comments;
            const postId = posts[j].postId;

            const likesData = await getLikes(postId);
            const likes = likesData.content;

            Object.assign(arrayAux[j], { likes })

            for (var k in attachments){
                const documentId = new URL(`http://url.com${attachments[k].url}`).searchParams.get('app_ecm_navigation_doc');

                const documentData = await getDocument(documentId);
                const document = documentData.content;

                Object.assign(arrayAux[j].attachments[k], { fileVolume: document.fileURL }); 
            }

            for(var k in comments) {
                const commentId = comments[k].id;

                const commentsLikesData = await getLikes(commentId);
                const commentLikes = commentsLikesData.content;

                Object.assign(arrayAux[j].comments[k], { likes: commentLikes });
            }
        }
        arrayFinal[comunidades[i].name] = arrayAux;
    }

    console.info("Requisição finalizada!")
    
    console.info('')
    console.info('')

    console.info('Todos os dados foram salvos na variável "arrayFinal".')
    console.info('Consulte a comunidade através de arrayFinal["NOME_DA_COMUNIDADE"].')
    console.info('Para copiar todos os dados, utilize JSON.stringify(arrayFinal["NOME_DA_COMUNIDADE"]).')
});