function chgData(obj1,obj2) {
	document.querySelector("#id").value = obj1;
	document.querySelector("#username").value = obj2;
}

function revData(elem) {
	var id = elem.parentNode.parentNode.querySelector(".user-id").innerHTML;
	if(confirm("정말로 삭제하시겠습니까?")) {
		document.querySelector("#rev-id").value = id;
		document.querySelector("#revForm").submit();
	}
}