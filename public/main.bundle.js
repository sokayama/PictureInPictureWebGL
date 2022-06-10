/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/WebGLUtil.js":
/*!**************************!*\
  !*** ./src/WebGLUtil.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("class WebGLUtil {\n    constructor(){\n\n        this.c = null;\n        this.gl = null;\n\n        this.polygon = [];\n    }\n\n    init(canvas_id){\n        // - canvas と WebGL コンテキストの初期化 -------------------------------------\n        // canvasエレメントを取得\n        this.c = document.getElementById(canvas_id);\n\n        // canvasのサイズをスクリーン全体に広げる\n        this.c.width = 800;\n        this.c.height = 800;\n\n        // webglコンテキストを取得\n        this.gl = this.c.getContext('webgl') || this.c.getContext('experimental-webgl');\n\n    }\n\n    createPolygon(name){\n        if(this.polygon[name] == null){\n            this.polygon[name] = new Polygon(this.gl);\n\n            // シェーダのソースを取得\n            const shader = {\n                vs : __webpack_require__(/*! ./gl.vert */ \"./src/gl.vert\"),\n                fs : __webpack_require__(/*! ./gl.frag */ \"./src/gl.frag\")\n            }\n\n            this.polygon[name].create(shader.vs,shader.fs);\n\n        }else{\n            console.error(\"[WebGLUtil:createPolygon] this name (\" + name + \") is available. set other name.\");\n        }\n    }\n\n    reloadShader(){\n        for(let i in this.polygon){\n            if(this.polygon[i] != null){\n\n                // シェーダのソースを取得\n                const shader = {\n                    vs : __webpack_require__(/*! ./gl.vert */ \"./src/gl.vert\"),\n                    fs : __webpack_require__(/*! ./gl.frag */ \"./src/gl.frag\")\n                }\n\n                this.polygon[i].create(shader.vs,shader.fs);\n\n            }\n        }\n    }\n\n    /**\n     * @param {string} name polygonname\n     * @param {string} uniform uniformname\n     * @param {float[4]} param xyzw\n     *\n     */\n    setUniform4(name,uniform,param){\n        if(this.polygon[name] == null){\n            console.error(\"[WebGLUtil:setUniform] this name (\" + name + \") is  not available.\")\n        }else{\n            if(this.polygon[name].prg){\n                const uni = this.gl.getUniformLocation(this.polygon[name].prg, uniform);\n\n                this.gl.uniform4fv(uni,param);\n            }else{\n            }\n        }\n    }\n\n    draw(){\n        // - レンダリングのための WebGL 初期化設定 ------------------------------------\n        // ビューポートを設定する\n        this.gl.viewport(0, 0, this.c.width, this.c.height);\n\n        // canvasを初期化する色を設定する\n        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);\n\n        // canvasを初期化する際の深度を設定する\n        this.gl.clearDepth(1.0);\n\n        // canvasを初期化\n        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);\n        for(let i in this.polygon){\n            if(this.polygon[i].ready){\n                this.gl.drawElements(this.gl.TRIANGLES, this.polygon[i].index.length, this.gl.UNSIGNED_SHORT, 0);\n            }\n        }\n        // コンテキストの再描画\n        this.gl.flush();\n    }\n}\n\n\nclass Polygon{\n    constructor(gl){\n        this.gl = gl;\n        this.prg = null;\n        this.attLocation = {};\n        this.attStride = {};\n        this.vPosition  = {};\n        this.textureCoord = {};\n        this.index = {};\n        this.attVBO = {};\n        this.ibo = null;\n\n        this.ready = false;\n    }\n\n    // いたポリ召喚の儀\n    create(vs,fs){\n        // - シェーダとプログラムオブジェクトの初期化 ---------------------------------\n\n        // 頂点シェーダとフラグメントシェーダの生成\n        const vShader = this.create_shader(vs, this.gl.VERTEX_SHADER);\n        const fShader = this.create_shader(fs, this.gl.FRAGMENT_SHADER);\n\n        // プログラムオブジェクトの生成とリンク\n        this.prg = this.create_program(vShader, fShader);\n\n        // - 頂点属性に関する処理 -----------------------------------------------------\n        // attributeLocationの取得\n        this.attLocation = {};\n        this.attLocation[0] = this.gl.getAttribLocation(this.prg, 'position');\n        this.attLocation[1] = this.gl.getAttribLocation(this.prg, \"textureCoord\");\n\n        // attributeの要素数\n        this.attStride = {};\n        this.attStride[0] = 3;\n        this.attStride[1] = 2;\n\n        // 板ポリモデル(頂点)データ\n        this.vPosition = [\n            1.0,   1.0,  0.0,\n            1.0,  -1.0,  0.0,\n            -1.0,  -1.0,  0.0,\n            -1.0,  1.0,  0.0\n        ];\n        this.textureCoord = [\n            1.0,0.0,\n            1.0,1.0,\n            0.0,1.0,\n            0.0,0.0\n        ];\n\n        // 頂点インデックス\n        this.index = [\n            0, 2, 1,\n            0, 3, 2\n        ];\n\n\n        // VBOの生成\n        this.attVBO = {};\n        this.attVBO[0] = this.create_vbo(this.vPosition);\n        this.attVBO[1] = this.create_vbo(this.textureCoord);\n\n        // VBOをバインド\n        this.set_attribute(this.attVBO, this.attLocation, this.attStride);\n\n        this.ibo = this.create_ibo(this.index);\n\n        // IBOをバインド\n        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);\n        this.ready = true;\n    }\n\n\n    /**\n     * シェーダを生成する関数\n     * @param {string} source シェーダのソースとなるテキスト\n     * @param {number} type シェーダのタイプを表す定数 this.gl.VERTEX_SHADER or this.gl.FRAGMENT_SHADER\n     * @return {object} 生成に成功した場合はシェーダオブジェクト、失敗した場合は null\n     */\n    create_shader(source, type){\n        // シェーダの生成\n        const shader = this.gl.createShader(type);\n\n        // 生成されたシェーダにソースを割り当てる\n        this.gl.shaderSource(shader, source);\n\n        // シェーダをコンパイルする\n        this.gl.compileShader(shader);\n\n        // シェーダが正しくコンパイルされたかチェック\n        if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){\n\n            // 成功していたらシェーダを返して終了\n            return shader;\n        }else{\n\n            // 失敗していたらエラーログをアラートする\n            alert(this.gl.getShaderInfoLog(shader));\n\n            // null を返して終了\n            return null;\n        }\n    }\n\n    /**\n     * プログラムオブジェクトを生成しシェーダをリンクする関数\n     * @param {object} vs 頂点シェーダとして生成したシェーダオブジェクト\n     * @param {object} fs フラグメントシェーダとして生成したシェーダオブジェクト\n     * @return {object} 生成に成功した場合はプログラムオブジェクト、失敗した場合は null\n     */\n    create_program(vs, fs){\n        // プログラムオブジェクトの生成\n        const program = this.gl.createProgram();\n\n        // プログラムオブジェクトにシェーダを割り当てる\n        this.gl.attachShader(program, vs);\n        this.gl.attachShader(program, fs);\n\n        // シェーダをリンク\n        this.gl.linkProgram(program);\n\n        // シェーダのリンクが正しく行なわれたかチェック\n        if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){\n\n            // 成功していたらプログラムオブジェクトを有効にする\n            this.gl.useProgram(program);\n\n            // プログラムオブジェクトを返して終了\n            return program;\n        }else{\n\n            // 失敗していたらエラーログをアラートする\n            alert(this.gl.getProgramInfoLog(program));\n\n            // null を返して終了\n            return null;\n        }\n    }\n\n    /**\n     * VBOを生成する関数\n     * @param {Array.<number>} data 頂点属性を格納した一次元配列\n     * @return {object} 頂点バッファオブジェクト\n     */\n    create_vbo(data){\n        // バッファオブジェクトの生成\n        const vbo = this.gl.createBuffer();\n\n        // バッファをバインドする\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);\n\n        // バッファにデータをセット\n        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);\n\n        // バッファのバインドを無効化\n        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);\n\n        // 生成した VBO を返して終了\n        return vbo;\n    }\n\n    /**\n     * IBOを生成する関数\n     * @param {Array.<number>} data 頂点インデックスを格納した一次元配列\n     * @return {object} インデックスバッファオブジェクト\n     */\n    create_ibo(data){\n        // バッファオブジェクトの生成\n        const ibo = this.gl.createBuffer();\n\n        // バッファをバインドする\n        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);\n\n        // バッファにデータをセット\n        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);\n\n        // バッファのバインドを無効化\n        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);\n\n        // 生成したIBOを返して終了\n        return ibo;\n    }\n\n    /**\n     * VBOをバインドし登録する関数\n     * @param {object} vbo 頂点バッファオブジェクト\n     * @param {Array.<number>} attribute location を格納した配列\n     * @param {Array.<number>} アトリビュートのストライドを格納した配列\n     */\n    set_attribute(vbo, attL, attS){\n        // 引数として受け取った配列を処理する\n        console.log(\"attL\",attL, attS);\n        for(let i in vbo){\n            console.log(attL[i])\n            // バッファをバインドする\n            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);\n\n            // attributeLocationを有効にする\n            this.gl.enableVertexAttribArray(attL[i]);\n\n            // attributeLocationを通知し登録する\n            this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);\n        }\n    }\n\n\n    /**\n     * テクスチャを生成する関数\n     * @param {string} source テクスチャに適用する画像ファイルのパス\n     */\n    create_texture(source,texture){\n        // イメージオブジェクトの生成\n        const img = new Image();\n\n        // データのオンロードをトリガーにする\n        img.onload = function(){\n            // テクスチャオブジェクトの生成\n            const tex = this.gl.createTexture();\n\n            // テクスチャをバインドする\n            this.gl.bindTexture(this.gl.TEXTURE_2D, tex);\n\n            // テクスチャへイメージを適用\n            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);\n\n            //テクスチャパラメータ\n            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);\n            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);\n\n            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);\n            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);\n\n            // ミップマップを生成\n            // this.gl.generateMipmap(this.gl.TEXTURE_2D);\n\n            // テクスチャのバインドを無効化\n            this.gl.bindTexture(this.gl.TEXTURE_2D, null);\n\n            // 生成したテクスチャを変数に代入\n            texture = tex;\n            console.log(\"texture\",texture);\n        };\n\n        // イメージオブジェクトのソースを指定\n        img.src = source;\n        console.log(\"create_texture\",img.src);\n    }\n\n}\n\nmodule.exports = WebGLUtil;\n\n\n//# sourceURL=webpack:///./src/WebGLUtil.js?");

