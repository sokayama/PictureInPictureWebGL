class WebGLUtil {
    constructor(){

        this.c = null;
        this.gl = null;

        this.polygon = [];
    }

    init(canvas_id){
        // - canvas と WebGL コンテキストの初期化 -------------------------------------
        // canvasエレメントを取得
        this.c = document.getElementById(canvas_id);

        // canvasのサイズをスクリーン全体に広げる
        this.c.width = 800;
        this.c.height = 800;

        // webglコンテキストを取得
        this.gl = this.c.getContext('webgl') || this.c.getContext('experimental-webgl');

    }

    createPolygon(name){
        if(this.polygon[name] == null){
            this.polygon[name] = new Polygon(this.gl);

            // シェーダのソースを取得
            const shader = {
                vs : require("./gl.vert"),
                fs : require("./gl.frag")
            }

            this.polygon[name].create(shader.vs,shader.fs);

        }else{
            console.error("[WebGLUtil:createPolygon] this name (" + name + ") is available. set other name.");
        }
    }

    reloadShader(){
        for(let i in this.polygon){
            if(this.polygon[i] != null){

                // シェーダのソースを取得
                const shader = {
                    vs : require("./gl.vert"),
                    fs : require("./gl.frag")
                }

                this.polygon[i].create(shader.vs,shader.fs);

            }
        }
    }

    /**
     * @param {string} name polygonname
     * @param {string} uniform uniformname
     * @param {float[4]} param xyzw
     *
     */
    setUniform4(name,uniform,param){
        if(this.polygon[name] == null){
            console.error("[WebGLUtil:setUniform] this name (" + name + ") is  not available.")
        }else{
            if(this.polygon[name].prg){
                const uni = this.gl.getUniformLocation(this.polygon[name].prg, uniform);

                this.gl.uniform4fv(uni,param);
            }else{
            }
        }
    }

    draw(){
        // - レンダリングのための WebGL 初期化設定 ------------------------------------
        // ビューポートを設定する
        this.gl.viewport(0, 0, this.c.width, this.c.height);

        // canvasを初期化する色を設定する
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // canvasを初期化する際の深度を設定する
        this.gl.clearDepth(1.0);

        // canvasを初期化
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        for(let i in this.polygon){
            if(this.polygon[i].ready){
                this.gl.drawElements(this.gl.TRIANGLES, this.polygon[i].index.length, this.gl.UNSIGNED_SHORT, 0);
            }
        }
        // コンテキストの再描画
        this.gl.flush();
    }
}


class Polygon{
    constructor(gl){
        this.gl = gl;
        this.prg = null;
        this.attLocation = {};
        this.attStride = {};
        this.vPosition  = {};
        this.textureCoord = {};
        this.index = {};
        this.attVBO = {};
        this.ibo = null;

        this.ready = false;
    }

    // いたポリ召喚の儀
    create(vs,fs){
        // - シェーダとプログラムオブジェクトの初期化 ---------------------------------

        // 頂点シェーダとフラグメントシェーダの生成
        const vShader = this.create_shader(vs, this.gl.VERTEX_SHADER);
        const fShader = this.create_shader(fs, this.gl.FRAGMENT_SHADER);

        // プログラムオブジェクトの生成とリンク
        this.prg = this.create_program(vShader, fShader);

        // - 頂点属性に関する処理 -----------------------------------------------------
        // attributeLocationの取得
        this.attLocation = {};
        this.attLocation[0] = this.gl.getAttribLocation(this.prg, 'position');
        this.attLocation[1] = this.gl.getAttribLocation(this.prg, "textureCoord");

        // attributeの要素数
        this.attStride = {};
        this.attStride[0] = 3;
        this.attStride[1] = 2;

        // 板ポリモデル(頂点)データ
        this.vPosition = [
            1.0,   1.0,  0.0,
            1.0,  -1.0,  0.0,
            -1.0,  -1.0,  0.0,
            -1.0,  1.0,  0.0
        ];
        this.textureCoord = [
            1.0,0.0,
            1.0,1.0,
            0.0,1.0,
            0.0,0.0
        ];

        // 頂点インデックス
        this.index = [
            0, 2, 1,
            0, 3, 2
        ];


        // VBOの生成
        this.attVBO = {};
        this.attVBO[0] = this.create_vbo(this.vPosition);
        this.attVBO[1] = this.create_vbo(this.textureCoord);

        // VBOをバインド
        this.set_attribute(this.attVBO, this.attLocation, this.attStride);

        this.ibo = this.create_ibo(this.index);

        // IBOをバインド
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        this.ready = true;
    }


