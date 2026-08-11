const xhr = new XMLHttpRequest(); // 통신 모듈 사용

xhr.open("GET","/api/list"); // 통신 방식 설정

xhr.addEventListener("load",function(){
   const res = (JSON.parse(this.responseText));
   let html = ``;
   for (const i in res.result){
       html += `<tr>`;
       html += `<td>`+res.result[i].id+`</td>`;
       html += `<td>`+res.result[i].name+`</td>`;
       html += `<td>`+res.result[i].age+`</td>`;
       html += `</tr>`;
   }
   document.querySelector(".table > tbody").innerHTML = html;
});

xhr.send();