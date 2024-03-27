uniform vec2 iResolution;
uniform sampler2D iChannel0;

void main() {
	// gl_Position = texture( iChannel0, position.xy / iResolution.xy);
	gl_Position = vec4(position, 1.0);
}