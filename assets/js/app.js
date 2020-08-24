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


const card = (function () {
    function cardFunctions(data){
        const isMobile = userDevice();
        isMobile ? mobileModal(data) : desktopHover(data);
    }

    function mobileModal(data) {
        const body   = document.body;
        let template = mobileTemplate();
        body.appendChild(template.content.cloneNode(true));
        mobileModalOptions(data);
    }

    function mobileTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class='mobile-card'>
                <span id="closeModal"></span>
                <div id="img-container">
                    <img src="" id="img"/>
                    <div id="options">
                        <div id="userInfo"></div>
                        <img src="" id="like" />
                        <a href="javascript:void(0)" id="download">
                            <img src="../assets/images/icon-download.svg" id="" />
                        </a>
                    </div>
                </div>
            </div>
        `;
        return template;
    }

    function mobileModalOptions(data) {
        mobileModalClose();
        mobileImg(data);
        mobileUserInfo(data);
        mobileLikeImg(data);
        mobileDownload(data);
    }

    function mobileModalClose() {
        document.querySelector('#closeModal').onclick = ()=>{
            document.querySelector('.mobile-card').remove();
        };
    }

    function mobileUserInfo({username,title}) {
        document.querySelector('#userInfo').innerHTML = `
            <p id="gifUser">${username}</p>
            <p id="gifTitle">${title}</p>
        `;
    }

    function mobileLikeImg(data) {
        let saved = userGIFS.getGIFS();
        saved     = saved.find(gif => gif.id === data.id);
        let img   = saved ? '../assets/images/icon-fav-active.svg' : '../assets/images/icon-fav-hover.svg'
        document.querySelector('#like').src = img;
        document.querySelector('#like').onclick = function () {
            let gifs   = userGIFS.getGIFS();
            let exists = gifs.findIndex(gif => gif.id === data.id);
            if(exists !== -1){
                delete gifs[exists];
                gifs = gifs.filter(Boolean);
                userGIFS.clear();
                if(gifs.length > 0) userGIFS.setGIF(gifs);
                this.src = '../assets/images/icon-fav-hover.svg';
            }else{
                userGIFS.setGIF(data);
                this.src = '../assets/images/icon-fav-active.svg';
            }
        };
    }

    function mobileImg({images}) {
        document.querySelector('.mobile-card #img').src = images.original.url;
    }

    function mobileDownload(data) {
        document.querySelector('#download').addEventListener('click', function(ev) {
            forceDownload(data.images.original.url,data.title);
        }, false);
    }

    function desktopHover() {
    }
    return {
        options : cardFunctions
    }
})();

const home = (function () {
    function __constructor(){
        categoryTags();
        trendingGIF();
        clearSearch();

        document.querySelector('#searchGif').onkeyup = (e)=>{
            autocomplete();
            let value = searchValue();
            if (e.key === 'Enter' && value != "") {
                renderResults(value);
                searchRender(false);
            }
        };
    }

    function searchValue() {
        return document.querySelector('#searchGif').value;
    }

    function clearSearch() {
        document.querySelector('#img-close').onclick = ()=>{
            document.querySelector('#searchGif').value = '';
            searchRender(false);
        };
    }
    function searchRender(show = false) {
        const parent = document.querySelector('#search');
        parent.classList.add('active');
        show ? parent.classList.add('active') : parent.classList.remove('active');
    }
    async function categories() {
        return await fetch(`${API_URL}/categories?${API_KEY}`)
        .then((response) => response.json())
        .then(data =>{
            return data.data;
        });
    }

    async function autocomplete(){
        const parent = document.querySelector('#search');
        const ul     = document.querySelector('#search-results ul');
        const data   = await fetch(`${API_URL}/search/tags?${API_KEY}&q=${searchValue()}`)
                            .then((response) => response.json())
                            .then(data =>{
                                return data.data;
                            });
        searchRender(true);
        ul.innerHTML = '';
        if (data.length > 0) {
            data.map(option =>{
                let li         = document.createElement('li');
                let img        = document.createElement('img');
                let optionName = document.createTextNode(option.name);
                img.src        = './assets/images/icon-search.svg';
                li.onclick     = () => { results(option) };
                li.appendChild(optionName);
                li.prepend(img);
                ul.appendChild(li);
            });
        }else{
            ul.insertAdjacentHTML('afterbegin',`<li><img src="./assets/images/icon-search.svg" />Sin resultados</li>`);
        }
    }

    function results({name}) {
        renderResults(name);
        document.querySelector('#searchGif').value = name;
        searchRender(false);
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

    async function categoryTags() {
        categories().then(data => {
            const categories = data.slice(0,5);
            const parent     = document.querySelector(".trending .tags");
            categories.map(category => {
                let a       = document.createElement('a');
                const name  = category.name.toCapitalize();
                a.onclick   = () => { renderResults(name) };
                a.innerHTML = `${name},`;
                parent.appendChild(a);
            });
        });
    }

    async function searchGIFS(term,limit = 12,offset = 0) {
        return await fetch(`${API_URL}/search?${API_KEY}&q=${term}&limit=${limit}&offset=${offset}`)
                            .then((response) => response.json())
                            .then(data =>{
                                return data.data;
                            });
    }

    function renderResults(term,offset = 0){
        const parent    = document.querySelector('#results');
        const container = parent.querySelector('.container-results');
        searchGIFS(term,12,offset).then(data =>{
            parent.classList.remove('d-none');
            parent.querySelector('#result-title').innerHTML = term;
            if (offset == 0) container.innerHTML = '';
            data.map(gif => {
                let { url }  = gif.images.preview_webp;
                let img     = document.createElement('img');
                img.src     = url;
                img.onclick = ()=>{
                    card.options(gif);
                };
                container.appendChild(img);
            });
            if(data)
                parent.querySelector('#load-more').onclick = ()=>{ renderResults(term,offset + 12); };
            else
                parent.querySelector('#load-more').classList.add('d-none');

        })
    }

    return {
        init : __constructor,
    }
})();




home.init();