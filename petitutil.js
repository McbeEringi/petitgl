class PetitM4{
	constructor(x){return this.init(x);}
	init(x=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){this.main=new Float32Array(x);return this;}
	copy(){return new PetitM4(this.main);}
	get(){return this.main;}
	_norm(x){const l=Math.sqrt([...x].reduce((a,y)=>a+y*y,0));return l?x.map(y=>y/l):x;}
	mul(x){
		const b=this.main,a=(x||this).main||x;//console.log(x,a,b)
		this.main.set([0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3].map((m,i)=>
			new Array(4).fill().reduce((p,_,j)=>p+a[m+j*4]*b[i-m+j],0)
		));
		return this;
	}
	transpose(){
		this.main.set(this.main.map((_,i)=>this.main[[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15][i]]));
		return this;
	}
	inv(){
		const x=this.main,
			a=x[0]*x[5]-x[1]*x[4],b=x[0]*x[6]-x[2]*x[4],c=x[0]*x[7]-x[3]*x[4],d=x[1]*x[6]-x[2]*x[5],
			e=x[1]*x[7]-x[3]*x[5],f=x[2]*x[7]-x[3]*x[6],g=x[8]*x[13]-x[9]*x[12],h=x[8]*x[14]-x[10]*x[12],
			i=x[8]*x[15]-x[11]*x[12],j=x[9]*x[14]-x[10]*x[13],k=x[9]*x[15]-x[11]*x[13],l=x[10]*x[15]-x[11]*x[14],
			idet=1/(a*l-b*k+c*j+d*i-e*h+f*g);
		this.main.set([
			(x[5]*l-x[6]*k+x[7]*j)*idet,(-x[1]*l+x[2]*k-x[3]*j)*idet,(x[13]*f-x[14]*e+x[15]*d)*idet,(-x[9]*f+x[10]*e-x[11]*d)*idet,
			(-x[4]*l+x[6]*i-x[7]*h)*idet,(x[0]*l-x[2]*i+x[3]*h)*idet,(-x[12]*f+x[14]*c-x[15]*b)*idet,(x[8]*f-x[10]*c+x[11]*b)*idet,
			(x[4]*k-x[5]*i+x[7]*g)*idet,(-x[0]*k+x[1]*i-x[3]*g)*idet,(x[12]*e-x[13]*c+x[15]*a)*idet,(-x[8]*e+x[9]*c-x[11]*a)*idet,
			(-x[4]*j+x[5]*h-x[6]*g)*idet,(x[0]*j-x[1]*h+x[2]*g)*idet,(-x[12]*d+x[13]*b-x[14]*a)*idet,(x[8]*d-x[9]*b+x[10]*a)*idet
		]);
		return this;
	}
	scale(x=[]){if(typeof x=='number')x=[x,x,x];return this.mul([x[0]??1,0,0,0 ,0,x[1]??1,0,0, 0,0,x[2]??1,0, 0,0,0,1]);}
	translate(x=[]){return this.mul([1,0,0,0, 0,1,0,0, 0,0,1,0, x[0]??1,x[1]??1,x[2]??1,1]);}
	rot(a=[0,1,0],t=0){
		const s=Math.sin(t),c=Math.cos(t),ic=1-c;a=this._norm(a);
		return this.mul([
			c+a[0]*a[0]*ic,a[0]*a[1]*ic+a[2]*s,a[2]*a[0]*ic-a[1]*s,0,
			a[0]*a[1]*ic-a[2]*s,c+a[1]*a[1]*ic,a[1]*a[2]*ic+a[0]*s,0,
			a[2]*a[0]*ic+a[1]*s,a[1]*a[2]*ic-a[0]*s,c+a[2]*a[2]*ic,0,
			0,0,0,1
		]);
	}
	roteul(t=[0,0,0]){
		t=t.map(x=>[Math.cos(x),Math.sin(x)]);
		return this
			.mul([t[2][0],t[2][1],0,0, -t[2][1],t[2][0],0,0, 0,0,1,0, 0,0,0,1])
			.mul([t[1][0],0,t[1][1],0, 0,1,0,0, -t[1][1],0,t[1][0],0, 0,0,0,1])
			.mul([1,0,0,0, 0,t[0][0],t[0][1],0, 0,-t[0][1],t[0][0],0, 0,0,0,1]);
	}
	lookat(c=[0,0,1],o=[0,0,0],u=[0,1,0]){
		const cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
			z=this._norm(c.map((x,i)=>x-o[i])),x=this._norm(cr(u,z)),y=this._norm(cr(z,x));
		return this.mul([x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, ...[x,y,z].map(x=>-x.reduce((p,_,i)=>p+x[i]*c[i],0)),1]);
	}
	pers(v,r,n,f){
		const t=n*Math.tan(v*Math.PI/360),d=1/(f-n);
		return this.mul([n/(t*r),0,0,0, 0,n/t,0,0, 0,0,-(f+n)*d,-1, 0,0,-f*n*2*d,0]);
	}
	ortho(l,r,t,b,n,f){
		const w=1/(r-l),h=1/(t-b),d=1/(f-n);
		return this.mul([2*w,0,0,0, 0,2*h,0,0, 0,0,-2*d,0, -(l+r)*w,-(t+b)*h,-(f+n)*d,1]);
	}
}

