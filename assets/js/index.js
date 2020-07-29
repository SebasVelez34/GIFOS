
fetch(`${API_URL}/search?${API_KEY}&q=rabbit&limit=25&offset=0&rating=g&lang=en`)
.then(function(response) {
    return response.json();
})
.then(function(myJson) {
    console.log(myJson);
});
