uniform vec2 iResolution;
uniform float iGlobalTime;


// Some utils first

// From Stackoveflow
// http://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Simplex 2D noise
// from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 25.0 * dot(m, g);
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    // simplex noise implementation
    float xnoise = snoise(vec2(uv.x, iGlobalTime / 5.0 + 10000.0));
    float ynoise = snoise(vec2(uv.y, iGlobalTime / 5.0 + 500.0));
    vec2 t = vec2(xnoise, ynoise);
    float s1 = snoise(uv + t / 2.0 + snoise(uv + snoise(uv + t/3.0) / 5.0));
    float s2 = snoise(uv + snoise(uv + s1) / 7.0);
    vec3 hsv = vec3(s1, 1.0, 1.0-s2);
    vec3 hsv2 = vec3(1.0-s2, 1.0, 1.0-s1);
    vec3 rgb = hsv2rgb(hsv);
    vec3 rgb2 = hsv2rgb(hsv2);

    vec2 st = gl_PointCoord;
    float mixValue = distance(st, vec2(0, 0.75));

    vec3 color1 = vec3(
        abs(0.25 * sin(iGlobalTime/10.0)), 
        abs(sin(iGlobalTime/15.0)), 
        abs(0.5 * sin(iGlobalTime/4.0))+ 0.9
    );
    vec3 color2 = vec3(
        abs(0.25 * sin(iGlobalTime/10.0)) + 0.5, 
        abs(0.05 * sin(iGlobalTime/15.0)) + 0.5, 
        abs(sin(iGlobalTime/4.0))+ 0.5
    );
    vec3 color = mix(rgb, color2, mixValue);
    gl_FragColor = vec4(color, 1.0);
}
