varying vec3 vColor;

uniform float uTime;
uniform float uTransitionTime;

void main()
{
    float strength=distance(gl_PointCoord,vec2(0.5));
    strength=1.0-strength;
    strength=pow(strength,10.0);
    strength = smoothstep(0.0, uTransitionTime, uTime) * strength;
    vec3 color=mix(vec3(0.0),vColor,strength);
    gl_FragColor=vec4(color,1.0);
}