# PetitGL
![icon](img/icon.svg)  
A petit JS library to handle WebGL more easily  
[src](petitgl.js)
## usage
### instance
#### instance
```js
new PetitGL(canvas, color);
```
- `canvas` *Optional* HTMLCanvasElement  
	canvas to draw. if undefined creates new canvas.  
	stored in `this.c`
- `color` *Optional* Array(4)  
	rgba normalized array to clear canvas.  
	default is `[0,0,0,0]`

### resize
#### resize
```js
this.resize(width, height);
```
- `width` Number  
	defines width with Number.  
- `height` Number  
	defines height with Number.  

### create program
#### compile
```js
this.compile(programName, vertexShader, fragmentShader);
```
- `programName` programName:String  
	defines program name with String.
- `vertexShader` String  
	vertex shader used in this program.
- `fragmentShader` String  
	fragment shader used in this program.

### texture
#### tex
```js
this.tex(textures);
```
- `textures` Array  
	```js
	[{name, url, fx}...]
	```
	- `name` texName:String  
		defines texture to access from uniforms name with String.
	- `url` URL:String  
		defines location of the image file with String.
	- `fx` Function  
		callback function called when the texture loading succeeded.

### frame buffer
#### buffer
```js
this.buffer(bufs);
```
- `bufs` Array  
	```js
	[{name, tex, width, height}...]
	```
	- `name` bufName:String  
		defines buffer name with String.
	- `tex` texName:String  
		defines texture name to access from uniforms with String.
	- `width` *Optional* Number  
		defines width of buffer with Number.
	- `height` *Optional* Number  
		defines height of buffer with Number.

### attributes
#### defAtt
```js
this.defAtt(prgName, alocs);
```
- `prgName` prgName:String  
	specify program to get attribute location with prgName.
- `alocs` Array  
	```js
	[alocName...]
	```
	- `alocName` alocName:String  
		defines attribute location name with String.

#### att
```js
this.att(atts);
```
- `atts` Array  
	```js
	[{name, data, slice}...]
	```
	- `name` attName:String  
		defines attribute name with String.
	- `data` Array  
		defines attribute data with Array.
	- `slice` Number  
		defines length of attribute. ie 2 for vec2, 4 for vec4.

#### ibo
```js
this.ibo(ibos);
```
- `ibos` Array  
	```js
	[{name, data}...]
	```
	- `name` iboName:String  
		defines ibo name with String.
	- `data` Array  
		defines ibo data with Array.

### uniforms
#### defUni
```js
this.defUni(prgName, ulocs);
```
- `prgName` prgName:String  
	specify program to get uniform location with prgName.
- `ulocs` Array  
	```js
	[ulocName...]
	```
	- `ulocName` ulocName:String  
		defines uniform location name with String.

after recompiled, running defUni is necessary.

#### uni
```js
this.uni(prgName, unis)
```

### draw
## example