class PetitQ{
	constructor(x){return this.init(x);}
	init(x=[1,0,0,0]){this.main=new Float32Array(x);return this;}
	copy(){return new PetitQ(this.main);}
	getIm(){return [...this.main].slice(1);}
	_norm(x){const l=Math.sqrt([...x].reduce((a,y)=>a+y*y,0));return l?x.map(y=>y/l):x;}
	mul(x){
		const a=this.main,b=(x||this).main||x;
		this.main.set([
			a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3],
			a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2],
			a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1],
			a[0]*b[3]+a[1]*b[2]-a[2]*b[1]+a[3]*b[0]
		]);
		return this;
	}
	norm(){this.main.set(this._norm(this.main));return this;}
	conj(){this.main.set(this.main.map((x,i)=>i?-x:x));return this;}
	rot(a=[0,0,0],t=1){const s=Math.sin(t*.5),c=Math.cos(t*.5);a=this._norm(a);return this.mul([c,...a.map(x=>x*s)]);}
	roteul(t=[0,0,0]){
		t=t.map(x=>[Math.cos(x*.5),Math.sin(x*.5)]);
		return this.mul([
			t[2][0]*t[1][0]*t[0][0]+t[2][1]*t[1][1]*t[0][1],
			t[2][1]*t[1][0]*t[0][0]-t[2][0]*t[1][1]*t[0][1],
			t[2][0]*t[1][1]*t[0][0]+t[2][1]*t[1][0]*t[0][1],
			t[2][0]*t[1][0]*t[0][1]-t[2][1]*t[1][1]*t[0][0]
		]);
	}
	slerp(q=[1,0,0,0],x=.5){
		q=q.main||q;
		let a=[...this.main].reduce((a,y,i)=>a+y*q[i],0),b=1-a*a;
		if(b>0){
			a=Math.acos(a);b=Math.sqrt(b);
			x=(b<.0001?[.5,.5]:[Math.sin(a*(1-x))/b,Math.sin(a*x)/b]);
			this.main.set(this.main.map((y,i)=>y*x[0]+q[i]*x[1]));
		}
		return this;
	}
	vec3(v=[0,0,1]){return this.copy().conj().mul([0,...v]).mul(this).getIm();}
	PetitM4(){
		const q=this.main,x=q[1]+q[1],y=q[2]+q[2],z=q[3]+q[3],
			xx=q[1]*x,xy=q[1]*y,xz=q[1]*z,yy=q[2]*y,yz=q[2]*z,zz=q[3]*z, wx=q[0]*x,wy=q[0]*y,wz=q[0]*z;
		return new PetitM4([1-yy-zz,xy-wz,xz+wy,0, xy+wz,1-xx-zz,yz-wx,0, xz-wy,yz+wx,1-xx-yy,0, 0,0,0,1]);
	}
}