/***/ }),

/***/ "./src/gl.frag":
/*!*********************!*\
  !*** ./src/gl.frag ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"precision mediump float;\\nuniform vec4  resolution;\\n\\nvoid main(void){\\n    vec2 p = gl_FragCoord.xy / resolution.xy;\\n\\n    gl_FragColor = vec4(p.x, p.y, 0.5, 1.0);\\n}\"\n\n//# sourceURL=webpack:///./src/gl.frag?");

/***/ }),

/***/ "./src/gl.vert":
/*!*********************!*\
  !*** ./src/gl.vert ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"// ATTRIBUTE\\nattribute vec3 position;\\n\\nvoid main(void)\\n{\\n    gl_Position = vec4(position, 1.0);\\n}\\n\"\n\n//# sourceURL=webpack:///./src/gl.vert?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const WebGLUtil = __webpack_require__(/*! ./WebGLUtil.js */ \"./src/WebGLUtil.js\");\n\n/**\n * @param {Element} video\n */\nconst createPictureInPicture = (video)=>{\n    const body = document.body;\n    body.appendChild(video);\n\n    video.addEventListener(\"loadedmetadata\",()=>{\n        video.play();\n        video.requestPictureInPicture();\n    });\n\n    video.addEventListener(\"enterpictureinpicture\",()=>{\n        video.style.display = \"none\";\n    });\n\n    video.addEventListener(\"leavepictureinpicture\",()=>{\n        video.remove();\n    })\n\n};\n\nconst createVideofromCanvas = (canvas)=>{\n    const stream = canvas.captureStream(60);\n\n    // canvasを表示するだけのvideo要素を作る\n    const video = document.createElement('video');\n    video.autoplay = true;\n    video.muted = true;\n    video.playsInline = true;\n    video.srcObject = stream;\n\n    video.play();\n\n    return video;\n}\n\nconst main = ()=>{\n    const button = document.createElement(\"button\");\n    button.type = \"button\";\n    button.textContent = \"Picture-In-Picture\";\n    button.addEventListener(\"click\",()=>{\n        const video = createVideofromCanvas(webglUtil.c);\n        // video.src = \"./zGOZoM77ilTEnSpv.mp4\";\n        createPictureInPicture(video);\n    });\n    const body = document.body;\n    body.appendChild(button);\n\n\n    const description = document.createElement(\"div\");\n    description.textContent = \"WebGLでCanvasに出力 -> Canvasを変換してvideoタグに入れる -> PictureInPictureでフロートする\";\n    const memo = document.createElement(\"div\");\n    memo.textContent = \"キャラを踊らせたりゲームしたりもできるはず\";\n\n    body.appendChild(description);\n    body.appendChild(memo);\n\n    const webglUtil = new WebGLUtil();\n    webglUtil.init(\"canvas\");\n    webglUtil.c.style.display = \"none\";\n    webglUtil.createPolygon(\"plane\");\n    webglUtil.setUniform4(\"plane\",\"resolution\",[800.0, 800.0, 0.0, 0.0]);\n    const loopWebGL = ()=>{\n        webglUtil.draw();\n        requestAnimationFrame(loopWebGL);\n    }\n    loopWebGL();\n};\n\nwindow.addEventListener(\"load\",()=>{\n    main();\n});\n\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });