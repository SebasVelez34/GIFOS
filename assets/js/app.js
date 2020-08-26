const userGIFS = (function () {
    function getGIFS() {
        return JSON.parse(localStorage.getItem('userGifs') || '[]');
    }

    function setGIF(gif) {
        let userGifs = getGIFS();
        userGifs.push(gif);
        localStorage.setItem('userGifs',JSON.stringify(userGifs));
    }

    function clear() {
        localStorage.removeItem('userGifs');
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
    async function dataTrending(limit = 10) {
        return await fetch(`${API_URL}/trending?${API_KEY}&limit=${limit}`)
                            .then((response) => response.json())
                            .then(data =>{
                                return data.data;
                            });
    }

    function trendingGIF(){
        const parent  = document.querySelector('.trending-carrousel');
        dataTrending().then(data =>{
            data.map(gif =>{
                let { url } = gif.images.preview_webp;
                let img     = document.createElement('img');
                img.src     = url;
                img.onclick = ()=>{
                    card.options(gif);
                };
                parent.appendChild(img);
            });
        })
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