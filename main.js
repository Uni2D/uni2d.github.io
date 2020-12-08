//SVG Official Namespace Library
var SVG_NS = "http://www.w3.org/2000/svg";

//Global Variables
var offsetX = Math.round(document.getElementById("drawArea").getBoundingClientRect().x);
var offsetY = Math.round(document.getElementById("drawArea").getBoundingClientRect().y);
var mouseEvents =
{
	clickX: -1,
	clickY: -1,
	mouseX: -1,
	mouseY: -1,
	activeTool: "NONE",
	clickFlag: false
};

//Menu Functions
function menuFileNew()
{
	if(confirm("Are you sure you want to start a new document?\n(All unsaved progress will be lost.)"))
	{
		document.getElementById("drawArea").innerHTML = "";
	}
}

function menuFileOpen()
{
	var fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.accept = ".u2d";
	
	fileInput.onchange = function(e)
	{
		var fileObj = e.target.files[0];
		var fileReader = new FileReader();
		fileReader.readAsText(fileObj, "UTF-8");
		fileReader.onload = function(readerEvent)
		{
			document.getElementById("drawArea").innerHTML = decodeURIComponent(readerEvent.target.result);
		}
	}
	
	fileInput.click();
}

function menuFileSave()
{
	var fileObj = document.createElement("a");
	var fileName = new Date().toISOString().replace(/[^0-9]/g, "");
	fileObj.download = fileName + ".u2d";
	fileObj.href = "data:text/plain," + encodeURIComponent(document.getElementById("drawArea").innerHTML);
	fileObj.click();
}

function menuEditCopy()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "T_COPY";
	}
}

function menuEditDelete()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "T_DELETE";
	}
}

function menuEditMove()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "T_MOVE";
	}
}

function menuEditRotate()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "T_ROTATE";
	}
}

function menuEditScale()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "T_SCALE";
	}
}

function menuCreateLine()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "S_LINE";
	}
}

function menuCreateCircle()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "S_CIRCLE";
	}
}

function menuCreateEllipse()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "S_ELLIPSE";
	}
}

function menuCreateRectangle()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "S_RECTANGLE";
	}
}

function menuCreatePolygon()
{
	if(mouseEvents.activeTool == "IN_USE")
	{
		alert("You're already using another tool!");
	}
	else
	{
		mouseEvents.activeTool = "S_POLYGON";
	}
}

function menuHelpManual()
{
	alert("User Manual:\n\nJust click on random stuff until you get the hang of it.");
}

function menuHelpAbout()
{
	alert("Uni2D\n\nComputer Graphics Coursework\n\nAll rights reserved.");
}

//Sidebar Functions
function sideButtonMove()
{
	menuEditMove();
}

function sideButtonRotate()
{
	menuEditRotate();
}

function sideButtonScale()
{
	menuEditScale();
}

function sideSliderInput()
{
	var colorRGB = new ColorRGB(0, 0, 0);
	colorRGB.r = document.getElementById("colorSliderRed").value;
	colorRGB.g = document.getElementById("colorSliderGreen").value;
	colorRGB.b = document.getElementById("colorSliderBlue").value;
	document.getElementById("colorPicker").value = RGBToHex(colorRGB.r, colorRGB.g, colorRGB.b);
}

function sidePickerInput()
{
	var colorObj = new ColorRGB(0, 0, 0);
	var colorStr = document.getElementById("colorPicker").value;
	HexToRGB(colorStr, colorObj);
	document.getElementById("colorSliderRed").value = colorObj.r;
	document.getElementById("colorSliderGreen").value = colorObj.g;
	document.getElementById("colorSliderBlue").value = colorObj.b;
}

//Draw Area Functions
function drawAreaClick(event)
{
	offsetX = Math.round(document.getElementById("drawArea").getBoundingClientRect().x);
	offsetY = Math.round(document.getElementById("drawArea").getBoundingClientRect().y);
	mouseEvents.clickX = event.clientX - offsetX;
	mouseEvents.clickY = event.clientY - offsetY;
	mouseEvents.clickFlag = true;
	
	switch(mouseEvents.activeTool)
	{
		case "T_COPY":
			copyTool();
			break;
		case "T_DELETE":
			deleteTool();
			break;
		case "T_MOVE":
			moveTool();
			break;
		case "T_ROTATE":
			rotateTool();
			break;
		case "T_SCALE":
			scaleTool();
			break;
		case "S_LINE":
			buildLine();
			break;
		case "S_CIRCLE":
			buildCircle();
			break;
		case "S_ELLIPSE":
			buildEllipse();
			break;
		case "S_RECTANGLE":
			buildRectangle();
			break;
		case "S_POLYGON":
			buildPolygon();
			break;
		case "NONE":
		case "IN_USE":
		default:
	}
}

