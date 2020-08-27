const favorites = (function () {
    function render(prevOffset = 0,offset = 12,pag = 1) {
        let userGifs    = userGIFS.getGIFS();
        if(empty(userGifs)) return false;
        pagination(userGifs.length,offset,pag);
        userGifs        = userGifs.slice(prevOffset,offset);
        const parent    = document.querySelector('#results');
        const container = parent.querySelector('.container-results');
        userGifs.map(gif => {
            let { url } = gif.images.preview_webp || gif.images.original;
            let img     = document.createElement('img');
            img.src     = url;
            if(userDevice()){
                img.onclick = ()=>{
                    card.options(gif);
                };
            }else{
                img.onmouseover = function(){
                    card.options(gif,this);
                };
            }
            container.appendChild(img);
        });
        if(userGifs)
            parent.querySelector('#load-more').onclick = ()=>{ render(offset,offset + 12,pag + 1); };
        else
            parent.querySelector('#load-more').classList.add('d-none');
    }

    function pagination(length,offset,pag) {
        let pagination  = Math.ceil(length / offset);
        if (pag <= pagination && length > 12 )
            document.querySelector('#load-more').classList.remove('d-none');
        else
            document.querySelector('#load-more').classList.add('d-none');
    }

    function refresh() {
        document.querySelector('.container-results').innerHTML = '';
        render();
    }

    function empty(gifs = undefined) {
        let userGifs   = gifs || userGIFS.getGIFS();
        if(userGifs.length === 0){
            const parent   = document.querySelector('.container-results');
            const template = emptyTemplate();

            parent.innerHTML = '';
            parent.appendChild(template.content.cloneNode(true));
            return true;
        }
        return false;
    }

    function emptyTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div id="emptyFavorites">
                <img src='../assets/images/icon-fav-sin-contenido.svg' />
                <p>"¡Guarda tu primer GIFO en Favoritos 
                para que se muestre aquí!"</p>
            </div>
        `;
        return template;
    }

    return{
        render,
        refresh
    }
})();

(function() {
    favorites.render();
})();