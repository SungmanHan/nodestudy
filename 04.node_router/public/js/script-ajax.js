// axios use
const getData = () => {
	/*axios.get("/api").then(function(res) {
		console.log("==========================")
		console.log(res)
		console.log("==========================")
		let html = '';
		let datas = res.data;
		for (const i in datas) {
			html += '<div class="p-2 d-flex align-items-center rounded border m-2">';
			html += '<span class="mr-2 user-id">'+datas[i].id+'</span>';
			html += '<span class="mr-3 user-name">'+datas[i].username+'</span>';
			html += '<div>';
			html += '<button class="btn btn-success btn-sm" onclick="chgData(\''+datas[i].id+"_"+datas[i].username+'\');">수정</button>';
			html += '<button class="btn btn-danger btn-sm" onclick="revData('+datas[i].id+');">삭제</button>';
			html += '</div>';
			html += '</div>';
		}
		document.querySelector(".list-wrap").innerHTML = html;
	});*/
	axios.get("/seq").then(function(res){
		let html = '';
		for (const i in res.data) {
			html += '<div class="p-2 d-flex align-items-center rounded border m-2">';
			html += '<span class="mr-2 user-id">'+res.data[i].id+'</span>';
			html += '<span class="mr-3 user-name">'+res.data[i].username+'</span>';
			html += '<div>';
			html += '<button class="btn btn-success btn-sm" onclick="chgData(\''+res.data[i].id+"_"+res.data[i].username+'\');">수정</button>';
			html += '<button class="btn btn-danger btn-sm" onclick="revData('+res.data[i].id+');">삭제</button>';
			html += '</div>';
			html += '</div>';
		}
		document.querySelector(".list-wrap").innerHTML = html;
	});
}

const revData = (id) => {
	const data = {id:id};
	if (confirm("정말로 삭제하시겠습니까?")) {

		//axios.delete("/api",{data:{id:id}
		axios.delete("/seq",{data:{id:id}
		}).then((res) => {
			if(res.status == 200){
				getData();
			}
		}).catch((err) => {
			console.log(err)
		});
	}else{
		alert("삭제 취소!");
	}
}

const sendData = (f) => {
	if(f.username.value.trim() === ""){
		alert("이름을 입력하세요.");
		f.username.focus();
		return false;
	}
	console.log("-------------------------------------")
	console.log(f.username.value)
	console.log("-------------------------------------")
	//axios.post("/api", {
	axios.post("/seq", {
		username : f.username.value
	}).then((res) => {
		//console.log(res)
		if(res.status == 200) {
			document.wrForm.username.value="";
			getData();
		}
	}).catch((err) => {
		console.log(err)
	});
}

const modifyData = (f) => {
	if(f.id.value.trim() === ""){
		alert("수정할 데이터를 선택하세요.");
		return false;
	}
	if(f.username.value.trim() === ""){
		alert("이름을 입력하세요.");
		f.username.focus();
		return false;
	}
	//axios.put("/api", {
	axios.put("/seq", {
		id : Number(f.id.value),
		username : f.username.value
	}).then((res) => {
		console.log(res)
		if(res.status == 200){
			document.upForm.id.value="";
			document.upForm.username.value="";
			getData();
		}
	}).catch((err) => {
		console.log(err)
	});
}

const chgData = (f) => {
	const tempData = f.split("_");
	document.getElementById("id").value=tempData[0];
	document.getElementById("username").value=tempData[1];
}

getData();


/* 기존 ajax 바닐라스크립트 작성법

axios.post();
axios.put();

const xhr = new XMLHttpRequest();
function getData() {
 	xhr.open("get", "/api");
 	xhr.send();
}
getData();

// var json = JSON.stringfy(JS OBject[객체])
// var obj = JSON.parse(JSON[문자열])


xhr.addEventListener("load", function(){
	let html = '';
	const datas = JSON.parse(this.responseText);
	for (const i in datas) {
		html += '<div class="p-2 d-flex align-items-center rounded border m-2">';
		html += '<span class="mr-2 user-id">'+datas[i].id+'</span>';
		html += '<span class="mr-3 user-name">'+datas[i].username+'</span>';
		html += '<div>';
		html += '<button class="btn btn-success btn-sm" onclick="chgData(this);">수정</button>';
		html += '<button class="btn btn-danger btn-sm" onclick="revData(this);">삭제</button>';
		html += '</div>';
		html += '</div>';
	}
	document.querySelector(".list-wrap").innerHTML = html;
});
*/