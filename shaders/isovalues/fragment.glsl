uniform float uTime;
uniform vec3 uResolution;
uniform float uTransitionTime;


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // float strength = smoothstep(0.0, uTransitionTime*2.0, uTime) * 1.;
    float strength = abs(sin(uTime*0.15) * .4);
	vec2 p = -1.0 + 2.0 * fragCoord.xy / uResolution.xy;
    float x = p.x;
    float y = p.y;
    float mov0 = x+y+cos(sin(uTime)*2.0)*100.+sin(x/100.)*1000.;
    float mov1 = y / 0.9 +  uTime;
    float mov2 = x / 0.2;
    float c1 = abs(sin(mov1+uTime)/2.+mov2/2.-mov1-mov2+uTime) * strength;
    float c2 = abs(sin(c1+sin(mov0/1000.+uTime*0.0001)+sin(y/40.+uTime*0.0001)+sin((x+y)/100.)*3.)) * strength;
    float c3 = abs(sin(c2+cos(mov1+mov2+c2)+cos(mov2)+sin(x/1000.))) * strength;
    fragColor = vec4(c2,c2,c2,1);
	
}


void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}