function drawAreaMove(event)
{
	mouseEvents.mouseX = event.clientX - offsetX;
	mouseEvents.mouseY = event.clientY - offsetY;
}

function getObjectAt(coordX, coordY)
{
	var targetObj;
	var targetDist = Number.MAX_SAFE_INTEGER;
	var checkObj = document.elementFromPoint((coordX + offsetX), (coordY + offsetY));
	var svgObjects = document.getElementById("drawArea").childNodes;
	for(var i = svgObjects.length - 1; i>=0; i--)
	{
		var minX = Math.floor(svgObjects[i].getBoundingClientRect().x) - offsetX;
		var maxX = minX + Math.ceil(svgObjects[i].getBoundingClientRect().width);
		var minY = Math.floor(svgObjects[i].getBoundingClientRect().y) - offsetY;
		var maxY = minY + Math.ceil(svgObjects[i].getBoundingClientRect().height);
		
		if((coordX >= minX) && (coordX <= maxX) && (coordY >= minY) && (coordY <= maxY))
		{
			if(svgObjects[i] == checkObj)
			{
				targetObj = svgObjects[i];
				i = -1;
			}
			else
			{
				var currentDist = Math.hypot((coordX - (minX + maxX)/2), (coordY - (minY + maxY)/2));
				if(currentDist < targetDist)
				{
					targetDist = currentDist;
					targetObj = svgObjects[i];
				}
			}
		}
	}
	
	if(targetObj)
	{
		document.getElementById("drawArea").removeChild(targetObj);
		document.getElementById("drawArea").appendChild(targetObj);
	}
	
	return targetObj;
}

//Tool Functions
async function copyTool()
{
	mouseEvents.activeTool = "IN_USE";
	
	var copyObj = getObjectAt(mouseEvents.clickX, mouseEvents.clickY);
	
	if(copyObj)
	{
		var transObj = copyObj.cloneNode(true);
		document.getElementById("drawArea").appendChild(transObj);
		
		var transMatrix = new DOMMatrix();
		MatrixSVGToDOM(transObj.getCTM(), transMatrix);
		
		var objBoundBox = transObj.getBoundingClientRect();
		mouseEvents.clickFlag = false;
		var exitLoop = false;
		while(!exitLoop)
		{
			if(mouseEvents.clickFlag)
			{
				var originX = (2*objBoundBox.x + objBoundBox.width)/2 - offsetX;
				var originY = (2*objBoundBox.y + objBoundBox.height)/2 - offsetY;
				var moveX = mouseEvents.clickX - originX;
				var moveY = mouseEvents.clickY - originY;
				
				var moveMatrix = new DOMMatrix().translate(moveX, moveY, 0);
				var finalMatrix = moveMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				exitLoop = true;
			}
			else
			{
				var originX = (2*objBoundBox.x + objBoundBox.width)/2 - offsetX;
				var originY = (2*objBoundBox.y + objBoundBox.height)/2 - offsetY;
				var moveX = mouseEvents.mouseX - originX;
				var moveY = mouseEvents.mouseY - originY;
				
				var moveMatrix = new DOMMatrix().translate(moveX, moveY, 0);
				var finalMatrix = moveMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				await new Promise(ret => setTimeout(ret, 20));
			}
		}
	}
	
	mouseEvents.activeTool = "T_COPY";
}

async function deleteTool()
{
	mouseEvents.activeTool = "IN_USE";
	
	var deleteObj = getObjectAt(mouseEvents.clickX, mouseEvents.clickY);
	
	if(deleteObj)
		document.getElementById("drawArea").removeChild(deleteObj);
	
	mouseEvents.activeTool = "T_DELETE";
}

