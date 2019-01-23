document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: "start"
        });
    });
});


AOS.init({
  duration: 1000,
})


var angle = 0, img = document.getElementById('rotate');
document.getElementById('slider').onchange = function() {
  console.log("testadad");
  console.log(document.getElementById('slider').value);
    angle = (document.getElementById('slider').value);
    console.log(angle);
    img.style.transform = `rotate(${angle}deg)`;

}
