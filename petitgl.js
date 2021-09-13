//build: 2109140
class PetitGL{
	constructor(c=document.createElement('canvas'),col=[0,0,0,0]){
		const gl=c.getContext('webgl',{preserveDrawingBuffer:true})||c.getContext('experimental-webgl',{preserveDrawingBuffer:true});
		gl.clearColor(...col);
		gl.enable(gl.CULL_FACE);gl.frontFace(gl.CCW);
		gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearDepth(1);
		gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE);
		console.log(gl);
		this.gl=gl;this.c=c;this.log='';this.col=col;
		this.prg_={};this.buf_={};this.uloc_={};this.tex_={};
		this.ibo_={};this.aloc_={};this.att_={};
		if(this.gl.getExtension('OES_standard_derivatives'))console.log('OES_standard_derivatives');
		return this;
	}
	resize(w,h){this.c.width=w;this.c.height=h;this.gl.viewport(0,0,this.c.width,this.c.height);return this;}
	_sh(gl,type,src){
		const sh=gl.createShader(gl[type]);
		gl.shaderSource(sh,'#define round(x) floor(x+.5)\n'+src);
		gl.compileShader(sh);
		console.log(type,sh);
		return{sta:gl.getShaderParameter(sh,gl.COMPILE_STATUS),dat:sh,log:gl.getShaderInfoLog(sh)};
	}
	_prg(gl,v,f){
		const prg=gl.createProgram();
		gl.attachShader(prg,v);gl.attachShader(prg,f);gl.linkProgram(prg);
		console.log(prg);
		return{sta:gl.getProgramParameter(prg,gl.LINK_STATUS),dat:prg,log:gl.getProgramInfoLog(prg)};
	}
	_mip(gl,w,h){
		if(((w&(w-1))==0)&&((h&(h-1))==0))gl.generateMipmap(gl.TEXTURE_2D);
		else{
			console.log('mipmap canceled');
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
		}
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	}
	compile(pn,vsh,fsh){//pn: prgName, vsh:String, fsh:String
		this.log='';
		if(typeof vsh=='string')vsh=this._sh(this.gl,'VERTEX_SHADER',vsh);
		if(typeof fsh=='string')fsh=this._sh(this.gl,'FRAGMENT_SHADER',fsh);
		if(vsh.sta&&fsh.sta)this.prg_[pn]=this._prg(this.gl,vsh.dat,fsh.dat);
		else{
			if(vsh.sta)this.log+=`${pn}_vsh:\n${vsh.log}\n`;
			if(fsh.sta)this.log+=`${pn}_vsh:\n${fsh.log}\n`;
			this.log+='\n';
		};
		return this;
	}
	tex(texs){//texs: [...{name:texName,url,fx(tex,size)}]
		const gl=this.gl;
		for(const x of texs){
			const img=new Image();
			img.onload=()=>{
				const tex=gl.createTexture(),size=[img.naturalWidth,img.naturalHeight];
				gl.bindTexture(gl.TEXTURE_2D,tex);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
				gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
				this._mip(gl,...size);
				gl.bindTexture(gl.TEXTURE_2D,null);
				console.log(img,tex,size);
				this.tex_[x.name]={tex,size};
				if(x.fx)x.fx(tex,size);
			};
			img.src=x.url;
		}
		return this;
	}
	buffer(bufs){//buffs: [...{name:bufName,tex:texName(,w:Int,h:Int)}]
		const gl=this.gl;
		for(const x of bufs){
			const f=gl.createFramebuffer(),d=gl.createRenderbuffer(),t=gl.createTexture(),w=x.w||this.c.width,h=x.h||this.c.height;
			gl.bindFramebuffer(gl.FRAMEBUFFER,f);
			gl.bindRenderbuffer(gl.RENDERBUFFER,d);
			gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,d);
			gl.bindTexture(gl.TEXTURE_2D,t);
			gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
			this._mip(gl,w,h);
			gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
			gl.bindTexture(gl.TEXTURE_2D,null);
			gl.bindRenderbuffer(gl.RENDERBUFFER,null);
			gl.bindFramebuffer(gl.FRAMEBUFFER,null);
			this.buf_[x.name]={f,d,t};
			if(this.tex_[x.tex])console.log(`${this.tex_[x.tex]} is overwritten by buffer ${x.name}.`);
			this.tex_[x.tex]={tex:t,size:[w,h]};
		}
		return this;
	}
	defAtt(pn,alocs){//pn: prgName, alocs: [...alocName]
		const tmp={};
		for(const x of alocs)tmp[x]=this.gl.getAttribLocation(this.prg_[pn].dat,x);
		this.aloc_[pn]=tmp;
		return this;
	}
	att(atts){//atts: [...{name:attName,data:Array,slice:Int}]
		const gl=this.gl;
		for(const x of atts){
			if(!this.att_[x.name])this.att_[x.name]={dat:gl.createBuffer()};
			gl.bindBuffer(gl.ARRAY_BUFFER,this.att_[x.name].dat);
			gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(x.data),gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER,null);
			this.att_[x.name].slice=x.slice;
		}
		return this;
	}
	ibo(ibos){//ibos: [...{name:iboName,data:Array}]
		const gl=this.gl;
		for(const x of ibos){
			if(!this.ibo_[x.name])this.ibo_[x.name]={dat:gl.createBuffer()};
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo_[x.name].dat);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Int16Array(x.data),gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
			this.ibo_[x.name].l=x.data.length;
		}
		return this;
	}
	defUni(pn,ulocs){//pn: prgName, ulocs: [...ulocName]
		const tmp={};
		for(const x of ulocs)tmp[x]=this.gl.getUniformLocation(this.prg_[pn].dat,x);
		this.uloc_[pn]=tmp;
		return this;
	}
	uni(pn,unis){//unis: [...{loc:ulocName,data:Array||texName,(type:String,rname:ulocName)}]
		const gl=this.gl,
			fim={
				0:{},
				i:[0,'uniform1iv','uniform2iv','uniform3iv','uniform4iv'],
				f:[0,'uniform1fv','uniform2fv','uniform3fv','uniform4fv'],
				m:{4:'uniformMatrix2fv',9:'uniformMatrix3fv',16:'uniformMatrix4fv'}
			};
		let texi=0;
		for(const x of unis){
			if(fim[x.type||0][x.data.length])gl[fim[x.type][x.data.length]](this.uloc_[pn][x.loc],...(x.type=='m'?[false,x.data]:[x.data]));
			else if(typeof x.data=='string'){
				if(!this.tex_[x.data])continue;
				gl.activeTexture(gl['TEXTURE'+texi]);
				gl.bindTexture(gl.TEXTURE_2D,this.tex_[x.data].tex);
				gl.uniform1i(this.uloc_[pn][x.loc],texi);
				if(x.rname)gl.uniform2fv(this.uloc_[pn][x.rname],this.tex_[x.data].size);
				texi++;
			}else throw x;
		}
		return this;
	}
	draw(pn,atts,ibo,cl=1,buf,mode='TRIANGLES'){//pn: prgName, atts: [...{loc:alocName,att:attName}], ibo: iboName(, cl:Boolean, buf:bufName, mode: glDrawMode)
		const gl=this.gl;
		gl.useProgram(this.prg_[pn].dat);
		if(buf)gl.bindFramebuffer(gl.FRAMEBUFFER,this.buf_[buf].f);
		if(cl)gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.clearColor(...this.col);gl.clearDepth(1);
		for(const x of atts){
			gl.bindBuffer(gl.ARRAY_BUFFER,this.att_[x.att].dat);
			gl.enableVertexAttribArray(this.aloc_[pn][x.loc]);
			gl.vertexAttribPointer(this.aloc_[pn][x.loc],this.att_[x.att].slice,gl.FLOAT,false,0,0);
			gl.bindBuffer(gl.ARRAY_BUFFER,null);
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo_[ibo].dat);
		gl.drawElements(gl[mode],this.ibo_[ibo].l,gl.UNSIGNED_SHORT,0);
		if(buf)gl.bindFramebuffer(gl.FRAMEBUFFER,null);
		return this;
	}
	flush(){this.gl.flush();return this;}
}