    /**
     * シェーダを生成する関数
     * @param {string} source シェーダのソースとなるテキスト
     * @param {number} type シェーダのタイプを表す定数 this.gl.VERTEX_SHADER or this.gl.FRAGMENT_SHADER
     * @return {object} 生成に成功した場合はシェーダオブジェクト、失敗した場合は null
     */
    create_shader(source, type){
        // シェーダの生成
        const shader = this.gl.createShader(type);

        // 生成されたシェーダにソースを割り当てる
        this.gl.shaderSource(shader, source);

        // シェーダをコンパイルする
        this.gl.compileShader(shader);

        // シェーダが正しくコンパイルされたかチェック
        if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){

            // 成功していたらシェーダを返して終了
            return shader;
        }else{

            // 失敗していたらエラーログをアラートする
            alert(this.gl.getShaderInfoLog(shader));

            // null を返して終了
            return null;
        }
    }

    /**
     * プログラムオブジェクトを生成しシェーダをリンクする関数
     * @param {object} vs 頂点シェーダとして生成したシェーダオブジェクト
     * @param {object} fs フラグメントシェーダとして生成したシェーダオブジェクト
     * @return {object} 生成に成功した場合はプログラムオブジェクト、失敗した場合は null
     */
    create_program(vs, fs){
        // プログラムオブジェクトの生成
        const program = this.gl.createProgram();

        // プログラムオブジェクトにシェーダを割り当てる
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);

        // シェーダをリンク
        this.gl.linkProgram(program);

        // シェーダのリンクが正しく行なわれたかチェック
        if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){

            // 成功していたらプログラムオブジェクトを有効にする
            this.gl.useProgram(program);

            // プログラムオブジェクトを返して終了
            return program;
        }else{

            // 失敗していたらエラーログをアラートする
            alert(this.gl.getProgramInfoLog(program));

            // null を返して終了
            return null;
        }
    }

    /**
     * VBOを生成する関数
     * @param {Array.<number>} data 頂点属性を格納した一次元配列
     * @return {object} 頂点バッファオブジェクト
     */
    create_vbo(data){
        // バッファオブジェクトの生成
        const vbo = this.gl.createBuffer();

        // バッファをバインドする
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);

        // バッファにデータをセット
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

        // バッファのバインドを無効化
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        // 生成した VBO を返して終了
        return vbo;
    }

    /**
     * IBOを生成する関数
     * @param {Array.<number>} data 頂点インデックスを格納した一次元配列
     * @return {object} インデックスバッファオブジェクト
     */
    create_ibo(data){
        // バッファオブジェクトの生成
        const ibo = this.gl.createBuffer();

        // バッファをバインドする
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);

        // バッファにデータをセット
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);

        // バッファのバインドを無効化
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

        // 生成したIBOを返して終了
        return ibo;
    }

    /**
     * VBOをバインドし登録する関数
     * @param {object} vbo 頂点バッファオブジェクト
     * @param {Array.<number>} attribute location を格納した配列
     * @param {Array.<number>} アトリビュートのストライドを格納した配列
     */
    set_attribute(vbo, attL, attS){
        // 引数として受け取った配列を処理する
        console.log("attL",attL, attS);
        for(let i in vbo){
            console.log(attL[i])
            // バッファをバインドする
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);

            // attributeLocationを有効にする
            this.gl.enableVertexAttribArray(attL[i]);

            // attributeLocationを通知し登録する
            this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
        }
    }


    /**
     * テクスチャを生成する関数
     * @param {string} source テクスチャに適用する画像ファイルのパス
     */
    create_texture(source,texture){
        // イメージオブジェクトの生成
        const img = new Image();

        // データのオンロードをトリガーにする
        img.onload = function(){
            // テクスチャオブジェクトの生成
            const tex = this.gl.createTexture();

            // テクスチャをバインドする
            this.gl.bindTexture(this.gl.TEXTURE_2D, tex);

            // テクスチャへイメージを適用
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);

            //テクスチャパラメータ
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

            // ミップマップを生成
            // this.gl.generateMipmap(this.gl.TEXTURE_2D);

            // テクスチャのバインドを無効化
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

            // 生成したテクスチャを変数に代入
            texture = tex;
            console.log("texture",texture);
        };

        // イメージオブジェクトのソースを指定
        img.src = source;
        console.log("create_texture",img.src);
    }

}

module.exports = WebGLUtil;
