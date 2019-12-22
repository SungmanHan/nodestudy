const Product = [
    {id:1,src:"./imags/cherries.jpg", title:"체리"},
    {id:2,src:"./imags/sandwich.jpg", title:"센드워치"},
    {id:3,src:"./imags/steak.jpg", title:"스테이크"},
    {id:4,src:"./imags/wine.jpg", title:"와인"},
]

new Vue({
    el: "#app",
    data: {
        query: "",
        prds:[],
        results:false,
    },
    method:{
        queryRev(e){
            this.query="";
        },
        onSubmit(e){
            this.prds=Product;
        }
    }
});