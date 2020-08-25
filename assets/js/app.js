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

(function(){
    trending.init();
})();