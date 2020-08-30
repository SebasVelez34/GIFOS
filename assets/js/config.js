const API_KEY = "api_key=EytZVPh42pEzgkvRtXja72J3N44pAEM5";
const API_URL = "https://api.giphy.com/v1/gifs";
const UPLOAD_ENDPOINT = 'https://upload.giphy.com/v1/gifs';
const API_KEY_SINGLE  = 'EytZVPh42pEzgkvRtXja72J3N44pAEM5';

function userDevice(){
    let mobile  = false;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        mobile = true;
    }
    return mobile;
}
