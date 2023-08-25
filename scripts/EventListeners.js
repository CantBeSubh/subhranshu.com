import * as THREE from 'three';
import galaxy from "./Galaxy.js";
import camera from "./Camera.js";
import renderer from './Renderer.js';
import scene from './Scene.js';


// Hover Effect on Project Card
document.getElementById("projects").onmousemove = e => {
    for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };
}

//Scramble Effect on Navigation Links
for (const navlink of document.getElementsByClassName("navlinks")) {
    navlink.onmouseover = e => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let interval = null;

        let iteration = 0;

        clearInterval(interval);

        interval = setInterval(() => {
            e.target.innerText = e.target.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return e.target.dataset.value[index];
                    }

                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("");

            if (iteration >= e.target.dataset.value.length) {
                clearInterval(interval);
            }

            iteration += 1 * (e.target.dataset.value.length / 30);
        }, 30);
    }
}


//GALAXY STUFF

window.addEventListener("scroll", () => {
    progressBarScroll(); //Progress Bar
    const t = document.body.getBoundingClientRect().top;
    let PointCount = renderer.info.render.points;
    camera.update(t);
    galaxy.update(t, PointCount);
});

window.addEventListener("resize", () => {
    camera.resize();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

document.querySelector("#toggle").addEventListener('click', e => {
    if (scene.background.b == new THREE.Color(0x111133).b) {
        scene.background = new THREE.Color('black')
        document.documentElement.style.setProperty('--card-color', 'rgb(23, 12, 34)');
    } else {
        scene.background = new THREE.Color(0x111133);
        document.documentElement.style.setProperty('--card-color', 'rgb(46, 40, 83)');
    }

})

window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.key == " ") {
        handleClick();
    }
});

// window.addEventListener("load", () => {
//     start();
// })

