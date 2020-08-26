const favorites = (function () {
    function render(prevOffset = 0,offset = 12,pag = 1) {
        let userGifs    = userGIFS.getGIFS();
        pagination(userGifs.length,offset,pag);
        userGifs        = userGifs.slice(prevOffset,offset);
        const parent    = document.querySelector('#results');
        const container = parent.querySelector('.container-results');
        userGifs.map(gif => {
            console.log(gif);
            let { url } = gif.images.preview_webp || gif.images.original;
            let img     = document.createElement('img');
            img.src     = url;
            img.onclick = ()=>{
                card.options(gif);
            };
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
    return{
        render
    }
})();

(function() {
    favorites.render();
})();