async function moveTool()
{
	mouseEvents.activeTool = "IN_USE";
	
	var transObj = getObjectAt(mouseEvents.clickX, mouseEvents.clickY);
	
	if(transObj)
	{
		var transMatrix = new DOMMatrix();
		MatrixSVGToDOM(transObj.getCTM(), transMatrix);
		
		var objBoundBox = transObj.getBoundingClientRect();
		mouseEvents.clickFlag = false;
		var exitLoop = false;
		while(!exitLoop)
		{
			if(mouseEvents.clickFlag)
			{
				var originX = (2*objBoundBox.x + objBoundBox.width)/2 - offsetX;
				var originY = (2*objBoundBox.y + objBoundBox.height)/2 - offsetY;
				var moveX = mouseEvents.clickX - originX;
				var moveY = mouseEvents.clickY - originY;
				
				var moveMatrix = new DOMMatrix().translate(moveX, moveY, 0);
				var finalMatrix = moveMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				exitLoop = true;
			}
			else
			{
				var originX = (2*objBoundBox.x + objBoundBox.width)/2 - offsetX;
				var originY = (2*objBoundBox.y + objBoundBox.height)/2 - offsetY;
				var moveX = mouseEvents.mouseX - originX;
				var moveY = mouseEvents.mouseY - originY;
				
				var moveMatrix = new DOMMatrix().translate(moveX, moveY, 0);
				var finalMatrix = moveMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				await new Promise(ret => setTimeout(ret, 20));
			}
		}
	}
	
	mouseEvents.activeTool = "T_MOVE";
}

async function rotateTool()
{
	mouseEvents.activeTool = "IN_USE";
	
	var transObj = getObjectAt(mouseEvents.clickX, mouseEvents.clickY);
	
	if(transObj)
	{
		var transMatrix = new DOMMatrix();
		MatrixSVGToDOM(transObj.getCTM(), transMatrix);
		
		var objBoundBox = transObj.getBoundingClientRect();
		mouseEvents.clickFlag = false;
		var exitLoop = false;
		while(!exitLoop)
		{
			if(mouseEvents.clickFlag)
			{
				var originX = (2*objBoundBox.x + objBoundBox.width)/2 - offsetX;
				var originY = (2*objBoundBox.y + objBoundBox.height)/2 - offsetY;
				var rotateX = mouseEvents.clickX - originX;
				var rotateY = mouseEvents.clickY - originY;
				
				var rotateMatrix = new DOMMatrix().translate(originX, originY).rotateFromVector(rotateX, rotateY).translate(-originX, -originY);
				var finalMatrix = rotateMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				exitLoop = true;
			}
			else
			{
				var originX = (2*objBoundBox.x + objBoundBox.width)/2 - offsetX;
				var originY = (2*objBoundBox.y + objBoundBox.height)/2 - offsetY;
				var rotateX = mouseEvents.mouseX - originX;
				var rotateY = mouseEvents.mouseY - originY;
				
				var rotateMatrix = new DOMMatrix().translate(originX, originY).rotateFromVector(rotateX, rotateY).translate(-originX, -originY);
				var finalMatrix = rotateMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				await new Promise(ret => setTimeout(ret, 20));
			}
		}
	}
	
	mouseEvents.activeTool = "T_ROTATE";
}

async function scaleTool()
{
	mouseEvents.activeTool = "IN_USE";
	
	var transObj = getObjectAt(mouseEvents.clickX, mouseEvents.clickY);
	
	if(transObj)
	{
		var transMatrix = new DOMMatrix();
		MatrixSVGToDOM(transObj.getCTM(), transMatrix);
		
		var objBoundBox = transObj.getBoundingClientRect();
		mouseEvents.clickFlag = false;
		var exitLoop = false;
		while(!exitLoop)
		{
			if(mouseEvents.clickFlag)
			{
				var originX = objBoundBox.x - offsetX;
				var originY = objBoundBox.y - offsetY;
				var scaleX = (mouseEvents.clickX - originX)/RepLessOne(objBoundBox.width, 1);
				var scaleY = (mouseEvents.clickY - originY)/RepLessOne(objBoundBox.height, 1);
				
				var scaleMatrix = new DOMMatrix().scale(scaleX, scaleY, 1, originX, originY, 0);
				var finalMatrix = scaleMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				exitLoop = true;
			}
			else
			{
				var originX = objBoundBox.x - offsetX;
				var originY = objBoundBox.y - offsetY;
				var scaleX = (mouseEvents.mouseX - originX)/RepLessOne(objBoundBox.width, 1);
				var scaleY = (mouseEvents.mouseY - originY)/RepLessOne(objBoundBox.height, 1);
				
				var scaleMatrix = new DOMMatrix().scale(scaleX, scaleY, 1, originX, originY, 0);
				var finalMatrix = scaleMatrix.multiply(transMatrix);
				transObj.setAttributeNS(null, "transform", finalMatrix.toString());
				
				await new Promise(ret => setTimeout(ret, 20));
			}
		}
	}
	
	mouseEvents.activeTool = "T_SCALE";
}

