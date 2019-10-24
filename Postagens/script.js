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

console.info("Iniciando requisição, aguarde...");
getComunidades().then(comunidadesData => {
    const comunidades = comunidadesData.content.filter(e => e.name.startsWith('Comunicação Interna'));

    comunidades.forEach(comunidade => {
        const communityAlias = comunidade.alias;

        getComunidadePosts(communityAlias).then(postData => {
            const posts = postData.content;

            posts.forEach(post => {
                const attachments = post.attachments;

                attachments.forEach(attachment => {
                    const documentId = new URL(`http://url.com${attachment.url}`).searchParams.get('app_ecm_navigation_doc');
                    
                    getDocument(documentId).then(documentData => {
                        const document = documentData.content;
                        console.log(document.fileURL);
                    })
                });
            });
        });
    })
});

// FLUIGC.loading(window).show()
// console.info("Iniciando requisição, aguarde...");

// getComunidades().then(async comunidadesData => {
//     const comunidades = comunidadesData.content.filter(e => e.name.startsWith('Comunicação Interna'));

//     for(var i in comunidades) {
//         const communityAlias = comunidades[i].alias;

//         const postData = await getComunidadePosts(communityAlias);
//         const posts = postData.content;

//         for(var j in posts) {
//             const attachments = posts[j].attachments;

//             for(var k in attachments){
//                 const documentId = new URL(`http://url.com${attachments[k].url}`).searchParams.get('app_ecm_navigation_doc');

//                 const documentData = await getDocument(documentId);
//                 const document = documentData.content;
//                 console.log(document.fileURL);
//             }

//             // attachments.forEach(attachment => {
//             //     const documentId = new URL(`http://url.com${attachment.url}`).searchParams.get('app_ecm_navigation_doc');
                
//             //     getDocument(documentId).then(documentData => {
//             //         const document = documentData.content;
//             //         console.log(document.fileURL);
//             //     })
//             // });
//         }
//     }

//     FLUIGC.loading(window).hide()
// });