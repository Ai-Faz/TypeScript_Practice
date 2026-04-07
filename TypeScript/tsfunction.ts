//A function is a block of code that performs a task.

//******************1.Basic Function**********************

function greet1(name: string): string {
  return "Hello " + name;
}

greet1("Aifaz");

//👉 name: string → parameter type
//👉 : string → return type
//*********************************************************

//*****************2.Arrow Function ***********************

const add = (a: number, b: number): number => {
  return a + b;
};

////*****************3.Void Function (No Return) *********
function logMessage(msg: string): void {
  console.log(msg);
}

////*****************4.Optional Parameters ************** ?:
function greet2(name: string, age?: number) {
  console.log(name, age);
}
greet2("Aifaz"); // age optiona

//*****************5.Default Parameters *****************
function greet3(name: string = "Guest") {
  console.log(name);
}

greet3(); // Guest

//*****************6.Function with Object *****************
function userInfo0(user: { name: string; age: number }) {
  console.log(user.name);
}

//👉 Better way (using type):

type User = {
  name: string;
  age: number;
};

function userInfo1(user: User) {
  console.log(user.name);
}

//*****************7.Function Type (Signature) *****************
let multiply: (a: number, b: number) => number;

multiply = (x, y) => x * y;

////*****************8.Union in Function *****************
function printId(id: string | number) {
  console.log(id);
}

//////***************** 9.Callback Function*****************

function process(value: number, callback: (n: number) => number) {
  return callback(value);
}

process(5, (n) => n * 2);

///***************** 10.Async Function (Important) *****************
async function fetchData(): Promise<string> {
  return "Data loaded";
}

//👉 Used in APIs / backend

// *******************************************Examples Here **************************************//S

function disp_details (id:number,name:string,mail_id?:string)
{
console.log("ID",id)
console.log("Name",name)
if(mail_id!=undefined)
    console.log("Email_ID",mail_id)
}

disp_details(23,'Aifaz');


// REST Parameters 

function addNumber(...nums:number[]){
    var i;
    var sum: number=0;

    for(i=0;i<nums.length;i++){
        sum=sum+nums[i];
    }
    console.log("sum of Number is :",sum);
}
addNumber(1,2,3,4)

// Default Parameters 

function calculate_discount(price:number,rate:number = 0.50){
    var discount = price * rate;
    console.log('discount Amount : ',discount)
}
calculate_discount(1000)
calculate_discount(1000,0.30)