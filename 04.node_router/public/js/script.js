function chgData(obj1,obj2) {
	document.querySelector("#id").value = obj1;
	document.querySelector("#username").value = obj2;
}

function revData(obj1) {
	if(confirm("정말로 삭제하시겠습니까?")) {
		document.querySelector("#rev-id").value = obj1;
		document.querySelector("#revForm").submit();
	}
}