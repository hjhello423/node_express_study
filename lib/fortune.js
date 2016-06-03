
var fortuneCookies = [
	"Conquer your fears or they will conquer you.",
	"Rivers need springs.",
	"Do not fear what you don't know.",
	"You will have a pleasant surprise.",
	"Whenever possible, keep it simple.",
];

exports.getFortune = function(){ //전역변수 exports 선언
	var idx = Math.floor(Math.random() * fortuneCookies.length);
	return fortuneCookies[idx];
}