//Primitive Functions
async function buildLine()
{
	mouseEvents.activeTool = "IN_USE";
	
	var buildObj = document.createElementNS(SVG_NS, "line");
	buildObj.setAttributeNS(null, "x1", mouseEvents.clickX);
	buildObj.setAttributeNS(null, "y1", mouseEvents.clickY);
	buildObj.setAttributeNS(null, "x2", mouseEvents.clickX);
	buildObj.setAttributeNS(null, "y2", mouseEvents.clickY);
	buildObj.setAttributeNS(null, "stroke", document.getElementById("colorPicker").value);
	buildObj.setAttributeNS(null, "stroke-width", document.getElementById("borderWidth").value);
	document.getElementById("drawArea").appendChild(buildObj);
	
	mouseEvents.clickFlag = false;
	var exitLoop = false;
	while(!exitLoop)
	{
		if(mouseEvents.clickFlag)
		{
			buildObj.setAttributeNS(null, "x2", mouseEvents.clickX);
			buildObj.setAttributeNS(null, "y2", mouseEvents.clickY);
			
			exitLoop = true;
		}
		else
		{
			buildObj.setAttributeNS(null, "x2", mouseEvents.mouseX);
			buildObj.setAttributeNS(null, "y2", mouseEvents.mouseY);
			
			await new Promise(ret => setTimeout(ret, 20));
		}
	}
	
	mouseEvents.activeTool = "S_LINE";
}

async function buildCircle()
{
	mouseEvents.activeTool = "IN_USE";
	
	var buildObj = document.createElementNS(SVG_NS, "circle");
	buildObj.setAttributeNS(null, "cx", mouseEvents.clickX);
	buildObj.setAttributeNS(null, "cy", mouseEvents.clickY);
	buildObj.setAttributeNS(null, "r", 1);
	buildObj.setAttributeNS(null, "fill", document.getElementById("colorPicker").value);
	buildObj.setAttributeNS(null, "stroke", document.getElementById("borderColor").value);
	buildObj.setAttributeNS(null, "stroke-width", document.getElementById("borderWidth").value);
	document.getElementById("drawArea").appendChild(buildObj);
	
	var centerX = mouseEvents.clickX;
	var centerY = mouseEvents.clickY;
	
	mouseEvents.clickFlag = false;
	var exitLoop = false;
	while(!exitLoop)
	{
		if(mouseEvents.clickFlag)
		{
			buildObj.setAttributeNS(null, "r", Math.round(Math.hypot((mouseEvents.clickX - centerX), (mouseEvents.clickY - centerY))));
			
			exitLoop = true;
		}
		else
		{
			buildObj.setAttributeNS(null, "r", Math.round(Math.hypot((mouseEvents.mouseX - centerX), (mouseEvents.mouseY - centerY))));
			
			await new Promise(ret => setTimeout(ret, 20));
		}
	}
	
	mouseEvents.activeTool = "S_CIRCLE";
}

