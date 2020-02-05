/* INIT BLOCK */
const URL="https://api.myjson.com/bins/jcmhn";

let text_template;
let mapKeys=new Map();

$(document).ready(function(){
	getData();
})

/* GET DATA AND RENDER BLOCK */
function getData(){
	$.getJSON(URL)		
			.done(function(data){
				render(data);
				createForm();
			})
			.fail(function(jqxhr, textStatus, error){
				displayError();
				console.log(error);
			});
}

function render(data){
	// store object in global variables 
	text_template=data;
	//create map with internal keys
	for(let item in data.text){
		let arrKeys=data.text[item].match(/[{]\w+[}]/g);
		arrKeys.forEach(key=>mapKeys.set(killBrackets(key),""));
	}
}

function killBrackets(str){
	return str.substring(1,str.length-1);
}

function addBrackets(str){
	return `{${str}}`;
}

/* CREATE FORM AND STORY BLOCKS FUNCTIONS*/
function createForm(){
	//create inputs 
	for(let key of mapKeys.keys()){
		createInputELement(key);
	}
	//create button
	createButton();

}
function createInputELement(str){
	let strInputElemTemplate=`<div><input type="text" name="${str}" placeholder="${str}"></div>`;
	$("form").append(strInputElemTemplate);
}
function createButton(){
	let strButton=`<div><button type="button">Создать</button></div>`;
	$("form").append(strButton);
	$("form button").click(createStory);
}

function createStory(){
	//add new data to the map
	parseForm();
	displayStory();
}
function parseForm(){
	$("input").each(function(){
		mapKeys.set(this.name, this.value)
	});
}

function displayStory(){
	let str="";
	//create html template
	for(let item in text_template.text){
		str+=`<div>${text_template.text[item]}</div>`;
	}

	//replace data in html
	mapKeys.forEach((value, key, map) => {
		let regex=new RegExp(addBrackets(key),'g');
		str=str.replace(regex, value);
	})
	
	addHtmlToResultBlock(str);
}

function displayError(error){
	addHtmlToResultBlock(`Story will be tommorow.`);
}

function addHtmlToResultBlock(textHtml){
	$("#result").empty();
	$("#result").append(textHtml);
}



