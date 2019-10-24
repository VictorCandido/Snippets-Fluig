var getComunidades = () => new Promise((resolve, reject) => {
    const url = 'http://www.vipalnet.com.br/api/public/social/community/listCommunities';
    
    fetch(url).then(response => response.json() ).then(data => {
        resolve(data);
    }).catch(error => {
        reject(error);
    })
});

var getComunidadePosts = (communityAlias) => new Promise((resolve, reject) => {
    const url = `http://www.vipalnet.com.br/api/public/social/post/listSortedPost/${communityAlias}?limit=10`;
    
    fetch(url).then(response => response.json() ).then(data => {
        resolve(data);
    }).catch(error => {
        reject(error);
    })
});

getComunidades().then(comunidadesData => {
    const comunidades = comunidadesData.content.filter(e => e.name.startsWith('Comunicação Interna'));

    for(var i in comunidades) {
        const communityAlias = comunidades[i].alias;

        getComunidadePosts(communityAlias).then(postData => {
            const posts = postData.content;

            for(var j in posts) {
                console.log(posts[j])
            }
        });
    }
});