async function buildEllipse()
{
	mouseEvents.activeTool = "IN_USE";
	
	var buildObj = document.createElementNS(SVG_NS, "ellipse");
	buildObj.setAttributeNS(null, "cx", mouseEvents.clickX);
	buildObj.setAttributeNS(null, "cy", mouseEvents.clickY);
	buildObj.setAttributeNS(null, "rx", 1);
	buildObj.setAttributeNS(null, "ry", 1);
	buildObj.setAttributeNS(null, "fill", document.getElementById("colorPicker").value);
	buildObj.setAttributeNS(null, "stroke", document.getElementById("borderColor").value);
	buildObj.setAttributeNS(null, "stroke-width", document.getElementById("borderWidth").value);
	document.getElementById("drawArea").appendChild(buildObj);
	
	var centerX = mouseEvents.clickX;
	var centerY = mouseEvents.clickY;
	
	mouseEvents.clickFlag = false;
	var exitLoop = false;
	while(!exitLoop)
	{
		if(mouseEvents.clickFlag)
		{
			buildObj.setAttributeNS(null, "rx", Math.abs(mouseEvents.clickX - centerX));
			buildObj.setAttributeNS(null, "ry", Math.abs(mouseEvents.clickY - centerY));
			
			exitLoop = true;
		}
		else
		{
			buildObj.setAttributeNS(null, "rx", Math.abs(mouseEvents.mouseX - centerX));
			buildObj.setAttributeNS(null, "ry", Math.abs(mouseEvents.mouseY - centerY));
			
			await new Promise(ret => setTimeout(ret, 20));
		}
	}
	
	mouseEvents.activeTool = "S_ELLIPSE";
}

async function buildRectangle()
{
	mouseEvents.activeTool = "IN_USE";
	
	var buildObj = document.createElementNS(SVG_NS, "rect");
	buildObj.setAttributeNS(null, "x", mouseEvents.clickX);
	buildObj.setAttributeNS(null, "y", mouseEvents.clickY);
	buildObj.setAttributeNS(null, "width", 1);
	buildObj.setAttributeNS(null, "height", 1);
	buildObj.setAttributeNS(null, "fill", document.getElementById("colorPicker").value);
	buildObj.setAttributeNS(null, "stroke", document.getElementById("borderColor").value);
	buildObj.setAttributeNS(null, "stroke-width", document.getElementById("borderWidth").value);
	document.getElementById("drawArea").appendChild(buildObj);
	
	var originX = mouseEvents.clickX;
	var originY = mouseEvents.clickY;
	
	mouseEvents.clickFlag = false;
	var exitLoop = false;
	while(!exitLoop)
	{
		if(mouseEvents.clickFlag)
		{
			if((mouseEvents.clickX - originX) < 0)
			{
				buildObj.setAttributeNS(null, "x", mouseEvents.clickX);
				buildObj.setAttributeNS(null, "width", (originX - mouseEvents.clickX));
			}
			else
			{
				buildObj.setAttributeNS(null, "x", originX);
				buildObj.setAttributeNS(null, "width", (mouseEvents.clickX - originX));
			}
			if((mouseEvents.clickY - originY) < 0)
			{
				buildObj.setAttributeNS(null, "y", mouseEvents.clickY);
				buildObj.setAttributeNS(null, "height", (originY - mouseEvents.clickY));
			}
			else
			{
				buildObj.setAttributeNS(null, "y", originY);
				buildObj.setAttributeNS(null, "height", (mouseEvents.clickY - originY));
			}
			
			exitLoop = true;
		}
		else
		{
			if((mouseEvents.mouseX - originX) < 0)
			{
				buildObj.setAttributeNS(null, "x", mouseEvents.mouseX);
				buildObj.setAttributeNS(null, "width", (originX - mouseEvents.mouseX));
			}
			else
			{
				buildObj.setAttributeNS(null, "x", originX);
				buildObj.setAttributeNS(null, "width", (mouseEvents.mouseX - originX));
			}
			if((mouseEvents.mouseY - originY) < 0)
			{
				buildObj.setAttributeNS(null, "y", mouseEvents.mouseY);
				buildObj.setAttributeNS(null, "height", (originY - mouseEvents.mouseY));
			}
			else
			{
				buildObj.setAttributeNS(null, "y", originY);
				buildObj.setAttributeNS(null, "height", (mouseEvents.mouseY - originY));
			}
			
			await new Promise(ret => setTimeout(ret, 20));
		}
	}
	
	mouseEvents.activeTool = "S_RECTANGLE";
}

