$.ajax({
    url: 'http://www.vipalnet.com.br/api/public/social/community/listCommunities',
    method: 'get',
    success: comunidadesData => {
        var arrComunidades = comunidadesData.content;
        
        for(var i in arrComunidades) {
            var communityAlias = arrComunidades[i].alias;

            $.ajax({
                url: `http://www.vipalnet.com.br/api/public/social/post/listSortedPost/${communityAlias}?limit=10`,
                method: 'get',
                success: postData => {
                    var arrPosts = postData.content;
            
                    for(var j in arrPosts) {
                        var attachments = arrPosts[j].attachments

                        for(var k in attachments) {
                            var documentId = new URL("http://url.com" + attachments[k].url).searchParams.get("app_ecm_navigation_doc");
                            
                            if(documentId){
                                $.ajax({
                                    url: `http://www.vipalnet.com.br/api/public/ecm/document/activedocument/${documentId}`,
                                    method: 'get',
                                    success: documentResponse => {
                                        console.log(documentResponse.content.fileURL)
                                        Object.assign(arrPosts[j].attachments, { 'fileVolume': documentResponse.content.fileURL });
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    }
})