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
	defines width with number.  
- `height` Number  
	defines height with number.  

### create program
#### compile
```js
this.compile(programName, vertexShader, fragmentShader);
```
- `programName` programName:String  
	defines program name with string.
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
		defines texture to access from uniforms name with string.
	- `url` URL:String  
		defines location of the image file with string.
	- `fx` Function  
		callback function called when the texture loading succeeded.

### frame buffer
#### buffer
```js
this.buffer(bufs);
```
- `bufs` Array  
	```js
	[{name, tex(, width, height)}...]
	```
	- `name` bufName:String  
		defines buffer name with string.
	- `tex` URL:texName:String  
		defines texture name to access from uniforms with string.
	- `width` *Optional* Number  
		defines width of buffer with Number.
	- `height` *Optional* Nymber  
		defines height of buffer with Number

### attributes
### uniforms
### draw
## example