async function buildPolygon()
{
	mouseEvents.activeTool = "IN_USE";
	
	var pointsList = (mouseEvents.clickX + "," + mouseEvents.clickY);
	
	var buildObj = document.createElementNS(SVG_NS, "polygon");
	buildObj.setAttributeNS(null, "points", pointsList);
	buildObj.setAttributeNS(null, "fill", document.getElementById("colorPicker").value);
	buildObj.setAttributeNS(null, "stroke", document.getElementById("borderColor").value);
	buildObj.setAttributeNS(null, "stroke-width", document.getElementById("borderWidth").value);
	document.getElementById("drawArea").appendChild(buildObj);
	
	var tempLineS = document.createElementNS(SVG_NS, "line");
	tempLineS.setAttributeNS(null, "x1", mouseEvents.clickX);
	tempLineS.setAttributeNS(null, "y1", mouseEvents.clickY);
	tempLineS.setAttributeNS(null, "x2", mouseEvents.clickX);
	tempLineS.setAttributeNS(null, "y2", mouseEvents.clickY);
	tempLineS.setAttributeNS(null, "stroke", document.getElementById("borderColor").value);
	tempLineS.setAttributeNS(null, "stroke-width", document.getElementById("borderWidth").value);
	document.getElementById("drawArea").appendChild(tempLineS);
	
	var tempLineE = document.createElementNS(SVG_NS, "line");
	tempLineE.setAttributeNS(null, "x1", mouseEvents.clickX);
	tempLineE.setAttributeNS(null, "y1", mouseEvents.clickY);
	tempLineE.setAttributeNS(null, "x2", mouseEvents.clickX);
	tempLineE.setAttributeNS(null, "y2", mouseEvents.clickY);
	tempLineE.setAttributeNS(null, "stroke", document.getElementById("borderColor").value);
	tempLineE.setAttributeNS(null, "stroke-width", document.getElementById("borderWidth").value);
	document.getElementById("drawArea").appendChild(tempLineE);
	
	var previousX = mouseEvents.clickX;
	var previousY = mouseEvents.clickY;
	
	mouseEvents.clickFlag = false;
	var exitLoop = false;
	while(!exitLoop)
	{
		if(mouseEvents.clickFlag)
		{
			if((mouseEvents.clickX == previousX) && (mouseEvents.clickY == previousY))
			{
				if(confirm("Complete the polygon?"))
					exitLoop = true;
				else
					mouseEvents.clickFlag = false;
			}
			else
			{
				pointsList += (" " + mouseEvents.clickX + "," + mouseEvents.clickY);
				buildObj.setAttributeNS(null, "points", pointsList);
				tempLineE.setAttributeNS(null, "x1", mouseEvents.clickX);
				tempLineE.setAttributeNS(null, "y1", mouseEvents.clickY);
				
				previousX = mouseEvents.clickX;
				previousY = mouseEvents.clickY;
				mouseEvents.clickFlag = false;
			}
		}
		else
		{
			tempLineS.setAttributeNS(null, "x2", mouseEvents.mouseX);
			tempLineS.setAttributeNS(null, "y2", mouseEvents.mouseY);
			tempLineE.setAttributeNS(null, "x2", mouseEvents.mouseX);
			tempLineE.setAttributeNS(null, "y2", mouseEvents.mouseY);
			
			await new Promise(ret => setTimeout(ret, 20));
		}
	}
	
	document.getElementById("drawArea").removeChild(tempLineS);
	document.getElementById("drawArea").removeChild(tempLineE);
	
	mouseEvents.activeTool = "S_POLYGON";
}

//Color Functions
function ColorRGB(r, g, b)
{
	this.r = r;
	this.g = g;
	this.b = b;
}

function RGBToHex(inR, inG, inB)
{
	var r = Math.abs(inR).toString(16);
	var g = Math.abs(inG).toString(16);
	var b = Math.abs(inB).toString(16);
	
	if(r.length == 1)
		r = "0" + r;
	if(g.length == 1)
		g = "0" + g;
	if(b.length == 1)
		b = "0" + b;
	
	return "#" + r + g + b;
}

function HexToRGB(colorStr, colorObj)
{
	colorObj.r = parseInt(colorStr.substring(1, 3), 16);
	colorObj.g = parseInt(colorStr.substring(3, 5), 16);
	colorObj.b = parseInt(colorStr.substring(5, 7), 16);
}

//Math Functions
function RepZero(num, rep)
{
	if(num)
		return num;
	else
		return rep;
}

function RepLessOne(num, rep)
{
	if(num >= 1)
		return num;
	else
		return rep;
}

//Conversion Functions
function MatrixSVGToDOM(svg, dom)
{
	dom.a = svg.a;
	dom.b = svg.b;
	dom.c = svg.c;
	dom.d = svg.d;
	dom.e = svg.e;
	dom.f = svg.f;
}