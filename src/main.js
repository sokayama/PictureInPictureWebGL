const WebGLUtil = require("./WebGLUtil.js");

/**
 * @param {Element} video
 */
const createPictureInPicture = (video)=>{
    const body = document.body;
    body.appendChild(video);

    video.addEventListener("loadedmetadata",()=>{
        video.play();
        video.requestPictureInPicture();
    });

    video.addEventListener("enterpictureinpicture",()=>{
        video.style.display = "none";
    });

    video.addEventListener("leavepictureinpicture",()=>{
        video.remove();
    })

};

const createVideofromCanvas = (canvas)=>{
    const stream = canvas.captureStream(60);

    // canvasを表示するだけのvideo要素を作る
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;

    video.play();

    return video;
}

const main = ()=>{
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Picture-In-Picture";
    button.addEventListener("click",()=>{
        const video = createVideofromCanvas(webglUtil.c);
        // video.src = "./zGOZoM77ilTEnSpv.mp4";
        createPictureInPicture(video);
    });

    const body = document.body;
    body.appendChild(button);

    const webglUtil = new WebGLUtil();
    webglUtil.init("canvas");
    webglUtil.c.style.display = "none";
    webglUtil.createPolygon("plane");
    webglUtil.setUniform4("plane","resolution",[800.0, 800.0, 0.0, 0.0]);
    const loopWebGL = ()=>{
        webglUtil.draw();
        requestAnimationFrame(loopWebGL);
    }
    loopWebGL();
};

window.addEventListener("load",()=>{
    main();
});

