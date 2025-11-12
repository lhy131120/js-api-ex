import{g,a as c}from"./main-992gdY_p.js";const i="https://livejs-api.hexschool.io/api/livejs/v1",l="jsweek9api";let d=[];const p="1yHPMFbDY6Wb1mQaaZnTPsRgGyM2",u=async()=>{try{if(!document.querySelector("#orderList"))return;d=[...(await c.get(`${i}/admin/${l}/orders`,{headers:{Authorization:p}})).data.orders];let o="";if(d.forEach(t=>{const a=t.createdAt,s=new Date(a*1e3);o+=`<tr class="align-top">
										<td>${t.id}</td>
										<td>
											<p>${t.user.name}</p>
											<p>${t.user.tel}</p>
										</td>
										<td>${t.user.address}</td>
										<td>${t.user.email}</td>
										<td>
                      ${t.products.map(r=>`<p>${r.title}</p>`).join("")}
                    </td>
										<td>${s.getFullYear()}/${s.getMonth()+1}/${s.getDate()}</td>
										<td><a class="orderStatus text-nowrap" href="javascript:;"  data-orderId="${t.id}" data-paid="${t.paid}">${t.paid==!0?'<span class="text-blue-500">己處理</span>':'<span class="text-amber-500">未處理</span>'}</a></td>
										<td>
											<button type="button" data-orderId="${t.id}" class="deleteOrder cursor-pointer bg-alert hover:bg-primary-400 px-3 py-1 rounded-sm text-center text-white text-nowrap transition-all duration-300 ease-in-out"> 
												刪除
											</button>
										</td>
									</tr>`}),document.querySelector("#orderList").innerHTML=o,d.length==0&&document.querySelector("#orderList")){document.querySelector("#orderList").innerHTML='<tr><td colspan="8" class="text-center py-4 text-2xl">沒有訂單</td></tr>';return}document.querySelectorAll(".orderStatus").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const r=t.getAttribute("data-paid")==="true",n=t.getAttribute("data-orderId");b(r,n)})}),document.querySelectorAll(".deleteOrder").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const s=t.getAttribute("data-orderId");v(s)})}),A(),$()}catch(e){console.log(e.response?.data?.message||e)}},$=()=>{const e=d.reduce((r,n)=>(n.products.forEach(m=>{const y=m.quantity;r[m.title]=(r[m.title]||0)+y}),r),{}),o=Object.entries(e).sort(([,r],[,n])=>n-r),t=o.slice(0,3),a=o.slice(3).reduce((r,[,n])=>r+n,0),s=[...t.map(([r,n])=>[r,n]),...a>0?[["其他",a]]:[]];c3.generate({bindto:"#chart-itemsRank",data:{columns:s,type:"pie"},color:{pattern:["#C78283","#F3D9DC","#D7BEA8","#B49286"]}})},A=()=>{const e=d.reduce((t,a)=>(a.products.forEach(s=>{const r=s.price*s.quantity;t[s.category]=(t[s.category]||0)+r}),t),{}),o=Object.entries(e).map(([t,a])=>[t,a]);c3.generate({bindto:"#chart-type",data:{type:"pie",columns:o},color:{pattern:["#5434A7","#9D7FEA","#DACBFF"]}})},b=async(e,o)=>{try{const a={data:{id:o,paid:!e}},s=await c.put(`${i}/admin/${l}/orders`,a,{headers:{Authorization:p}});u()}catch(t){console.log(t.response?.data?.message||t)}},v=async e=>{try{await c.delete(`${i}/admin/${l}/orders/${e}`,{headers:{Authorization:p}}),u()}catch(o){console.log(o.response?.data?.message||o)}},O=()=>{const e=document.querySelector("#removeAllOrder");e&&(e.removeEventListener("click",h),e.addEventListener("click",h))},h=async()=>{try{await c.delete(`${i}/admin/${l}/orders`,{headers:{Authorization:p}}),u()}catch(e){console.log(e.response?.data?.message||e)}};document.addEventListener("DOMContentLoaded",()=>{g(),u(),O()});
