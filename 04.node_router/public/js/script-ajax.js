// axios use
const getData = () => {
	axios.get("/api").then(function(res) {
		var html = '';
		var datas = res.data;
		for(var i in datas) {
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
	});
}



const revData = (id) => {
	var data = {id:id};
	if (confirm("정말로 삭제하시겠습니까?")) {
		axios.delete("/api/",{data:{id:id}
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
	axios.post("/api", {
		username : f.username.value
	}).then((res) => {
		if(res.status == 200){
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
	axios.put("/api", {
		id : Number(f.id.value),
		username : f.username.value
	}).then((res) => {
		console.log(res)
		if(res.status == 200){
			getData();
		}
	}).catch((err) => {
		console.log(err)
	});
}

const chgData = (f) => {
	var tempData = f.split("_");
	document.getElementById("id").value=tempData[0];
	document.getElementById("username").value=tempData[1];
}

getData();


/* 기존 ajax 바닐라스크립트 작성법

axios.post();
axios.put();

var xhr = new XMLHttpRequest();
function getData() {
 	xhr.open("get", "/api");
 	xhr.send();
}
getData();

// var json = JSON.stringfy(JS OBject[객체])
// var obj = JSON.parse(JSON[문자열])


xhr.addEventListener("load", function(){
	var html = '';
	var datas = JSON.parse(this.responseText);
	for(var i in datas) {
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