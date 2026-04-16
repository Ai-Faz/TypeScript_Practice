interface Ipersone{
    firstname:string,
    lastname:string,
    sayHi:()=>string
}

var customer: Ipersone= 
{
    firstname:"Aifaz",
    lastname:"mohammad",
    sayHi:():string=>{return "Hi There"}
}


console.log(customer.firstname)


console.log(customer.lastname)

console.log(customer.sayHi())