const DATA={
length:[["mm","Millimeters (mm)",.001],["cm","Centimeters (cm)",.01],["m","Meters (m)",1],["km","Kilometers (km)",1000],["in","Inches (in)",.0254],["ft","Feet (ft)",.3048],["yd","Yards (yd)",.9144],["mi","Miles (mi)",1609.344]],
time:[["ms","Milliseconds (ms)",.001],["s","Seconds (s)",1],["min","Minutes (min)",60],["hr","Hours (hr)",3600],["day","Days",86400],["wk","Weeks",604800]],
mass:[["mg","Milligrams (mg)",.000001],["g","Grams (g)",.001],["kg","Kilograms (kg)",1],["tonne","Metric tonnes (t)",1000],["oz","Ounces (oz)",.028349523125],["lb","Pounds (lb)",.45359237]],
area:[["mm2","Square millimeters (mm²)",.000001],["cm2","Square centimeters (cm²)",.0001],["m2","Square meters (m²)",1],["km2","Square kilometers (km²)",1000000],["ha","Hectares (ha)",10000],["acre","Acres",4046.8564224],["ft2","Square feet (ft²)",.09290304]],
volume:[["ml","Milliliters (mL)",.001],["l","Liters (L)",1],["m3","Cubic meters (m³)",1000],["tsp","US teaspoons",.00492892159375],["tbsp","US tablespoons",.01478676478125],["cup","US cups",.2365882365],["gal","US gallons",3.785411784]],
speed:[["ms","Meters per second (m/s)",1],["kmh","Kilometers per hour (km/h)",1/3.6],["mph","Miles per hour (mph)",.44704],["knot","Knots (kn)",.514444444444]],
temperature:[["C","Celsius (°C)"],["F","Fahrenheit (°F)"],["K","Kelvin (K)"]]};
const SYMBOL={mm:"mm",cm:"cm",m:"m",km:"km",in:"in",ft:"ft",yd:"yd",mi:"mi",ms:"ms",s:"s",min:"min",hr:"hr",day:"days",wk:"weeks",mg:"mg",g:"g",kg:"kg",tonne:"t",oz:"oz",lb:"lb",mm2:"mm²",cm2:"cm²",m2:"m²",km2:"km²",ha:"ha",acre:"acres",ft2:"ft²",ml:"mL",l:"L",m3:"m³",tsp:"tsp",tbsp:"tbsp",cup:"cups",gal:"US gal",kmh:"km/h",mph:"mph",knot:"kn",C:"°C",F:"°F",K:"K"};
const $=id=>document.getElementById(id),cat=$("category"),a=$("a"),b=$("b"),ua=$("ua"),ub=$("ub"),out=$("out"),op=$("op");
const fmt=new Intl.NumberFormat(undefined,{maximumFractionDigits:8});
function list(){return DATA[cat.value]}function get(id){return list().find(u=>u[0]===id)}
function fill(sel,chosen){sel.innerHTML="";list().forEach(u=>{let o=document.createElement("option");o.value=u[0];o.textContent=u[1];sel.appendChild(o)});if(chosen&&list().some(u=>u[0]===chosen))sel.value=chosen}
function base(v,u){if(cat.value==="temperature")return u==="C"?v:u==="F"?(v-32)*5/9:v-273.15;return v*get(u)[2]}
function from(v,u){if(cat.value==="temperature")return u==="C"?v:u==="F"?v*9/5+32:v+273.15;return v/get(u)[2]}
function show(val,unit,caption,detail){$("answer").innerHTML=val+(unit?` <small>${unit}</small>`:"");$("caption").textContent=caption;$("equivalent").textContent=detail}
function update(){
 let err=$("error");err.textContent="";
 $("hint").textContent=(op.value==="+"||op.value==="-")?"Addition and subtraction convert both values to a common base unit first.":"Multiplication and division use the entered numeric values; the chosen output unit labels the result.";
 if(a.value.trim()===""||b.value.trim()===""){show("—","","Enter both values","");return}
 let x=Number(a.value),y=Number(b.value);if(!Number.isFinite(x)||!Number.isFinite(y)){show("—","","Enter valid numbers","");return}
 if(op.value==="/"&&y===0){show("—","","Division by zero is undefined","");err.textContent="You cannot divide by zero.";return}
 let result,caption=`${fmt.format(x)} ${SYMBOL[ua.value]} ${op.value==="-"?"−":op.value==="*"?"×":op.value==="/ "?"÷":op.value} ${fmt.format(y)} ${SYMBOL[ub.value]}`;
 if(cat.value==="temperature"){
   if(op.value==="+"||op.value==="*"||op.value==="/"){show("—","","Unsupported temperature operation","Use subtraction to calculate a temperature difference, or choose another category.");err.textContent="Temperature values cannot be added, multiplied, or divided in this calculator.";return}
   const delta=base(x,ua.value)-base(y,ub.value);result=out.value==="F"?delta*9/5:delta;
   show(fmt.format(result),SYMBOL[out.value],caption,`Temperature difference in ${SYMBOL[out.value]}`);return;
 }
 if(op.value==="+"||op.value==="-"){result=from(op.value==="+"?base(x,ua.value)+base(y,ub.value):base(x,ua.value)-base(y,ub.value),out.value)}
 else result=op.value==="*"?x*y:x/y;
 if(!Number.isFinite(result)){show("—","","Result is not finite","Check your values and operation.");err.textContent="This calculation cannot produce a finite result.";return}
 let baseResult=cat.value==="temperature"?result:result*get(out.value)[2];
 let baseName={length:"meters",time:"seconds",mass:"kilograms",area:"square meters",volume:"liters",speed:"meters per second"}[cat.value];
 show(fmt.format(result),SYMBOL[out.value],caption,`Equivalent to ${fmt.format(baseResult)} ${baseName}`);
}
function set(catVal,av,au,operation,bv,bu,ov){cat.value=catVal;fill(ua,au);fill(ub,bu);fill(out,ov);a.value=av;b.value=bv;op.value=operation;update()}
cat.addEventListener("change",()=>{fill(ua);fill(ub);fill(out);update()});
[a,b,ua,ub,out,op].forEach(el=>{el.addEventListener("input",update);el.addEventListener("change",update)});
$("clear").addEventListener("click",()=>{a.value="";b.value="";update();a.focus()});
document.querySelectorAll("[data-preset]").forEach(btn=>btn.addEventListener("click",()=>{let p=btn.dataset.preset;if(p==="length")set("length",2,"km","+",500,"m","km");if(p==="time")set("time",1,"hr","+",45,"min","min");if(p==="mass")set("mass",2,"kg","+",750,"g","kg");if(p==="temperature")set("temperature",25,"C","-",25,"C","F")}));
fill(ua,"km");fill(ub,"m");fill(out,"km");update();