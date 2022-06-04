precision mediump float;
uniform vec4  resolution;

void main(void){
    vec2 p = gl_FragCoord.xy / resolution.xy;

    gl_FragColor = vec4(p.x, p.y, 0.5, 1.0);
}