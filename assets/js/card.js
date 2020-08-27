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
                gifs.push(data);
                userGIFS.setGIF(gifs);
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
                            <img src="../assets/images/icon-fav-active.svg" id="like" />
                            <a href="javascript:void(0)" id="download">
                                <img src="../assets/images/icon-download.svg" id="" />
                            </a>
                            <img src="../assets/images/icon-max.svg" id="fullscreen" />
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
        target.classList.add('op-06');
        if(!parent.querySelector('.desktop-card')){
            parent.appendChild(template.content.cloneNode(true));
        }
        parent.onmouseleave = function() {
            desktopCardRemove(parent);
        }
    }

    function desktopCardRemove(target) {
        target.classList.remove('desktop-hover');
        target.querySelector('img').classList.remove('op-06');
    }

    return {
        options : cardFunctions
    }
})();