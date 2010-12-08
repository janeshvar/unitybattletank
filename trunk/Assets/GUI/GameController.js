@script ExecuteInEditMode()

var gameTimer : float = 120.0;
// Game timer in seconds

var GUICustomSkin : GUISkin;
var gameTimerTextScale : float = 1.5;
var playerNameTextScale : float = 1.0;
var playerScoreTextScale : float = 1.0;

// Tank information
private var tankList : GameObject[];
private var texs : Texture2D[];
private var lights : Light[];

// FPS GUI Info
var fpsCounterTextScale : float = 1.0;
private var fpsNum : float = 0;
private var fpsTimer : int = 100;
private var currfpsTimer : int = fpsTimer;
private var fpsMiniUpdate : int = 10;
private var currfpsMiniTimer : int = fpsMiniUpdate;
private var fpsRunningTotal : float = 0;


// For knowing when the game is over
var gameOverBox : GameObject;
private var gameOver : boolean = false;



function Start () {
	tankList = GameObject.FindGameObjectsWithTag("Tank");
	for(var count : int = 0; count < tankList.length; count++) {
		tankList[count] = gameObject.Find("Player" + (count + 1) + "Tank");
	}
	
	texs = new Texture2D[tankList.length];
	lights = new Light[tankList.length];
	
	for(var i : int = 0; i < texs.length; i++)
		texs[i] = new Texture2D(16, 16, TextureFormat.ARGB32, false);
	
	for(var a : int = 0; a < tankList.length; a++) {
		var lightObject : GameObject;
		lightObject = tankList[a].Find("Light" + (a + 1));
		if(!lightObject)
			Debug.Log("Could not find \"Light\" GameObject attached to tank!");
		else {
			lights[a] = lightObject.light;
			if(!lights[a])
				Debug.Log("No \"Light\" component attached to the light");
			else {
				var color : Color = lights[a].color;
				color.r = color.r / 2.0;
				color.g = color.g / 2.0;
				color.b = color.b / 2.0;
				for(var x : int = 0; x < texs[a].width; x++)
					for(var y : int = 0; y < texs[a].height; y++)
						texs[a].SetPixel(x, y, color);
				texs[a].name = "Player" + a;
				texs[a].Apply();
			}
		}
	}
}




// This script should monitor for the number of tanks alive, as well as allow the tanks to ping() to get
// the position of the other tanks.
// This script should also be in charge of watching the game timer and ending the game when it hits 0.
function Update () {
	gameTimer -= Time.deltaTime;
	
	if(gameTimer <= 0 && !gameOver) {
		//Application.LoadLevel("GameOver");
		gameOver = true;
		Instantiate(gameOverBox);
	}
}


function OnGUI() {
	if(gameOver)
		return;
	if (GUICustomSkin)
		GUI.skin = GUICustomSkin;
	// Transform matrix for (trasform, rotate, scale) - This just allows automatic scaling for everything that uses this matrix
	// Setting GUI.matrix to some other value will only affect the GUI stuff below it
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * gameTimerTextScale);
	
	var minutes : int = gameTimer / 60;
	var seconds : int = gameTimer - (60 * minutes);
	var timerGUI : String = minutes.ToString() + ":";
	if(seconds < 10) {
		timerGUI = timerGUI + "0" + seconds.ToString();
	} else {
		timerGUI = timerGUI + seconds.ToString();
	}
	GUI.Label(Rect(5, 10, 50, 50), timerGUI, "MenuText");
	
	
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * playerNameTextScale);
	if(!tankList)
		return;
	for(var a : int = 0; a < tankList.length; a++) {
		var tank : GameObject = tankList[a];
		var playerNum : int = a + 1;
		var nameStr : String = "Player: " + playerNum;
		var healthStr : String = "Health: ";
		var scoreStr : String = "Score: ";
		var tankDmg : TankDamage = tank.GetComponent(TankDamage);
		
		if(tankDmg) {
			healthStr += tankDmg.health;
			scoreStr += tankDmg.score;
		} else {
			healthStr += "Dead";
			scoreStr += "0";
		}
		
		var xVal : int = Screen.width - 60;
		var tempColor : Color = GUI.color;
		if(lights[a])  {
			GUI.color = Color(1, 1, 1, Mathf.Min(lights[a].intensity / 9.0, 1));
		}
		GUI.DrawTexture(Rect(xVal - 3, 7 + 70 * a, 60, 50), texs[a]);
		GUI.color = tempColor;
		GUI.Label(Rect(xVal, 10 + 70 * a, 50, 50), nameStr, "MenuText");
		GUI.Label(Rect(xVal, 25 + 70 * a, 50, 50), healthStr, "MenuText");
		GUI.Label(Rect(xVal, 40 + 70 * a, 50, 50), scoreStr, "MenuText");
	}
	
	
	// Draw the FPS GUI item
	GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * fpsCounterTextScale);
	if(currfpsMiniTimer == fpsMiniUpdate) {
		fpsRunningTotal += 1 / Time.deltaTime;
		currfpsMiniTimer = 0;
	} else
		currfpsMiniTimer++;
	if(currfpsTimer >= fpsTimer) {
		fpsNum = fpsRunningTotal / (fpsTimer / fpsMiniUpdate);
		fpsRunningTotal = 0;
		currfpsTimer = 0;
	} else
		currfpsTimer++;
	var fpsString : String = "FPS: " + parseInt(Mathf.Round(Mathf.Min(fpsNum, 100000)));
	GUI.Label(Rect(5, Screen.height - 20, 50, 50), fpsString, "MenuText");
}