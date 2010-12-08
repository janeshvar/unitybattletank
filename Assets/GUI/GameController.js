@script ExecuteInEditMode()

var gameTimer : float = 120.0;
// Game timer in seconds

var GUICustomSkin : GUISkin;
var gameTimerTextScale : float = 1.5;
var playerNameTextScale : float = 1.0;
var playerScoreTextScale : float = 1.0;
var gameOverTextScale : float = 2.0;

// Tank information
private var tankList : GameObject[];
private var texs : Texture2D[];
private var lights : Light[];
private var scores : int[];

// FPS GUI Info
var fpsCounterTextScale : float = 1.0;
private var fpsNum : int = 0;
private var fpsTimer : float = 0;
private var fpsFramesRendered : int = 0;


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
	if (GUICustomSkin)
		GUI.skin = GUICustomSkin;
	
	var tank : GameObject;
	var playerNum : int;
	var nameStr : String;
	var healthStr : String;
	var scoreStr : String;
	var tankDmg : TankDamage;
	var a : int;
	
	if(gameOver) {
		var winner : int = 0;
		var highScore : int = 0;
		if(!scores) {
			scores = new int[tankList.length];
			if(!tankList)
				return;
			for(a = 0; a < tankList.length; a++) {
				tank = tankList[a];
				tankDmg = tank.GetComponent(TankDamage);
				scores[a] = tankDmg.score;
				if(scores[a] > highScore) {
					highScore = scores[a];
					winner = a;
				}
			}
		}
		// Draw the Game Over text
		GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * gameOverTextScale);
		GUI.Label(Rect(10, 10, 160, 50), "Game Over", "MenuText");
		
		GUI.matrix = Matrix4x4.TRS(Vector3(0, 0, 0), Quaternion.identity, Vector3.one * playerNameTextScale);
		if(!tankList)
			return;
		for(a = 0; a < tankList.length; a++) {
			tank = tankList[a];
			playerNum = a + 1;
			nameStr = "Player: " + playerNum;
			healthStr = "Health: ";
			scoreStr = "Score: ";
			tankDmg = tank.GetComponent(TankDamage);
			
			if(tankDmg) {
				scoreStr += scores[a];
			} else {
				scoreStr += "0";
			}
			
			var xOffset : int = 10;
			var xDist : int = 60;
			if(a == winner) {
				xOffset += 30;
				xDist += 100;
			}
			var tempColora : Color = GUI.color;
			if(lights[a])  {
				GUI.color = Color(1, 1, 1, Mathf.Min(lights[a].intensity / 9.0, 1));
			}
			GUI.DrawTexture(Rect(xOffset - 3, 52 + 55 * a, xDist, 35), texs[a]);
			GUI.color = tempColora;
			if(a == winner)
				GUI.Label(Rect(xOffset + 80, 62 + 55 * a, 50, 50), "Winner!", "MenuText");
			GUI.Label(Rect(xOffset, 55 + 55 * a, 50, 50), nameStr, "MenuText");
			GUI.Label(Rect(xOffset, 70 + 55 * a, 50, 50), scoreStr, "MenuText");
		}
		
		
		
		return;
	}
	
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
	for(a = 0; a < tankList.length; a++) {
		tank = tankList[a];
		playerNum = a + 1;
		nameStr = "Player: " + playerNum;
		healthStr = "Health: ";
		scoreStr = "Score: ";
		tankDmg = tank.GetComponent(TankDamage);
		
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
	
	fpsFramesRendered++;
	if(fpsTimer >= 1) {
		fpsNum = fpsFramesRendered;
		fpsFramesRendered = 0;
		fpsTimer = 0;
	} else
		fpsTimer += Time.deltaTime;
	var fpsString : String = "FPS: " + parseInt(Mathf.Round(Mathf.Min(fpsNum, 100000)));
	GUI.Label(Rect(5, Screen.height - 20, 50, 50), fpsString, "MenuText");
}