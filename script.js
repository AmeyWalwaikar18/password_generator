const inputSlider=document.querySelector("[data-lengthSlider]");
const uppercase=document.querySelector("#uppercase");
const lowercase=document.querySelector("#lowercase");
const numbers=document.querySelector("#numbers");
const symbols=document.querySelector("#symbols");
const passwordDisplay=document.querySelector("[data-password]");
const copymessage=document.querySelector("[data-copymsg]");
const copybutton=document.querySelector("[data-copy]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input [type=checkbox]");
const symbols_list = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password="";
let passwordLength=10;
let checkCount=1;
handleSlider();
//set strength circle also

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.textContent=passwordLength;
    //something more is needed, we'll find it out later
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow also needs to be given
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols_list.length);
    return symbols_list.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercase.checked) hasUpper=true;
    if(lowercase.checked) hasLower=true;
    if(numbers.checked) hasNum=true;
    if(symbols.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        (passwordLength >= 6 &&passwordLength<8)
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymessage.innerText = "Copied";
    }
    catch(e){
        copymessage.innerText = "Failed";
    }

    //to make copy wala span visible
    copymessage.classList.add("active");

    setTimeout( () => {
        copymessage.classList.remove("active");
    },2000);
    console.log('hello');
}

//checkCount waala function
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked)
        checkCount++;
    });
}

//edge condition check if passwordLength<checkCount
if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
}

//whenever a checkbox's status is changed we use this function
allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input',(event)=>{
    passwordLength=event.target.value;
    handleSlider();
});

copybutton.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function shufflePassword(array){
    //Fisher Yates method for random shuffling
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[j];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((element)=>(str+=element));
    return str;
}
generateBtn.addEventListener('click',()=>{
    if(checkCount==0)
    return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //let's start the journey to find the new password
    password="";

    //lets put the stuff mentioned by the checkboxes
    // if(uppercase.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercase.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbers.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbols.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];

    if(uppercase.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercase.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbers.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbols.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    //now we also need to shuffle the password
    //sending password in the form of array
    password=shufflePassword(Array.from(password));

    passwordDisplay.value=password;
    calcStrength();
});
