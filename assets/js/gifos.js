const gifos = (function () {
    'use strict';
    function render(prevOffset = 0,offset = 12,pag = 1) {
        let userGifs    = userGIFS.getGIFS('myGifos');
        if(empty(userGifs)) return false;
        userGifs        = getGifos(userGifs);
        userGifs.then(data =>{
            pagination(data.length,offset,pag);
            data            = data.slice(prevOffset,offset);
            const parent    = document.querySelector('#results');
            const container = parent.querySelector('.container-results');
            data.map(gif => {
                let { url } = gif.images.preview_webp || gif.images.original;
                let img     = document.createElement('img');
                let div     = document.createElement('div');
                div.classList.add('img');
                img.src     = url;
                img.classList.add('gifImage');
                if(userDevice()){
                    img.onclick = ()=>{
                        card.options(gif);
                    };
                }else{
                    img.onmouseover = function(){
                        card.options(gif,this);
                    };
                }
                div.appendChild(img);
                container.appendChild(div);
            });
            if(userGifs)
                parent.querySelector('#load-more').onclick = ()=>{ render(offset,offset + 12,pag + 1); };
            else
                parent.querySelector('#load-more').classList.add('d-none');
        });
    }

    async function getGifos(ids) {
        return await fetch(`${API_URL}?${API_KEY}&ids=${ids.join()}`)
                    .then((response) => response.json())
                    .then(data =>{
                        return data.data;
                    });
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
        let userGifs   = gifs || userGIFS.getGIFS('myGifos');
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
                <img src='../assets/images/icon-mis-gifos-sin-contenido.svg' />
                <p>¡Anímate a crear tu primer GIFO!</p>
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
    gifos.render();
})();