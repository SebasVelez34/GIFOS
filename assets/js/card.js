const card = (function () {
    function cardFunctions(data,target){
        const isMobile = userDevice();
        isMobile ? mobileModal(data) : desktopCard(data,target);
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
        let saved = userGIFS.getGIFS('userGifs');
        saved     = saved.find(gif => gif.id === data.id);
        let img   = saved ? '../assets/images/icon-fav-active.svg' : '../assets/images/icon-fav-hover.svg'
        document.querySelector('#like').src = img;
        document.querySelector('#like').onclick = function () {
            let gifs   = userGIFS.getGIFS('userGifs');
            let exists = gifs.findIndex(gif => gif.id === data.id);
            if(exists !== -1){
                delete gifs[exists];
                gifs = gifs.filter(Boolean);
                userGIFS.clear('userGifs');
                if(gifs.length > 0) userGIFS.setGIF(gifs,'userGifs');
                this.src = '../assets/images/icon-fav-hover.svg';
            }else{
                gifs.push(data);
                userGIFS.setGIF(gifs,'userGifs');
                this.src = '../assets/images/icon-fav-active.svg';
            }
            favorites.refresh();
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

    function desktopTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div class='desktop-card'>
                <div id="img-container">
                    <div id="options">
                        <div id="userInfo"></div>
                        <div>
                            <span id="like"><img src="../assets/images/icon-fav-active.svg"/></span>
                            <a href="javascript:void(0)" id="download">
                                <img src="../assets/images/icon-download.svg" id="" />
                            </a>
                            <span id="fullscreen"><img src="../assets/images/icon-max.svg" /></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return template;
    }

    function desktopCard(data,target) {
        let template = desktopTemplate();
        const parent = target.parentElement;
        parent.classList.add('desktop-hover');
        target.classList.add('op-07');
        if(!parent.querySelector('.desktop-card')){
            parent.appendChild(template.content.cloneNode(true));
        }else{
            parent.querySelector('.desktop-card').classList.remove('d-none');
        }
        desktopCardOptions(data,parent);
    }

    function desktopCardOptions(data,target) {
        target.onmouseleave = function() {
            desktopCardRemove(target);
        }
        desktopUserInfo(data,target);
        desktopDownload(data,target);
        desktopLikeImg(data,target);
        desktopFullScreen(data,target);
    }

    function desktopCardRemove(target) {
        target.classList.remove('desktop-hover');
        target.querySelector('.desktop-card').classList.add('d-none');
        target.querySelector('img').classList.remove('op-07');
    }

    function desktopUserInfo({username,title},target) {
        target.querySelector('#userInfo').innerHTML = `
            <p id="gifUser">${username}</p>
            <p id="gifTitle">${title}</p>
        `;
    }

    function desktopLikeImg(data,target) {
        let saved = userGIFS.getGIFS('userGifs');
        saved     = saved.find(gif => gif.id === data.id);
        let img   = saved ? '../assets/images/icon-fav-active.svg' : '../assets/images/icon-fav-hover.svg';
        target.querySelector('#like img').src = img;
        target.querySelector('#like').onclick = function () {
            let gifs   = userGIFS.getGIFS('userGifs');
            let exists = gifs.findIndex(gif => gif.id === data.id);
            if(exists !== -1){
                delete gifs[exists];
                gifs = gifs.filter(Boolean);
                userGIFS.clear('userGifs');
                if(gifs.length > 0) userGIFS.setGIF(gifs,'userGifs');
                this.querySelector('img').src = '../assets/images/icon-fav-hover.svg';
            }else{
                gifs.push(data);
                userGIFS.setGIF(gifs,'userGifs');
                this.querySelector('img').src = '../assets/images/icon-fav-active.svg';
            }
            favorites.refresh();
        };
    }

    function desktopDownload(data,target) {
        target.querySelector('#download').addEventListener('click', function(ev) {
            forceDownload(data.images.original.url,data.title);
        }, false);
    }

    function desktopFullScreen(data,target) {
        target.querySelector('#fullscreen').onclick = function() {
          document.body.insertAdjacentHTML('afterbegin',`
            <div id="containerModal">
                <span id="closeModal"></span>
                <div id="modalImg">
                    <img src="${data.images.original.url}" id="modalGIF">
                    <div id="options">
                        <div id="userInfo">
                            <p id="user">${data.username}</p>
                            <p id="gifTitle">${data.title}</p>
                        </div>
                        <span id="like"><img src="../assets/images/icon-fav-active.svg"/></span>
                        <a href="javascript:void(0)" id="download">
                            <img src="../assets/images/icon-download.svg" id="" />
                        </a>
                    </div>
                </div>
                
            </div>
          `);
          desktopDownload(data,document.querySelector('#containerModal'));
          desktopLikeImg(data,document.querySelector('#containerModal'));
          closeDesktopModal();
        };
    }
    
    function closeDesktopModal() {
        document.querySelector('#closeModal').onclick = ()=>{
            document.querySelector('#containerModal').remove();
        }
    }

    return {
        options : cardFunctions
    }
})();