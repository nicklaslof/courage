/*
 * TinySprite module (https://github.com/bitnenfer/tiny-canvas)
 * Developed by Felipe Alfonso -> https://twitter.com/bitnenfer/
 * 
 *  ----------------------------------------------------------------------
 * 
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                     Version 2, December 2004
 * 
 *  Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 * 
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 * 
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 * 
 *   0. You just DO WHAT THE FUCK YOU WANT TO.
 * 
 *  ----------------------------------------------------------------------
 * 
 */
export function TinySprite(canvas) {
    var gl = canvas.getContext('webgl', { premultipliedAlpha: true }),
        // float + (vec2 * 4) + (char * 4)
        VERTEX_SIZE = 4 + ((4 * 2) * 4) + (4),
        MAX_BATCH = 10922, // floor((2 ^ 16) / 6)
        VERTEX_DATA_SIZE = VERTEX_SIZE * MAX_BATCH * 4,
        VERTICES_PER_QUAD = 6, 
        INDEX_DATA_SIZE = MAX_BATCH * (2 * VERTICES_PER_QUAD),
        width = canvas.width,
        height = canvas.height,
        shader = CreateShaderProgram(
            gl, [
                'precision lowp float;',
                'attribute float a;',
                'attribute vec2 b,c,d,e;',
                'attribute vec4 f;',
                'varying vec2 g;',
                'varying vec4 h;',
                'uniform mat4 i;',
                'void main() {',
                'float q=cos(a);',
                'float w=sin(a);',
                'gl_Position=i*vec4(((vec2(d.x*q-d.y*w,d.x*w+d.y*q)*c)+b),1.0,1.0);',
                'g=e;',
                'h=f;',
                '}'
            ].join('\n'), [
                'precision lowp float;',
                'varying vec2 g;',
                'varying vec4 h;',
                'uniform sampler2D j;',
                'void main(){',
                'vec4 c=texture2D(j,g)*h;',
                'vec2 p = mod(gl_FragCoord.xy, 3.0);',
                'float d = (mod(floor(p.x) + floor(p.y) * 2.0, 4.0) * 4.0 + mod(floor(p.x / 2.0) + floor(p.y / 2.0) * 2.0, 4.0)) / 16.0 -0.5;',
                'gl_FragColor=vec4(c.rgb + vec3(d*0.5), c.a);;',
                '}'
            ].join('\n')
        ),
        glBufferSubData = gl.bufferSubData.bind(gl),
        glDrawElements = gl.drawElements.bind(gl),
        glBindTexture = gl.bindTexture.bind(gl),
        //glClear = gl.clear.bind(gl),
        //glClearColor = gl.clearColor.bind(gl),
        vertexData = new ArrayBuffer(VERTEX_DATA_SIZE),
        vPositionData = new Float32Array(vertexData),
        vColorData = new Uint32Array(vertexData),
        vIndexData = new Uint16Array(INDEX_DATA_SIZE),
        IBO = CreateBuffer(gl, 34963, vIndexData.byteLength, 35044),
        VBO = CreateBuffer(gl, 34962, vertexData.byteLength, 35048),
        count = 0,
        currentTexture = null,
        renderer = null,
        locRotation, locTranslation, locScale,
        locPosition, locUV, locColor;

    gl.blendFunc(770, 771);
    gl.enable(3042);
    gl.useProgram(shader);
    gl.bindBuffer(34963, IBO);
    var indexB = 0;
    for (var i = 0, j = 0; i < MAX_BATCH * VERTICES_PER_QUAD; i += 6, j += 4) {
        vIndexData.set([j, j + 1, j + 2, j, j + 3, j + 1], i);
    }

    gl.bufferSubData(34963, 0, vIndexData);
    gl.bindBuffer(34962, VBO);

    locRotation = gl.getAttribLocation(shader, 'a');
    locTranslation = gl.getAttribLocation(shader, 'b');
    locScale = gl.getAttribLocation(shader, 'c');
    locPosition = gl.getAttribLocation(shader, 'd');
    locUV = gl.getAttribLocation(shader, 'e');
    locColor = gl.getAttribLocation(shader, 'f');

    // Rotation
    gl.enableVertexAttribArray(locRotation);
    gl.vertexAttribPointer(locRotation, 1, 5126, 0, VERTEX_SIZE, 0);

    // Translation
    gl.enableVertexAttribArray(locTranslation);
    gl.vertexAttribPointer(locTranslation, 2, 5126, 0, VERTEX_SIZE, 4);

    // Scale
    gl.enableVertexAttribArray(locScale);
    gl.vertexAttribPointer(locScale, 2, 5126, 0, VERTEX_SIZE, 12);

    // Position
    gl.enableVertexAttribArray(locPosition);
    gl.vertexAttribPointer(locPosition, 2, 5126, 0, VERTEX_SIZE, 20);

    // UV
    gl.enableVertexAttribArray(locUV);
    gl.vertexAttribPointer(locUV, 2, 5126, 0, VERTEX_SIZE, 28);

    // Color
    gl.enableVertexAttribArray(locColor);
    gl.vertexAttribPointer(locColor, 4, 5121, 1, VERTEX_SIZE, 36);

    gl.uniformMatrix4fv(gl.getUniformLocation(shader, 'i'), 0,
        new Float32Array([
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 1, 1,
            -1, 1, 0, 0
        ])
    );
    gl.activeTexture(33984);
    renderer = {
        'g': gl,
        'c': canvas,
        'col': 0xFFFFFFFF,
        'bkg': function (r, g, b, a) {
            gl.clearColor(r, g, b, a);
        },
        'flip': false,
        'cls': function () {
            gl.clear(16384);
        },
        'img': function (texture, x, y, w, h, r, tx, ty, sx, sy, u0, v0, u1, v1) {
            var x0 = x,
                y0 = y,
                x1 = x + w,
                y1 = y + h,
                x2 = x,
                y2 = y + h,
                x3 = x + w,
                y3 = y,
                offset = 0,
                argb = renderer['col'];

            if (texture != currentTexture ||
                count + 1 >= MAX_BATCH) {
                glBufferSubData(34962, 0, vertexData);
                glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0);
                count = 0;
                if (texture != currentTexture) {
                    currentTexture = texture;
                    glBindTexture(3553, currentTexture);
                }
            }

            offset = count * VERTEX_SIZE;
            var vertices = [x0,y0,x1,y1,x2,y2,x3,y3];
            if (renderer['flip']) vertices = [x3,y3,x2,y2,x1,y1,x0,y0];
            // Vertex Order: 
            // rotation | translation | scale | position | uv | color
            // Vertex 1
            vPositionData[offset++] = r;
            vPositionData[offset++] = tx;
            vPositionData[offset++] = ty;
            vPositionData[offset++] = sx;
            vPositionData[offset++] = sy;
            vPositionData[offset++] = vertices[0];
            vPositionData[offset++] = vertices[1];
            vPositionData[offset++] = u0;
            vPositionData[offset++] = v0;
            vColorData[offset++] = argb;

            // Vertex 2
            vPositionData[offset++] = r;
            vPositionData[offset++] = tx;
            vPositionData[offset++] = ty;
            vPositionData[offset++] = sx;
            vPositionData[offset++] = sy;
            vPositionData[offset++] = vertices[2];
            vPositionData[offset++] = vertices[3];
            vPositionData[offset++] = u1;
            vPositionData[offset++] = v1;
            vColorData[offset++] = argb;

            // Vertex 3
            vPositionData[offset++] = r;
            vPositionData[offset++] = tx;
            vPositionData[offset++] = ty;
            vPositionData[offset++] = sx;
            vPositionData[offset++] = sy;
            vPositionData[offset++] = vertices[4];
            vPositionData[offset++] = vertices[5];
            vPositionData[offset++] = u0;
            vPositionData[offset++] = v1;
            vColorData[offset++] = argb;

            // Vertex 4
            vPositionData[offset++] = r;
            vPositionData[offset++] = tx;
            vPositionData[offset++] = ty;
            vPositionData[offset++] = sx;
            vPositionData[offset++] = sy;
            vPositionData[offset++] = vertices[6];
            vPositionData[offset++] = vertices[7];
            vPositionData[offset++] = u1;
            vPositionData[offset++] = v0;
            vColorData[offset++] = argb;

            if (++count >= MAX_BATCH) {
                glBufferSubData(34962, 0, vertexData);
                glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0);
                count = 0;               
            }
        },
        'flush': function () {
            if (count == 0) return;
            glBufferSubData(34962, 0, vPositionData.subarray(0, count * VERTEX_SIZE));
            glDrawElements(4, count * VERTICES_PER_QUAD, 5123, 0);
            count = 0;
        }
    };
    return renderer;
}
function CompileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function CreateShaderProgram(gl, vsSource, fsSource) {
    const program = gl.createProgram();
    [35633, 35632].forEach((type, i) => 
        gl.attachShader(program, CompileShader(gl, [vsSource, fsSource][i], type))
    );
    gl.linkProgram(program);
    return program;
}

function CreateBuffer(gl, bufferType, size, usage) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, size, usage);
    return buffer;
}