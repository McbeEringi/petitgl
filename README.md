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
	[{name, data, animate, flush}...]
	```
	- `name` texName:String  
		defines texture to access from uniforms name with String.  
		always required.
	- `data` *Optinal* HTMLImageElement || HTMLVideoElement || HTMLCanvasElement
		specify loaded HTMLElement applied to texture.  
		required when initialize.
	- `data` *Optinal* Object  
		required when initialize.
		```js
		{url, type, fx}
		```
		- `url` String  
			defines location of the file with String.
		- `type` String  
			defines type of the file with String.  
			specify `img` or `vid`.
		- `fx` *Optinal* Function  
			callback function runs after file is loaded.  
			current object of textures array that data property is replaced with proper HTMLElement will be taken as argument.
	- `animate` *Optinal* Boolean  
		defines whether this texture needs update every frame or not.  
		default is `false`.
	- `flush` *Insider* Boolean  
		if true this texture will updated in next uni() call.  
		use when texture refresh is needed.  
		default is `true` .  
		example:
		```js
		this.tex([{name:'texture0',flush:true}]);
		```  

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
this.uni(prgName, unis);
```
- `prgName` prgName:String  
	specify program to get uniform location with prgName.
- `unis` Array  
	can be combined
	- float, vec, int…
		```js
		[{loc, data, type}...]
		```
		- `loc` ulocName:String  
			specify uniform location name with String.
		- `data` Array  
			defines uniform data with Array.
		- `type` String  
			defines uniforms type with String.  
			specify `f`(float,vec) or `i`(int).
	- texture
		```js
		[{loc, data, rname}...]
		```
		- `loc` ulocName:String  
			specify uniform location name with String.
		- `data` texName:String  
			specify texture name with Array.
		- `rname` *Optional* ulocName:String  
			specify uniform location name with String.  
			for texture size (vec2).

### draw
#### draw
```js
	this.draw(prgName, atts, ibo, clear, buf, mode);
```
- `prgName` prgName:String  
	specify program to get uniform location with prgName.
- `atts` Array  
	```js
	[{loc, att}...],
	```
	- `loc` alocName:String  
		specify attribute location.
	- `att` attName:String
		specify attribute for the attribute location.
- `ibo` iboName:String  
	specify ibo matches for atts.
- `clear` *Optional* Boolean  
	defines clear canvas(or buffer) or not.  
	default is `true`.
- `buf` *Optionl* bufName  
	specify target buffer name.
	falsy value to draw canvas.
- `mode` *Optional* glDrawMode  
	defines drawmode with String.  
	default is `TRIANGLES`.


## example
see index.html
