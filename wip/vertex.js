export default ` 
struct Position {
            float incline;
            float offsetVert;
            vec2 noiseFreq;
            float noiseFlow;
            float noiseAmp;
            float noiseSeed;
        };

        uniform Position u_position;
        uniform vec2 iResolution;

        void main() {
            // Left-to-right angle
            float incline = iResolution.x * uv.x / 2.0 * u_position.incline;

            // Up-down shift to offset incline
            float offset = iResolution.x / 2.25 * u_position.incline * 0.2 + u_position.offsetVert;

            vec3 pos = vec3(
                position.x,
                position.y + incline - offset,
                position.z
            );

            gl_Position = vec4(pos, 1.0);
        }
        `