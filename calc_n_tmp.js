x=(x.match(/^f .+$/gm)||[]).map(y=>{
	y=spl(y).map(z=>{z=z.split('/');return[(v[z[0]-1]||[])[0],vn[z[2]-1],(v[z[0]-1]||[])[1],vt[z[1]-1]];});
	if(y.some(z=>!z[1])){
		const cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
			nl=z=>{const l=Math.sqrt([...z].reduce((a,w)=>a+w*w,0));return l?z.map(w=>w/l):z;},
			n=nl(cr(...[y[1][0],y[2][0]].map(z=>z.map((w,i)=>w-y[0][0][i]))));
		y=y.map(z=>{if(!z[1])z.splice(1,1,n);return z;});
	}
	if(y.some(z=>!z[3]))y=y.map(z=>{if(!z[3])z.splice(3,1,[0,0]);return z;});
	y=y.map(z=>z.map(w=>w.join(' ')).join(','));
	return new Array(y.length-2).fill().map((_,i)=>[y[0],y[1+i],y[2+i]]);
}).flat(2);
const set=[...new Set(x)],obj=new Map(set.map((y,i)=>[y,i])),
	i=x.map(y=>obj.get(y));
x=set.map(y=>y.split(',').map(z=>z.split(' ').map(Number)));
x={...fmarr(x),i};
console.info('obj',`${Date.now()-t0}ms`);
return x;