const fmarr=x=>{x=x[0].map((_,i)=>x.map(y=>y[i]).flat());return{p:x[0],n:x[1],c:x[2],t:x[3],i:x[4]};},
cube=(x=1,c)=>{
	const n=[
		-1,-1,1,1,-1,1,1,1,1,-1,1,1, -1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1, -1,1,-1,-1,1,1,1,1,1,1,1,-1,
		-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1, 1,-1,-1,1,1,-1,1,1,1,1,-1,1, -1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1
	];
	return{
		p:n.map(y=>y*x),n,
		c:new Array(6).fill().map((_,i)=>new Array(4).fill(c||[...hsv(i/6),1])).flat(),
		t:new Array(6).fill([0,0,1,0,1,1,0,1]).flat(),
		i:new Array(6).fill().map((_,i)=>{i*=4;return[0,1,2,0,2,3].map(y=>y+i);}).flat()
	};
},
sphere=(x=1,c,sx=16,sy=sx*2)=>{
	x=new Array(sx+1).fill().map((_,i)=>{
		let ip=i/sx,is=-Math.PI*(ip-.5),ic=Math.cos(is);is=Math.sin(is);
		return new Array(sy+1).fill().map((_,j)=>{
			let jp=j/sy,js=2*Math.PI*jp,jc=Math.cos(js),k=i*(sy+1)+j;js=Math.sin(js);
			return[[ic*jc*x,is*x,ic*js*x],[ic*jc,is,ic*js],c||[...hsv(ip),1],[1-jp,1-ip],i==sx||j==sy?[]:[k,1+k,sy+1+k,sy+2+k,sy+1+k,1+k]];
		})
	}).flat();
	return fmarr(x);
},
torus=(x=1,c,sx=16,sy=sx*2)=>{
	x=new Array(sx+1).fill().map((_,i)=>{
		let ip=i/sx,is=2*Math.PI*ip,ic=Math.cos(is);is=Math.sin(is);
		return new Array(sy+1).fill().map((_,j)=>{
			let jp=j/sy,js=2*Math.PI*jp,jc=Math.cos(js),k=i*(sy+1)+j;js=Math.sin(js);
			return[[(ic-2)*jc*x,is*x,(ic-2)*js*x],[ic*jc,is,ic*js],c||[...hsv(jp),1],[1-jp,1-ip],i==sx||j==sy?[]:[k,1+k,sy+1+k,sy+2+k,sy+1+k,1+k]];
		})
	}).flat();
	return fmarr(x);
},
obj=(x,col=[1,1,1,1])=>{
	const t0=Date.now(),
		spl=(y,i)=>y.split(' ',i).filter(z=>z).slice(1),
		v=(x.match(/^v .+$/gm)||[]).map((y,i,a)=>{
			a=col?col:[...hsv(i/a.length),1];
			y=spl(y).map(Number);
			return({
				3:()=>[y,a],
				4:()=>{y[3]=1/x[3];return[y.slice(0,3).map(z=>z*y[3]),a];},
				6:()=>[y.slice(0,3),[...y.slice(3,6),1]],
			}[y.length])();
		}),
		vt=(x.match(/^vt .+$/gm)||[]).map(y=>spl(y,3).map(Number)),
		vn=(x.match(/^vn .+$/gm)||[]).map(y=>spl(y,4).map(Number));
	x=(x.match(/^f .+$/gm)||[]).map(y=>{
		y=spl(y);
		return new Array(y.length-2).fill().map((_,i)=>[y[0],y[1+i],y[2+i]]);
	}).flat(2);
	const set=[...new Set(x)],
		obj=new Map(set.map((y,i)=>[y,i])),
		i=x.map(y=>obj.get(y));
	x=set.map(y=>{
		y=y.split('/');
		return[v[y[0]-1][0],y[2]?vn[y[2]-1]:[0,1,0],v[y[0]-1][1],y[1]?vt[y[1]-1]:[0,0]];
	});
	x={...fmarr(x),i};
	console.info('obj',`${Date.now()-t0}ms`);
	return x;
},
hsv=(h=0,s=1,v=1)=>{h*=6;const f=h%1;return[[0,3,1],[2,0,1],[1,0,3],[1,2,0],[3,1,0],[0,1,2]][Math.floor(h)%6].map(x=>v*(1-s*[0,1,f,1-f][x]));};
