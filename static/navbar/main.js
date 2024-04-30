function navCollapse(){
    const divRightElements = document.getElementById('divRightElements');
    const navbarCollapse = document.getElementById('navbarCenteredExample');
    const mainNavBar = document.getElementById('main-navbar');

    if(navbarCollapse.classList.contains('show')){
        divRightElements.classList.add('right-elements-collapse');
        mainNavBar.style.backgroundColor = "#07143B";
    } else {
        divRightElements.classList.remove('right-elements-collapse');
        mainNavBar.style.backgroundColor = "";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.getElementById('navbar-toggler');

    navbarToggler.addEventListener('click',()=>{
        setTimeout(navCollapse, 400);
    });
    
    const navbar = document.getElementById("main-navbar")

    if (window.pageYOffset > 0){
        navbar.classList.add("navbar-after-scroll");
    }

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 0) {
            navbar.classList.add("navbar-after-scroll");
        } else {
            navbar.classList.remove("navbar-after-scroll");
        }
    });
});