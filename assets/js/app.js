const userGIFS = (function () {
    function getGIFS(item) {
        return JSON.parse(localStorage.getItem(item) || '[]');
    }

    function setGIF(gif,item) {
        localStorage.setItem(item,JSON.stringify(gif));
    }

    function clear(item) {
        localStorage.removeItem(item);
    }

    return{
        getGIFS,
        setGIF,
        clear
    }
})();


const trending = (function(){
    function __constructor(){
        trendingGIF();
    }
    async function dataTrending(limit = 25) {
        return await fetch(`${API_URL}/trending?${API_KEY}&limit=${limit}`)
                            .then((response) => response.json())
                            .then(data =>{
                                return data.data;
                            });
    }

    function trendingGIF(){
        const parent  = document.querySelector('.trending-carrousel');
        if(!parent) return;
        dataTrending().then(data =>{
            data.map(gif =>{
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
                parent.appendChild(div);
            });
            carousel();
        });
    }

    function carousel() {
        if(userDevice()) return;
        const next      = document.querySelector('.next');
        const previous  = document.querySelector('.previous');
        const container = document.querySelector('.trending-carrousel');
        let imgs        = Array.from(container.querySelectorAll('img.gifImage'));
        let cont        = 3;

        if(imgs.length <= 3){
            next.classList.add('d-none');
            return false;
        }
        next.classList.remove('d-none');
        next.onclick = ()=>{
            imgs[cont - 3].parentElement.classList.add('d-none');
            cont++;
            cont > 3 ? previous.classList.remove('d-none') : previous.classList.add('d-none');
            cont === imgs.length ? next.classList.add('d-none') : previous.classList.remove('d-none');
        }
        previous.onclick = ()=>{
            imgs[cont - 4].parentElement.classList.remove('d-none');
            cont--;
            cont === 3 ? previous.classList.add('d-none') : previous.classList.remove('d-none');
            cont === imgs.length ? next.classList.add('d-none') : next.classList.remove('d-none');
        }

    }

    return {
        init : __constructor,
    }
})();


function handleTheme() {
    if (document.querySelector('body.dark')) {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme','light');
        this.innerHTML = 'Modo Nocturo';
    }else{
        document.body.classList.toggle('dark');
        localStorage.setItem('theme','dark');
        this.innerHTML = 'Modo Diurno';
    }
}

function userTheme() {
    const theme = localStorage.getItem('theme');
    if(theme === 'dark'){
        document.body.classList.add('dark');
        document.querySelector('#changeTheme').innerHTML = 'Modo Diurno';
    }else{
        document.body.classList.remove('dark');
        document.querySelector('#changeTheme').innerHTML = 'Modo Nocturo';
    }
}

(function(){
    trending.init();
    document.querySelector('#changeTheme').onclick = handleTheme;
    userTheme();
})();