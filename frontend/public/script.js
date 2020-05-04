document.getElementById("rsltpage").onclick = function () {
    location.href = "http://127.0.0.1:3000/rslt";
    loader.style.display = "inline-block"
    loading.style.display = "inline-block"

};

let loader = document.getElementById("loader")
let loading = document.getElementById("loading")

function initialize(){
    loader.style.display = "none"
    loading.style.display = "none"
}
initialize();