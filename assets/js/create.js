const createGIFO = (function() {
    function start() {
        document.querySelector('#startFilm').onclick = function () {
            createGIFO();
        }
    }

    function createGIFO() {
        document.querySelectorAll('#steps ul li')[0].classList.add('active');
        document.querySelector('#startFilm').classList.add('d-none');
        step1();
    }

    function step1() {
        document.querySelector('#containerUpload h1').innerHTML = `¿Nos das acceso <br>a tu cámara?`;
        document.querySelector('#containerUpload p').innerHTML  = `El acceso a tu camara será válido sólo<br>
        por el tiempo en el que estés creando el GIFO.`;
        getStreamAndRecord();
    }

    function step2(stream) {
        document.querySelector('#containerUpload video').classList.remove('d-none');
        document.querySelector('#containerUpload video').srcObject = stream;
        document.querySelector('#containerUpload video').play();
        document.querySelector('#startFilm').classList.remove('d-none');
        document.querySelector('#startFilm').innerHTML = 'GRABAR';
        document.querySelector('#startFilm').onclick = ()=> { record(stream) };
        document.querySelectorAll('#steps ul li')[0].classList.remove('active');
        document.querySelectorAll('#steps ul li')[1].classList.add('active');
    }

    function getStreamAndRecord () { 
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: { max: 480 }
            }
        })
        .then(function(stream) {
            step2(stream);
        })
        .catch(function(error) {
            document.querySelector('#containerUpload h1').innerHTML = `Ohhhhh :(`;
            document.querySelector('#containerUpload p').innerHTML = `
            Ha ocurrido un error al abrir tu cámara <br/>
            <button onClick="window.location.reload();" class="btn">Recargar la página</button>
            `;
        })
    }

    function record(stream) {
        let recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
             console.log('started')
           },
        });
        recorder.startRecording();
        var chronometerCall = setInterval(()=>{
            chronometer();
        }, 1000,[hours = '00',minutes = '00',seconds = '00'])
        document.querySelector('#startFilm').innerHTML = 'FINALIZAR';
        document.querySelector('#startFilm').onclick = ()=>{ recordStop(recorder,chronometerCall,stream)};
    }

    function recordStop(recorder,chronometerCall,stream) {
        recorder.stopRecording();
        clearInterval(chronometerCall);
        document.querySelector('#startFilm').innerHTML  = 'SUBIR GIFO';
        document.querySelector('#startFilm').onclick    = ()=>{ uploadGIFO(recorder) }
        document.querySelector('#timeRecord').innerHTML = 'REPETIR CAPTURA';
        document.querySelector('#timeRecord').onclick   = ()=>{ record(stream) };
    }
    
    function chronometer() {
        seconds ++;
        if (seconds < 10) seconds = `0` + seconds
        if (seconds > 59) {
            seconds = `00`
            minutes ++
            if (minutes < 10) minutes = `0` + minutes
        }
        if (minutes > 59) {
            minutes = `00`
            hours ++
            if (hours < 10) hours = `0` + hours
        }
        if(document.querySelector('#timeRecord.d-none'))
            document.querySelector('#timeRecord').classList.remove('d-none');
        document.querySelector('#timeRecord').textContent = `${hours}:${minutes}:${seconds}`
    }

    function uploadGIFO(recorder) {
        document.querySelector('#startFilm').classList.add('d-none');
        document.querySelectorAll('#steps ul li')[1].classList.remove('active');
        document.querySelectorAll('#steps ul li')[2].classList.add('active');
        document.querySelector('#containerUpload h1').classList.remove('d-none');
        document.querySelector('#containerUpload h1').classList.add('upload');
        document.querySelector('#containerUpload p').classList.remove('d-none');
        document.querySelector('#containerUpload p').classList.add('upload');
        document.querySelector('#containerUpload p').innerHTML = `Estamos subiendo tu GIFO`;
        document.querySelector('#timeRecord').classList.add('d-none');

        let form = new FormData();
        form.append('file', recorder.getBlob(), 'myGif.gif');
        form.append('username', 'sebasvlez');
        form.append('api_key', API_KEY_SINGLE);
        fetch(`${UPLOAD_ENDPOINT}`, {
            method: 'POST',
            body: form
        }).then(response => {
            return response.json();
        }).then(data => saveGIFO(data));
    }

    function saveGIFO(data) {
        data.then(gif =>{
            let gifos = userGIFS.getGIFS('myGifos');
            gifos.push(data);
            userGIFS.setGIF(gif,'myGifos');
        });
    }

    return {
        init: start
    }
})();

(function() {
    createGIFO.init();
})();